import { Question, QuestionBank } from './types.js';

// Simplified Test Questions (28 questions, 7 per dimension pair)
const simplifiedQuestions: Question[] = [
  // E vs I (Extraversion vs Introversion)
  { id: 1, text: "我在社交聚会上感到精力充沛", dimension: 'E' },
  { id: 2, text: "独处时我能更好地恢复精力", dimension: 'I' },
  { id: 3, text: "我喜欢成为众人关注的焦点", dimension: 'E' },
  { id: 4, text: "我更喜欢一对一的深入交谈而非群体讨论", dimension: 'I' },
  { id: 5, text: "我倾向于先说后想", dimension: 'E' },
  { id: 6, text: "我需要时间独自思考后再表达观点", dimension: 'I' },
  { id: 7, text: "我很容易结识新朋友", dimension: 'E' },

  // S vs N (Sensing vs Intuition)
  { id: 8, text: "我更关注具体的事实和细节", dimension: 'S' },
  { id: 9, text: "我喜欢探索抽象概念和可能性", dimension: 'N' },
  { id: 10, text: "我倾向于按部就班地完成任务", dimension: 'S' },
  { id: 11, text: "我经常思考未来的各种可能性", dimension: 'N' },
  { id: 12, text: "我更信任实际经验而非理论", dimension: 'S' },
  { id: 13, text: "我喜欢探索事物背后的深层含义", dimension: 'N' },
  { id: 14, text: "我注重眼前的实际问题", dimension: 'S' },

  // T vs F (Thinking vs Feeling)
  { id: 15, text: "做决定时，我更看重逻辑分析", dimension: 'T' },
  { id: 16, text: "做决定时，我会优先考虑对他人的影响", dimension: 'F' },
  { id: 17, text: "我认为客观公正比人情更重要", dimension: 'T' },
  { id: 18, text: "我很容易理解和感受他人的情绪", dimension: 'F' },
  { id: 19, text: "批评他人时我能保持直接和客观", dimension: 'T' },
  { id: 20, text: "我倾向于寻求和谐，避免冲突", dimension: 'F' },
  { id: 21, text: "我更看重效率而非人际关系", dimension: 'T' },

  // J vs P (Judging vs Perceiving)
  { id: 22, text: "我喜欢提前制定详细计划", dimension: 'J' },
  { id: 23, text: "我更喜欢保持灵活，随机应变", dimension: 'P' },
  { id: 24, text: "截止日期临近时我会感到焦虑", dimension: 'J' },
  { id: 25, text: "我在压力下反而更有创造力", dimension: 'P' },
  { id: 26, text: "我倾向于快速做决定并执行", dimension: 'J' },
  { id: 27, text: "我喜欢探索多种选项，推迟决定", dimension: 'P' },
  { id: 28, text: "有序的环境让我感到舒适", dimension: 'J' },
];

