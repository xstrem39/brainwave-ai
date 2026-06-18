import api from './api';

export const aiService = {
  async chat(message, options = {}) {
    const { model = 'claude', subject, level, conversationHistory = [] } = options;
    return api.post('/ai/chat', { message, model, subject, level, conversationHistory });
  },

  async streamChat(message, options = {}, onChunk) {
    const { model = 'claude', subject, level, conversationHistory = [] } = options;
    const token = typeof window !== 'undefined'
      ? document.cookie.match(/brainwave_token=([^;]+)/)?.[1]
      : null;

    const response = await fetch('/api/ai/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ message, model, subject, level, conversationHistory }),
    });

    if (!response.ok) throw new Error('Stream failed');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
      for (const line of lines) {
        const data = line.substring(6);
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          if (parsed.content) {
            fullContent += parsed.content;
            onChunk && onChunk(parsed.content, fullContent);
          }
        } catch {}
      }
    }

    return { success: true, content: fullContent };
  },

  async generateImage(prompt, options = {}) {
    const { type = 'realistic', size = '1024x1024', quality = 'hd' } = options;
    return api.post('/ai/image', { prompt, type, size, quality });
  },

  async analyzeImage(imageUrl, question) {
    return api.post('/ai/analyze-image', { imageUrl, question });
  },

  async extractText(fileUrl, fileType) {
    return api.post('/ai/ocr', { fileUrl, fileType });
  },

  async generatePresentation(topic, options = {}) {
    const { slides = 10, level = 'undergraduate', includeImages = false } = options;
    return api.post('/ai/presentation', { topic, slides, level, includeImages });
  },

  async solveEquation(equation, subject = 'mathematics') {
    return api.post('/ai/solve', { equation, subject });
  },

  async generateQuiz(subject, topic, count = 10, difficulty = 'medium') {
    return api.post('/quiz/generate', { subject, topic, count, difficulty });
  },

  async generateCitation(source, format = 'APA') {
    return api.post('/research/citation', { source, format });
  },

  async summarize(text, length = 'medium') {
    return api.post('/ai/summarize', { text, length });
  },

  async generateFlashcards(text, count = 10) {
    return api.post('/ai/flashcards', { text, count });
  },

  async paraphrase(text, style = 'academic') {
    return api.post('/ai/paraphrase', { text, style });
  },

  async checkGrammar(text) {
    return api.post('/ai/grammar', { text });
  },
};
