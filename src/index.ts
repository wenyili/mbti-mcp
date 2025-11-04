#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { questionBank } from './questions.js';
import { calculateResult } from './calculator.js';
import { TestSession, Answer, TestType } from './types.js';

const server = new Server(
  {
    name: 'mbti-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool: Start Test
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'start_mbti_test',
        description: '开始MBTI人格测试。用户可以选择测试类型：simplified(简化版28题)或cognitive(认知功能版48题)。返回第一道题目和测试会话状态。',
        inputSchema: {
          type: 'object',
          properties: {
            testType: {
              type: 'string',
              enum: ['simplified', 'cognitive'],
              description: '测试类型：simplified(简化版)或cognitive(认知功能版)',
            },
          },
          required: ['testType'],
        },
      },
      {
        name: 'answer_question',
        description: '提交当前问题的答案(1-5分)，并获取下一题或测试进度。需要传入完整的测试会话状态。',
        inputSchema: {
          type: 'object',
          properties: {
            session: {
              type: 'object',
              description: '测试会话状态，包含testType、answers数组和currentQuestionIndex',
              properties: {
                testType: { type: 'string' },
                answers: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      questionId: { type: 'number' },
                      score: { type: 'number' },
                    },
                  },
                },
                currentQuestionIndex: { type: 'number' },
              },
              required: ['testType', 'answers', 'currentQuestionIndex'],
            },
            score: {
              type: 'number',
              description: '对当前问题的回答(1=强烈不同意, 2=不同意, 3=中立, 4=同意, 5=强烈同意)',
              minimum: 1,
              maximum: 5,
            },
          },
          required: ['session', 'score'],
        },
      },
      {
        name: 'get_progress',
        description: '查询当前测试进度。需要传入测试会话状态。',
        inputSchema: {
          type: 'object',
          properties: {
            session: {
              type: 'object',
              description: '测试会话状态',
              properties: {
                testType: { type: 'string' },
                answers: { type: 'array' },
                currentQuestionIndex: { type: 'number' },
              },
              required: ['testType', 'answers', 'currentQuestionIndex'],
            },
          },
          required: ['session'],
        },
      },
      {
        name: 'calculate_mbti_result',
        description: '根据所有答案计算最终的MBTI类型和详细结果。需要传入完整的测试会话状态。',
        inputSchema: {
          type: 'object',
          properties: {
            session: {
              type: 'object',
              description: '测试会话状态，必须包含所有题目的答案',
              properties: {
                testType: { type: 'string' },
                answers: { type: 'array' },
                currentQuestionIndex: { type: 'number' },
              },
              required: ['testType', 'answers', 'currentQuestionIndex'],
            },
          },
          required: ['session'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: '缺少参数' }) }],
      isError: true,
    };
  }

  try {
    if (name === 'start_mbti_test') {
      const testType = args.testType as TestType;
      const questions = testType === 'simplified'
        ? questionBank.simplified
        : questionBank.cognitive;

      const session: TestSession = {
        testType,
        answers: [],
        currentQuestionIndex: 0,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              message: `测试已开始！共${questions.length}题。`,
              testType,
              currentQuestion: {
                index: 1,
                total: questions.length,
                question: questions[0],
              },
              session,
              instruction: '请使用1-5分评分：1=强烈不同意, 2=不同意, 3=中立, 4=同意, 5=强烈同意',
            }, null, 2),
          },
        ],
      };
    }

    if (name === 'answer_question') {
      const session = args.session as TestSession;
      const score = args.score as number;

      const questions = session.testType === 'simplified'
        ? questionBank.simplified
        : questionBank.cognitive;

      const currentQuestion = questions[session.currentQuestionIndex];

      // Save answer
      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        score,
      };

      const updatedSession: TestSession = {
        ...session,
        answers: [...session.answers, newAnswer],
        currentQuestionIndex: session.currentQuestionIndex + 1,
      };

      // Check if test is complete
      if (updatedSession.currentQuestionIndex >= questions.length) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: '所有问题已回答完毕！',
                completed: true,
                progress: {
                  answered: updatedSession.answers.length,
                  total: questions.length,
                },
                session: updatedSession,
                nextStep: '请使用 calculate_mbti_result 工具计算你的MBTI类型',
              }, null, 2),
            },
          ],
        };
      }

      // Return next question
      const nextQuestion = questions[updatedSession.currentQuestionIndex];
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              message: '答案已记录',
              progress: {
                answered: updatedSession.answers.length,
                total: questions.length,
              },
              nextQuestion: {
                index: updatedSession.currentQuestionIndex + 1,
                total: questions.length,
                question: nextQuestion,
              },
              session: updatedSession,
            }, null, 2),
          },
        ],
      };
    }

    if (name === 'get_progress') {
      const session = args.session as TestSession;
      const questions = session.testType === 'simplified'
        ? questionBank.simplified
        : questionBank.cognitive;

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              testType: session.testType,
              progress: {
                answered: session.answers.length,
                total: questions.length,
                percentage: Math.round((session.answers.length / questions.length) * 100),
              },
              completed: session.answers.length >= questions.length,
            }, null, 2),
          },
        ],
      };
    }

    if (name === 'calculate_mbti_result') {
      const session = args.session as TestSession;
      const questions = session.testType === 'simplified'
        ? questionBank.simplified
        : questionBank.cognitive;

      if (session.answers.length < questions.length) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: '测试尚未完成',
                progress: {
                  answered: session.answers.length,
                  total: questions.length,
                },
              }, null, 2),
            },
          ],
        };
      }

      const result = calculateResult(session.answers, session.testType);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              message: '测试完成！',
              result,
            }, null, 2),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: '未知工具' }),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error instanceof Error ? error.message : '未知错误',
          }),
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MBTI MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
