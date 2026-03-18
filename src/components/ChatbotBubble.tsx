import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';

type Message = { role: 'user' | 'assistant'; content: string };

const ChatbotBubble = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Bonjour ! Je suis le conseiller Studio Nova. Vous avez une question sur nos offres, nos délais ou nos méthodes de travail ? Je suis là pour vous aider."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    const allMsgs = [...messages, userMsg];
    setMessages(allMsgs);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages: allMsgs.map(m => ({ role: m.role, content: m.content })) }
      });

      if (error) throw error;
      const reply = data?.choices?.[0]?.message?.content || data?.content || "Merci pour votre message. N'hésitez pas à réserver un audit gratuit pour en savoir plus !";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, une erreur est survenue. N'hésitez pas à nous contacter directement par email à contact@studionova.fr" }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Bubble */}
      <motion.button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center glow-primary hover:scale-105 active:scale-95 transition-transform ${open ? 'hidden' : ''}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle size={24} />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-visibility rounded-full animate-pulse-dot" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[500px] glass rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-foreground/5 flex items-center justify-between">
              <div>
                <h4 className="font-display text-sm font-bold">Conseiller Studio Nova</h4>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-visibility" />
                  En ligne · Réponse en moins de 2 minutes
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-secondary text-foreground rounded-bl-md'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-foreground/5">
              <form
                onSubmit={e => { e.preventDefault(); send(); }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Votre message..."
                  className="flex-1 bg-input border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:scale-105 active:scale-95 transition-transform"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotBubble;
