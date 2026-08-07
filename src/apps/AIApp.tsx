import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, Sparkles, Key, Trash2, ExternalLink } from 'lucide-react';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 border border-white/10 rounded-xl overflow-hidden shadow-2xl bg-slate-950 font-mono text-[10px]">
      <div className="flex justify-between items-center px-3.5 py-1.5 bg-slate-900 border-b border-white/5 select-none text-[8px] font-bold text-slate-400 font-sans tracking-wide">
        <span className="uppercase text-indigo-400">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="hover:text-white transition flex items-center space-x-1"
        >
          <span>{copied ? 'COPIED!' : 'COPY'}</span>
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-emerald-400 select-text leading-normal scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const AIApp: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showKeyPanel, setShowKeyPanel] = useState(false);
  
  // Load API keys
  const envKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('khushal_os_gemini_api_key') || '';
  });
  const [tempKey, setTempKey] = useState('');

  const activeKey = envKey || apiKey;
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSaveKey = () => {
    if (!tempKey.trim()) return;
    localStorage.setItem('khushal_os_gemini_api_key', tempKey.trim());
    setApiKey(tempKey.trim());
    setTempKey('');
    setShowKeyPanel(false);
    setMessages((prev) => [
      ...prev,
      {
        sender: 'bot',
        text: "🔑 **Gemini API Key Connected successfully!** Switched to Online Cloud AI mode.",
        timestamp: new Date()
      }
    ]);
  };

  const handleClearKey = () => {
    localStorage.removeItem('khushal_os_gemini_api_key');
    setApiKey('');
    setShowKeyPanel(false);
    setMessages((prev) => [
      ...prev,
      {
        sender: 'bot',
        text: "🗑️ **API Key removed.** Switched back to Offline Local Simulation mode.",
        timestamp: new Date()
      }
    ]);
  };

  // Smart local simulation response engine
  const getLocalResponse = (query: string): string => {
    const q = query.toLowerCase().trim();

    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('welcome') || q.includes('greetings')) {
      return "Hello! I am **CortexAI**, your system assistant. I am currently running in **Offline Simulation Mode**.\n\nYou can talk to me about coding, ask for a joke, or query system specs. To unlock full cloud intelligence, configure a Gemini API key using the key icon at the top right!";
    }

    if (q.includes('joke') || q.includes('humor') || q.includes('laugh')) {
      const jokes = [
        "Why do programmers wear glasses?\n\nBecause they can't **C#**! 🤓",
        "There are **10** types of people in the world:\nThose who understand binary, and those who don't. 🤖",
        "How many programmers does it take to change a light bulb?\n\nNone. It's a hardware problem! 💡"
      ];
      return `${jokes[Math.floor(Math.random() * jokes.length)]}\n\n*Tip: Connect a Gemini API key to get infinite, fresh jokes from the AI!*`;
    }

    if (q.includes('code') || q.includes('function') || q.includes('program') || q.includes('javascript') || q.includes('python')) {
      return "Here is a clean **JavaScript** utility function to format numbers as currency:\n\n```javascript\nfunction formatCurrency(amount) {\n  return new Intl.NumberFormat('en-US', {\n    style: 'currency',\n    currency: 'USD'\n  }).format(amount);\n}\nconsole.log(formatCurrency(1250.5)); // Outputs: $1,250.50\n```\n\n*Connect a Gemini API key to generate customized scripts for any coding problem.*";
    }

    if (q.includes('physics') || q.includes('quantum') || q.includes('science')) {
      return "Quantum physics is the study of matter and energy at the nanoscopic scale. It operates under fascinating rules:\n• **Superposition**: Particles exist in all possible states simultaneously until measured.\n• **Wave-Particle Duality**: Light and matter exhibit properties of both waves and particles.\n\n*Connect a Gemini API key to explore advanced scientific theories!*";
    }

    if (q.includes('help') || q.includes('specs') || q.includes('features')) {
      return "Here is what I can assist you with offline:\n1. **Off-grid Chat**: Basic conversational topics (Greetings, Coding, Jokes, Science).\n2. **System Details**: Info about this React-based desktop portfolio.\n3. **API Upgrade**: Connect a free Google Gemini key to talk about any topic!";
    }

    return `I am currently running offline in **Local Simulation Mode**.\n\nI received your message: *"${query}"*.\n\nTo have a real, unlimited conversation about this topic with Gemini, click the **Key icon** in the top right and enter a Gemini API Key. It takes less than a minute and is completely free!`;
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // If no key is set, fall back to offline simulation
    if (!activeKey) {
      setTimeout(() => {
        const localReply = getLocalResponse(textToSend);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: localReply,
            timestamp: new Date()
          }
        ]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    // Otherwise, call Gemini API
    try {
      const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
      
      messages.forEach((msg) => {
        if (msg.text.includes('Key Connected') || msg.text.includes('API Key removed')) {
          return;
        }
        
        const role = msg.sender === 'user' ? 'user' : 'model';
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts[0].text += `\n${msg.text}`;
        } else {
          contents.push({
            role,
            parts: [{ text: msg.text }]
          });
        }
      });

      contents.push({
        role: 'user',
        parts: [{ text: textToSend }]
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: "You are a helpful, highly intelligent, and friendly AI chatbot assistant inside an interactive gaming portfolio OS. You can talk to anyone about anything they desire. Keep your answers concise, structured, and friendly, using markdown format where applicable." }]
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.error?.message || `HTTP error ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!botText) {
        throw new Error("Received empty or invalid response content from Gemini API.");
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botText,
          timestamp: new Date()
        }
      ]);
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `⚠️ **Error communicating with Gemini API:**\n${err.message || 'Check your internet connection and verify if the API Key is active and correct.'}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessageText = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, idx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeLines = part.slice(3, -3).trim().split('\n');
        let language = '';
        let code = part.slice(3, -3).trim();
        if (codeLines[0] && !codeLines[0].includes(' ') && codeLines[0].length < 15) {
          language = codeLines[0];
          code = codeLines.slice(1).join('\n');
        }
        return <CodeBlock key={idx} code={code} language={language} />;
      }

      const lines = part.split('\n');
      return (
        <React.Fragment key={idx}>
          {lines.map((line, lIdx) => {
            const inlineParts = line.split(/(\*\*.*?\*\*)/g);
            const renderedLine = inlineParts.map((subPart, sIdx) => {
              if (subPart.startsWith('**') && subPart.endsWith('**')) {
                return <strong key={sIdx} className="text-white font-semibold">{subPart.slice(2, -2)}</strong>;
              }
              return subPart;
            });

            return (
              <div key={lIdx} className={lIdx > 0 ? 'mt-1' : ''}>
                {renderedLine}
              </div>
            );
          })}
        </React.Fragment>
      );
    });
  };

  const suggestionChips = [
    "Explain Quantum Physics simply",
    "Write a coding joke",
    "How to make a perfect espresso?",
    "Recommend a sci-fi book"
  ];

  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-gradient-to-br from-slate-950 via-slate-950 to-indigo-950/40 font-sans select-text relative">
      
      {/* Sleek App Header Title Bar */}
      <div className="px-4 py-3 bg-slate-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-indigo-600/10 border border-indigo-500/30 rounded-xl text-indigo-400 relative">
            <Bot size={15} className="animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200 tracking-wide font-mono uppercase">Cortex AI Assistant</div>
            <div className="text-[9px] text-slate-500 font-mono flex items-center space-x-1 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${activeKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
              <span className="text-slate-400">{activeKey ? 'Online & Active' : 'Offline Simulation'}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowKeyPanel(!showKeyPanel)}
          className={`p-1.5 rounded-lg border transition-all ${
            showKeyPanel 
              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
              : 'bg-slate-900/60 border-white/5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-white/10'
          }`}
          title="API Configuration"
        >
          <Key size={12} />
        </button>
      </div>

      {/* Slide down API settings panel */}
      {showKeyPanel && (
        <div className="absolute top-[45px] inset-x-0 bg-slate-950/95 backdrop-blur-md border-b border-indigo-500/20 p-4 space-y-3 z-30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-fade-in">
          <div className="flex items-start space-x-2 text-indigo-300">
            <Key size={14} className="mt-0.5 shrink-0 text-indigo-400" />
            <div className="text-[10px] leading-relaxed font-mono">
              <span className="font-bold text-slate-200 uppercase tracking-wider">Gemini API Configuration</span>
              <p className="text-slate-400 mt-0.5">Paste your Google Gemini API key to activate cloud AI. Stored locally in your browser.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder={activeKey ? "••••••••••••••••••••••••••••" : "Paste Gemini API Key (AIzaSy...)"}
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl py-1.5 px-3 text-[11px] text-slate-200 outline-none focus:border-indigo-500 transition font-mono"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
            />
            {activeKey && !envKey ? (
              <button
                onClick={handleClearKey}
                className="p-1.5 bg-rose-600/10 hover:bg-rose-600/25 border border-rose-500/20 text-rose-400 rounded-xl transition shrink-0"
                title="Remove API Key"
              >
                <Trash2 size={13} />
              </button>
            ) : (
              <button
                onClick={handleSaveKey}
                className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-[11px] font-semibold transition active:scale-95 shrink-0"
              >
                Save
              </button>
            )}
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-slate-900 border border-white/5 text-slate-400 hover:text-indigo-400 hover:border-indigo-500 rounded-xl transition shrink-0"
              title="Get a free Gemini API Key"
            >
              <ExternalLink size={13} />
            </a>
          </div>
          {envKey && (
            <div className="text-[9px] text-emerald-400/80 font-mono">
              ✓ Active API key loaded from environment configurations (.env).
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin flex flex-col justify-start">
        
        {/* Welcome Dashboard */}
        {messages.length === 0 && (
          <div className="my-auto flex flex-col items-center text-center max-w-sm mx-auto space-y-6 py-6">
            <div className="p-4.5 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-3xl text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)] relative animate-float">
              <Bot size={36} className="text-indigo-300" />
              <Sparkles className="absolute -top-1 -right-1 text-purple-300 animate-pulse" size={16} />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest font-mono bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">CortexAI Companion</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans px-4">
                Offline simulation active by default. Enter your API Key or select a prompt card below to experience the chatbot.
              </p>
            </div>

            {/* Prompt Suggestion Cards */}
            <div className="grid grid-cols-2 gap-2.5 w-full pt-2 select-none font-mono">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="text-[9px] text-left p-3 bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-950/20 hover:text-indigo-300 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] hover:shadow-[0_0_15px_rgba(99,102,241,0.12)] flex items-start space-x-2 text-slate-400"
                >
                  <Sparkles size={9} className="mt-0.5 shrink-0 text-indigo-400/80 animate-pulse" />
                  <span className="leading-snug">{chip}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Feed bubbles */}
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="p-1.5 bg-indigo-600/10 border border-indigo-500/20 rounded-lg text-indigo-400 shrink-0">
                <Bot size={13} />
              </div>
            )}
            
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-[11px] leading-relaxed border transition-all ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 border-indigo-500/20 text-white rounded-tr-none font-medium shadow-[0_4px_15px_rgba(139,92,246,0.15)]'
                : 'bg-slate-900/40 backdrop-blur-sm border border-white/5 border-l-2 border-l-indigo-500/50 text-slate-200 rounded-tl-none font-mono shadow-md'
            }`}>
              {renderMessageText(msg.text)}
            </div>

            {msg.sender === 'user' && (
              <div className="p-1.5 bg-slate-900/60 border border-white/5 rounded-lg text-slate-400 shrink-0">
                <User size={13} />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start space-x-2.5">
            <div className="p-1.5 bg-indigo-600/10 border border-indigo-500/20 rounded-lg text-indigo-400 shrink-0">
              <Bot size={13} className="animate-pulse" />
            </div>
            <div className="px-3.5 py-2.5 bg-slate-900/40 backdrop-blur-sm border border-white/5 border-l-2 border-l-indigo-500/50 text-slate-400 rounded-2xl rounded-tl-none text-[11px] font-mono flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Floating Input Area Bar */}
      <div className="p-4.5 bg-slate-950/60 border-t border-white/5 shrink-0 select-none flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder={activeKey ? "Type your message..." : "Ask something offline, or connect a key..."}
          className="flex-1 bg-slate-900/50 border border-white/10 hover:border-white/20 rounded-xl py-2.5 px-4 text-[11px] text-slate-200 outline-none placeholder:text-slate-600 focus:border-indigo-500/50 focus:shadow-[0_0_12px_rgba(99,102,241,0.15)] transition font-mono"
        />
        <button
          onClick={() => handleSend(input)}
          disabled={!input.trim()}
          className="p-3 bg-gradient-to-tr from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white rounded-xl shadow-[0_4px_10px_rgba(236,72,153,0.15)] active:scale-95 hover:scale-105 transition-all duration-200 flex items-center justify-center shrink-0"
        >
          <Send size={12} />
        </button>
      </div>

    </div>
  );
};



