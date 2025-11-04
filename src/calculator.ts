import { Answer, TestResult, MBTIDimension, CognitiveFunction, TestType } from './types.js';
import { questionBank } from './questions.js';

// MBTI Type Descriptions
const typeDescriptions: Record<string, string> = {
  'INTJ': '建筑师 - 富有想象力和战略性的思想家，一切皆在计划之中',
  'INTP': '逻辑学家 - 具有创造力的发明家，对知识有着止不住的渴望',
  'ENTJ': '指挥官 - 大胆、想象力丰富且意志强大的领导者，总能找到或创造解决方法',
  'ENTP': '辩论家 - 聪明好奇的思想家，无法抗拒智力上的挑战',
  'INFJ': '提倡者 - 安静而神秘，同时鼓舞人心且不知疲倦的理想主义者',
  'INFP': '调停者 - 诗意、善良的利他主义者，总是热情地为正当理由提供帮助',
  'ENFJ': '主人公 - 有魅力鼓舞人心的领袖，有令听众着迷的能力',
  'ENFP': '竞选者 - 热情、有创造力、社交能力强的自由精神，总能找到理由微笑',
  'ISTJ': '物流师 - 实际且注重事实的个人，可靠性不容怀疑',
  'ISFJ': '守卫者 - 非常专注而温暖的守护者，时刻准备保护爱着的人们',
  'ESTJ': '总经理 - 出色的管理者，在管理事物或人的时候无与伦比',
  'ESFJ': '执政官 - 极有同情心、受欢迎且关心的合作者，总是热心地为他人提供帮助',
  'ISTP': '鉴赏家 - 大胆且实际的实验者，掌握各种工具的使用',
  'ISFP': '探险家 - 灵活有魅力的艺术家，时刻准备着探索和体验新事物',
  'ESTP': '企业家 - 聪明、精力充沛且非常敏锐的人，真心享受生活在边缘',
  'ESFP': '表演者 - 自发的、精力充沛和热情的表演者，有他们在就不会无聊',
};

// Cognitive Function Stacks for each type
const functionStacks: Record<string, CognitiveFunction[]> = {
  'INTJ': ['Ni', 'Te', 'Fi', 'Se'],
  'INTP': ['Ti', 'Ne', 'Si', 'Fe'],
  'ENTJ': ['Te', 'Ni', 'Se', 'Fi'],
  'ENTP': ['Ne', 'Ti', 'Fe', 'Si'],
  'INFJ': ['Ni', 'Fe', 'Ti', 'Se'],
  'INFP': ['Fi', 'Ne', 'Si', 'Te'],
  'ENFJ': ['Fe', 'Ni', 'Se', 'Ti'],
  'ENFP': ['Ne', 'Fi', 'Te', 'Si'],
  'ISTJ': ['Si', 'Te', 'Fi', 'Ne'],
  'ISFJ': ['Si', 'Fe', 'Ti', 'Ne'],
  'ESTJ': ['Te', 'Si', 'Ne', 'Fi'],
  'ESFJ': ['Fe', 'Si', 'Ne', 'Ti'],
  'ISTP': ['Ti', 'Se', 'Ni', 'Fe'],
  'ISFP': ['Fi', 'Se', 'Ni', 'Te'],
  'ESTP': ['Se', 'Ti', 'Fe', 'Ni'],
  'ESFP': ['Se', 'Fi', 'Te', 'Ni'],
};

export function calculateResult(answers: Answer[], testType: TestType): TestResult {
  if (testType === 'simplified') {
    return calculateSimplifiedResult(answers);
  } else {
    return calculateCognitiveResult(answers);
  }
}