// Cognitive Function Test Questions (48 questions, 6 per function)
const cognitiveQuestions: Question[] = [
  // Ne (Extraverted Intuition) - 探索可能性，发散思维
  { id: 101, text: "我喜欢头脑风暴，想出各种创意点子", cognitiveFunction: 'Ne' },
  { id: 102, text: "我经常看到事物之间意想不到的联系", cognitiveFunction: 'Ne' },
  { id: 103, text: "我倾向于同时探索多个想法和项目", cognitiveFunction: 'Ne' },
  { id: 104, text: "我喜欢讨论抽象概念和理论可能性", cognitiveFunction: 'Ne' },
  { id: 105, text: "我容易对新奇的想法感到兴奋", cognitiveFunction: 'Ne' },
  { id: 106, text: "我善于发现问题的多种解决方案", cognitiveFunction: 'Ne' },

  // Ni (Introverted Intuition) - 洞察本质，预见未来
  { id: 107, text: "我经常有突如其来的深刻领悟", cognitiveFunction: 'Ni' },
  { id: 108, text: "我能预见事情的长远发展趋势", cognitiveFunction: 'Ni' },
  { id: 109, text: "我倾向于寻找事物的深层意义", cognitiveFunction: 'Ni' },
  { id: 110, text: "我有强烈的直觉，知道事情会如何发展", cognitiveFunction: 'Ni' },
  { id: 111, text: "我喜欢专注于一个深刻的想法或愿景", cognitiveFunction: 'Ni' },
  { id: 112, text: "我擅长将复杂信息整合成统一的理解", cognitiveFunction: 'Ni' },

  // Se (Extraverted Sensing) - 感知当下，行动导向
  { id: 113, text: "我喜欢体验感官刺激和新鲜体验", cognitiveFunction: 'Se' },
  { id: 114, text: "我能快速注意到环境中的变化", cognitiveFunction: 'Se' },
  { id: 115, text: "我更喜欢行动而非空谈", cognitiveFunction: 'Se' },
  { id: 116, text: "我活在当下，享受此刻的经历", cognitiveFunction: 'Se' },
  { id: 117, text: "我对美感和艺术细节很敏感", cognitiveFunction: 'Se' },
  { id: 118, text: "我在危机时刻能够快速反应", cognitiveFunction: 'Se' },

  // Si (Introverted Sensing) - 记忆经验，重视传统
  { id: 119, text: "我依赖过去的经验来处理当前问题", cognitiveFunction: 'Si' },
  { id: 120, text: "我重视传统和既定的做事方式", cognitiveFunction: 'Si' },
  { id: 121, text: "我对细节有很好的记忆力", cognitiveFunction: 'Si' },
  { id: 122, text: "我喜欢熟悉的环境和常规", cognitiveFunction: 'Si' },
  { id: 123, text: "我会仔细比较现在和过去的经历", cognitiveFunction: 'Si' },
  { id: 124, text: "我注重保持个人习惯和仪式感", cognitiveFunction: 'Si' },

  // Te (Extraverted Thinking) - 逻辑组织，高效执行
  { id: 125, text: "我擅长组织和系统化信息", cognitiveFunction: 'Te' },
  { id: 126, text: "我注重效率和生产力", cognitiveFunction: 'Te' },
  { id: 127, text: "我倾向于用客观标准评估事物", cognitiveFunction: 'Te' },
  { id: 128, text: "我喜欢制定明确的目标和计划", cognitiveFunction: 'Te' },
  { id: 129, text: "我会直接指出逻辑错误", cognitiveFunction: 'Te' },
  { id: 130, text: "我重视可衡量的结果", cognitiveFunction: 'Te' },

  // Ti (Introverted Thinking) - 内在逻辑，分析框架
  { id: 131, text: "我喜欢建立自己的逻辑框架和理论", cognitiveFunction: 'Ti' },
  { id: 132, text: "我需要深入理解事物的运作原理", cognitiveFunction: 'Ti' },
  { id: 133, text: "我擅长发现逻辑不一致之处", cognitiveFunction: 'Ti' },
  { id: 134, text: "我倾向于质疑和分析既有观点", cognitiveFunction: 'Ti' },
  { id: 135, text: "我追求思维的精确性和一致性", cognitiveFunction: 'Ti' },
  { id: 136, text: "我喜欢解构复杂问题并理解其本质", cognitiveFunction: 'Ti' },

  // Fe (Extraverted Feeling) - 情感和谐，关注他人
  { id: 137, text: "我很在意群体的情绪氛围", cognitiveFunction: 'Fe' },
  { id: 138, text: "我擅长让他人感到舒适和被接纳", cognitiveFunction: 'Fe' },
  { id: 139, text: "我能快速察觉他人的情绪变化", cognitiveFunction: 'Fe' },
  { id: 140, text: "我倾向于表达情感以建立联系", cognitiveFunction: 'Fe' },
  { id: 141, text: "我重视社会和谐和集体利益", cognitiveFunction: 'Fe' },
  { id: 142, text: "我会主动帮助他人解决情感问题", cognitiveFunction: 'Fe' },

  // Fi (Introverted Feeling) - 内在价值，真实自我
  { id: 143, text: "我有强烈的个人价值观和道德准则", cognitiveFunction: 'Fi' },
  { id: 144, text: "我需要保持真实，忠于自我", cognitiveFunction: 'Fi' },
  { id: 145, text: "我对不公正的事情有强烈的情感反应", cognitiveFunction: 'Fi' },
  { id: 146, text: "我深刻理解自己的情感和动机", cognitiveFunction: 'Fi' },
  { id: 147, text: "我倾向于为弱势群体发声", cognitiveFunction: 'Fi' },
  { id: 148, text: "我重视情感的深度而非表达", cognitiveFunction: 'Fi' },
];

export const questionBank: QuestionBank = {
  simplified: simplifiedQuestions,
  cognitive: cognitiveQuestions,
};
