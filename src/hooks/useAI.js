import { useState, useCallback } from 'react';
import { aiService } from '../services/ai.service';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function useAI(options = {}) {
  const { model: defaultModel = 'claude', subject, level } = options;
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const { refreshCredits } = useAuth();

  const sendMessage = useCallback(async (message, opts = {}) => {
    const { model = defaultModel, stream = false, onChunk } = opts;
    if (!message?.trim()) return;

    setLoading(true);
    setError(null);
    if (!stream) setResponse('');

    const userMessage = { role: 'user', content: message };
    const updatedHistory = [...conversationHistory, userMessage];

    try {
      if (stream) {
        setStreaming(true);
        let fullContent = '';
        await aiService.streamChat(message, { model, subject, level, conversationHistory }, (chunk, full) => {
          fullContent = full;
          setResponse(full);
          onChunk && onChunk(chunk, full);
        });
        const assistantMessage = { role: 'assistant', content: fullContent };
        setConversationHistory([...updatedHistory, assistantMessage]);
        refreshCredits();
        return { success: true, content: fullContent };
      } else {
        const result = await aiService.chat(message, { model, subject, level, conversationHistory });
        if (result.success) {
          setResponse(result.content);
          const assistantMessage = { role: 'assistant', content: result.content };
          setConversationHistory([...updatedHistory, assistantMessage]);
          refreshCredits();
        } else {
          setError(result.error);
          toast.error(result.error || 'AI request failed');
        }
        return result;
      }
    } catch (err) {
      const msg = err.message || 'AI request failed';
      setError(msg);
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }, [conversationHistory, defaultModel, subject, level, refreshCredits]);

  const clearHistory = useCallback(() => {
    setConversationHistory([]);
    setResponse('');
    setError(null);
  }, []);

  return { sendMessage, loading, streaming, response, error, conversationHistory, clearHistory, setResponse };
}