function calculateSimplifiedResult(answers: Answer[]): TestResult {
  const dimensionScores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0,
  };

  // Dimension pairs mapping
  const oppositeDimension: Record<MBTIDimension, MBTIDimension> = {
    E: 'I', I: 'E',
    S: 'N', N: 'S',
    T: 'F', F: 'T',
    J: 'P', P: 'J',
  };

  // Calculate scores using opposed scoring method
  // 1 -> opposite+4, self+0
  // 2 -> opposite+3, self+1
  // 3 -> opposite+2, self+2
  // 4 -> opposite+1, self+3
  // 5 -> opposite+0, self+4
  answers.forEach(answer => {
    const question = questionBank.simplified.find(q => q.id === answer.questionId);
    if (!question || !question.dimension) return;

    const score = answer.score; // 1-5
    const dimension = question.dimension;
    const opposite = oppositeDimension[dimension];

    // Convert 1-5 score to opposed scoring
    const selfScore = score - 1; // 0-4
    const oppositeScore = 4 - selfScore; // 4-0

    dimensionScores[dimension] += selfScore;
    dimensionScores[opposite] += oppositeScore;
  });

  // Determine type by comparing pairs
  const type =
    (dimensionScores.E >= dimensionScores.I ? 'E' : 'I') +
    (dimensionScores.S >= dimensionScores.N ? 'S' : 'N') +
    (dimensionScores.T >= dimensionScores.F ? 'T' : 'F') +
    (dimensionScores.J >= dimensionScores.P ? 'J' : 'P');

  return {
    mbtiType: type,
    dimensionScores,
    description: typeDescriptions[type] || '未知类型',
  };
}

function calculateCognitiveResult(answers: Answer[]): TestResult {
  const functionScores: Record<CognitiveFunction, number> = {
    Ne: 0, Ni: 0,
    Se: 0, Si: 0,
    Te: 0, Ti: 0,
    Fe: 0, Fi: 0,
  };

  // Calculate scores for each cognitive function
  answers.forEach(answer => {
    const question = questionBank.cognitive.find(q => q.id === answer.questionId);
    if (!question || !question.cognitiveFunction) return;

    const score = answer.score; // 1-5
    functionScores[question.cognitiveFunction] += score;
  });

  // Determine dominant and auxiliary functions
  const sortedFunctions = (Object.entries(functionScores) as [CognitiveFunction, number][])
    .sort((a, b) => b[1] - a[1]);

  const dominant = sortedFunctions[0][0];
  const auxiliary = sortedFunctions[1][0];

  // Find MBTI type based on function stack
  let mbtiType = 'XXXX';
  for (const [type, stack] of Object.entries(functionStacks)) {
    if (stack[0] === dominant && stack[1] === auxiliary) {
      mbtiType = type;
      break;
    }
  }

  // If no exact match, try to infer from dominant function
  if (mbtiType === 'XXXX') {
    mbtiType = inferTypeFromDominant(dominant, auxiliary);
  }

  return {
    mbtiType,
    cognitiveFunctionScores: functionScores,
    functionStack: functionStacks[mbtiType],
    description: typeDescriptions[mbtiType] || '未知类型',
  };
}

function inferTypeFromDominant(dominant: CognitiveFunction, auxiliary: CognitiveFunction): string {
  // Mapping from dominant function to possible types
  const dominantMap: Record<CognitiveFunction, string[]> = {
    'Ni': ['INTJ', 'INFJ'],
    'Ne': ['ENTP', 'ENFP'],
    'Si': ['ISTJ', 'ISFJ'],
    'Se': ['ESTP', 'ESFP'],
    'Ti': ['INTP', 'ISTP'],
    'Te': ['ENTJ', 'ESTJ'],
    'Fi': ['INFP', 'ISFP'],
    'Fe': ['ENFJ', 'ESFJ'],
  };

  const possibleTypes = dominantMap[dominant] || [];

  // Try to narrow down using auxiliary function
  for (const type of possibleTypes) {
    if (functionStacks[type][1] === auxiliary) {
      return type;
    }
  }

  // Return first possible type if no match
  return possibleTypes[0] || 'INTP';
}
