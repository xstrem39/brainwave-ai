import { useState, useRef, useEffect } from 'react';
import { useAI } from '../../hooks/useAI';
import { useAuth } from '../../context/AuthContext';
import { FaPaperPlane, FaRobot, FaUser, FaStop, FaCopy, FaTrash, FaSpinner } from 'react-icons/fa';
import { copyToClipboard, formatRelativeTime } from '../../utils/helpers';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import toast from 'react-hot-toast';

export default function ChatInterface({ title, placeholder, systemContext, model: initialModel = 'claude' }) {
  const [input, setInput] = useState('');
  const [model, setModel] = useState(initialModel);
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const { user, isAuthenticated } = useAuth();

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, streamContent]);

  const handleSend = async () => {
    if (!input.trim() || streaming) return;
    if (!isAuthenticated) { toast.error('Please login to use AI'); return; }

    const userMessage = { role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setStreaming(true);
    setStreamContent('');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const token = document.cookie.match(/brainwave_token=([^;]+)/)?.[1];
      const history = messages.map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          message: systemContext ? `${systemContext}\n\n${userInput}` : userInput,
          model,
          conversationHistory: history,
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error('Failed to connect to AI');

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
            if (parsed.content) { fullContent += parsed.content; setStreamContent(fullContent); }
            if (parsed.error) throw new Error(parsed.error);
          } catch {}
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullContent, model, timestamp: new Date() }]);
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast.error(err.message || 'AI request failed');
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', isError: true, timestamp: new Date() }]);
      }
    } finally {
      setStreaming(false);
      setStreamContent('');
      abortRef.current = null;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const stopGeneration = () => { abortRef.current?.abort(); };

  const clearChat = () => { setMessages([]); setStreamContent(''); toast.success('Chat cleared'); };

  const copyMessage = async (content) => {
    await copyToClipboard(content);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
        <div className="flex items-center gap-2 ml-auto">
          <select value={model} onChange={e => setModel(e.target.value)}
            className="bg-dark-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary-500">
            <option value="claude">Claude (Best)</option>
            <option value="openai">GPT-4o</option>
            <option value="gemini">Gemini Pro</option>
          </select>
          {messages.length > 0 && (
            <button onClick={clearChat} className="btn-ghost p-2 text-slate-400 hover:text-red-400 text-sm">
              <FaTrash size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        {messages.length === 0 && !streaming && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-primary-600/20 border border-primary-500/20 flex items-center justify-center mb-4">
              <FaRobot className="text-primary-400" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Ready to Help!</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              {placeholder || 'Ask me any academic question and I\'ll help you learn, solve problems, and excel in your studies.'}
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-primary-600/20 border border-primary-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <FaRobot className="text-primary-400" size={14} />
              </div>
            )}
            <div className={`max-w-3xl ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-ai'}`}>
              {msg.role === 'assistant' ? (
                <div className="prose-custom text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-dark-700 text-primary-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
                        );
                      },
                    }}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-white">{msg.content}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-500">{formatRelativeTime(msg.timestamp)}</span>
                {msg.role === 'assistant' && (
                  <button onClick={() => copyMessage(msg.content)} className="text-slate-600 hover:text-slate-400 transition-colors ml-auto">
                    <FaCopy size={11} />
                  </button>
                )}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0 mt-1">
                <FaUser className="text-white" size={14} />
              </div>
            )}
          </div>
        ))}

        {/* Streaming response */}
        {streaming && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-primary-600/20 border border-primary-500/20 flex items-center justify-center flex-shrink-0 mt-1">
              <FaRobot className="text-primary-400" size={14} />
            </div>
            <div className="chat-message-ai max-w-3xl">
              {streamContent ? (
                <div className="prose-custom text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamContent}</ReactMarkdown>
                  <span className="inline-block w-2 h-4 bg-primary-400 ml-0.5 animate-pulse" />
                </div>
              ) : (
                <div className="typing-dots flex gap-1 py-1">
                  <span /><span /><span />
                </div>
              )}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'Ask any academic question... (Enter to send, Shift+Enter for new line)'}
            rows={1}
            style={{ resize: 'none', minHeight: '52px', maxHeight: '200px' }}
            className="input-field pr-4 py-3.5 text-sm leading-relaxed w-full"
            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`; }}
            disabled={streaming}
          />
        </div>
        {streaming ? (
          <button onClick={stopGeneration} className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-all">
            <FaStop size={16} />
          </button>
        ) : (
          <button onClick={handleSend} disabled={!input.trim()}
            className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center text-white shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            <FaPaperPlane size={16} />
          </button>
        )}
      </div>
      <p className="text-xs text-slate-600 mt-2 text-center">BrainWave AI can make mistakes. Verify important information.</p>
    </div>
  );
}
