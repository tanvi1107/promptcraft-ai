const { GoogleGenAI } = require('@google/genai');

// Initialize GoogleGenAI client
// It will be initialized inside the request handler or globally
// If the key is not set immediately at boot, we check it at request-time.
let ai;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Category specific details to guide the prompt optimization
const CATEGORY_GUIDELINES = {
  Coding: {
    persona: 'Principal Software Architect and Expert Coding Assistant',
    focus: 'Specify programming language and frameworks, modularity, security, performance, input validation, robust error handling, testability, and docstrings.',
    bestPractices: 'Add request for step-by-step logic review, clean code principles, and complexity constraints (Big O).'
  },
  'UI/UX': {
    persona: 'Senior Product Designer and UI/UX Usability Expert',
    focus: 'Enforce user-centric design principles, accessibility guidelines (WCAG), detailed responsive grids, layout hierarchy, clear design tokens, visual feedback, and user flow pathways.',
    bestPractices: 'Specify interface states (empty, loading, success, error) and layout constraints.'
  },
  Marketing: {
    persona: 'Elite Growth Marketer and Copywriting Strategist',
    focus: 'Identify explicit target audience segments, clear value propositions, unique positioning statements, strong Call to Action (CTA), psychological hooks, and distribution channel constraints (SEO, Social, Email).',
    bestPractices: 'Incorporate frameworks like AIDA (Attention, Interest, Desire, Action) and length guidelines.'
  },
  'Content Writing': {
    persona: 'Master Content Strategist, Editor, and Creative Writer',
    focus: 'Define specific tone of voice (e.g., authoritative, conversational), readability score target, structural layouts (headings, bullet points), narrative arcs, hooks, and keyword density.',
    bestPractices: 'Instruct on sentence length variance, avoiding clichés, and starting with a compelling hook.'
  },
  Business: {
    persona: 'Senior Management Consultant and Corporate Strategy Adviser',
    focus: 'Clarify target stakeholders, strategic objectives, financial metrics/frameworks, SWOT structure, actionable recommendations, and risk assessment parameters.',
    bestPractices: 'Focus on data-driven reasoning, executive summarization, and clear business models.'
  },
  'Startup Ideas': {
    persona: 'Venture Capital Partner and Serial Tech Founder',
    focus: 'Outline product-market fit criteria, monetization mechanisms, unit economics, go-to-market strategies, user acquisition loops, and competitive moat analysis.',
    bestPractices: 'Enforce frameworks like Lean Canvas, problem-solution validation, and scalability checks.'
  },
  'Image Generation': {
    persona: 'Master AI Prompt Engineer and Visual Creative Director',
    focus: 'Describe subject matter in detail, background scenery, exact art medium (e.g. photorealism, oil painting, 3D render), lighting specs (e.g. volumetric, golden hour), camera angle, lens size, rendering engines, and aspect ratios.',
    bestPractices: 'Use descriptive descriptors, avoid generic words like "photorealistic", and instead use camera details (e.g., "shot on 85mm lens, f/1.4").'
  },
  'Resume Building': {
    persona: 'Executive Recruiter and ATS Optimization Expert',
    focus: 'Structure with clean sections (Summary, Skills, Experience), enforce active action verbs, direct formatting rules, ATS compatibility, and metric-driven impact phrasing (X-Y-Z formula).',
    bestPractices: 'Target specific job descriptions, focus on quantifiable results, and ensure clean typography instructions.'
  }
};

// Level specific guidelines
const LEVEL_CONFIG = {
  Basic: {
    description: 'Optimize the prompt for clarity, resolve grammatical ambiguities, and structure it simply. Keep it short and direct.',
    instructions: 'Reorganize the input into a clear, direct directive. Ensure spelling, grammar, and intent are perfectly clarified. Do not add excessive structure; just make it a clean, direct instruction.'
  },
  Professional: {
    description: 'Add a professional persona, define clear task objectives, specify clear constraints, and structure the expected output format.',
    instructions: 'Transform the prompt into a professional system-style instruction. 1. Establish an expert role/persona. 2. Define the main objective clearly. 3. List 4-6 specific constraints or rules. 4. Specify the exact expected format or structure of the output. 5. Include instructions for tone and style.'
  },
  Expert: {
    description: 'Generate a highly detailed, comprehensive prompt template with variables, strict rules, reasoning directives (Chain of Thought), and edge-case handling guidelines.',
    instructions: 'Deconstruct the input and rewrite it into an advanced, modular prompt template. Your response must include: \n- **System Role**: A powerful expert persona.\n- **Context & Goal**: In-depth description of background and objectives.\n- **Step-by-Step Instructions**: A strict sequence of operations (Chain of Thought) the model must follow.\n- **Constraints & Edge Cases**: Explicit rules on what to avoid, how to handle edge cases, and safety checks.\n- **Variables**: Identify placeholders in `[brackets]` for customizable fields.\n- **Output Format Template**: A structured layout template (e.g., Markdown blocks) for the final response.'
  }
};

/**
 * Controller to handle POST /api/enhance
 */
exports.enhancePrompt = async (req, res, next) => {
  try {
    const { prompt, category, level } = req.body;

    // Retrieve category and level rules
    const catGuide = CATEGORY_GUIDELINES[category];
    const lvlGuide = LEVEL_CONFIG[level];

    // Ensure Client is initialized
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is missing on the server. Please configure GEMINI_API_KEY in the backend .env file.'
      });
    }

    if (!ai) {
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }

    // Construct System Prompt
    const systemPrompt = `You are an expert Prompt Engineer, Prompt Architect, and UI/UX Prompt Copywriter.
Your goal is to optimize a rough user prompt and turn it into a high-performing, professional-grade prompt for an LLM.

Target Domain/Category: ${category}
Role to assume for target: ${catGuide.persona}
Key Domain Focus: ${catGuide.focus}
Domain Best Practices: ${catGuide.bestPractices}

Enhancement Level: ${level}
Level Goal: ${lvlGuide.description}
Formatting Instructions: ${lvlGuide.instructions}

CRITICAL RULES:
1. Preserve the user's original core meaning, intent, and target audience. Do not change the topic.
2. Make the final prompt highly specific, actionable, and structured.
3. Your output should contain ONLY the ready-to-use enhanced prompt itself. Do not include intros (like "Here is your enhanced prompt:") or outros.
4. Output the prompt directly in a clean, professional, readable format using standard Markdown where appropriate.
5. Complete every section before ending the response.
6. Never leave numbered lists unfinished.
7. Ensure the final output is fully complete do not end mid-sentence or mid-thought.`;
    // Call Google Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Enhance the following rough prompt:\n\n"""\n${prompt}\n"""`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 8192,
      }
    });

console.log("Response length:", response.text?.length);
console.log("Response:", response.text);

const enhancedPrompt = response.text ? response.text.trim() : '';
    if (!enhancedPrompt) {
      throw new Error('Received empty content from Gemini API.');
    }

    return res.json({
      enhancedPrompt
    });

  } catch (error) {
    console.error('Error in enhancePrompt controller:', error);
    
    // Check for specific authentication error signature
    if (error.status === 401 || error.message?.includes('API key') || error.message?.includes('API_KEY')) {
      return res.status(401).json({
        error: 'Authentication failed. Please verify your Google Gemini API key is valid.'
      });
    }

    return res.status(500).json({
      error: `Failed to enhance prompt: ${error.message || 'Unknown API Error'}`
    });
  }
};
