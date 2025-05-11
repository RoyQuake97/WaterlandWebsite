import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

// Sample responses to common user questions
const AUTOMATED_RESPONSES: Record<string, string> = {
  hi: "Hello! How can I help you with your visit to Waterland Resort & Waterpark?",
  hello: "Hello! How can I help you with your visit to Waterland Resort & Waterpark?",
  hey: "Hello! How can I help you with your visit to Waterland Resort & Waterpark?",
  "opening hours": "Our regular opening hours are: Monday to Sunday from 9:00 AM to 7:00 PM during the season (May 23 to September 30).",
  tickets: "General admission tickets are $25 for adults and $15 for children. You can purchase them online or at the entrance.",
  "ticket price": "General admission tickets are $25 for adults and $15 for children. You can purchase them online or at the entrance.",
  pricing: "General admission tickets are $25 for adults and $15 for children. You can purchase them online or at the entrance.",
  location: "We're located in Zghartā, North Lebanon. You can find directions on our Contact page.",
  "how to get there": "We're located in Zghartā, North Lebanon. You can find directions on our Contact page.",
  directions: "We're located in Zghartā, North Lebanon. You can find directions on our Contact page.",
  hotel: "Our resort offers three types of rooms: Junior, Twin, and Ambassador suites. You can book them online through our website.",
  accommodation: "Our resort offers three types of rooms: Junior, Twin, and Ambassador suites. You can book them online through our website.",
  rooms: "Our resort offers three types of rooms: Junior, Twin, and Ambassador suites. You can book them online through our website.",
  "contact number": "You can reach us at +961 12 345 678 or through our Contact page.",
  phone: "You can reach us at +961 12 345 678 or through our Contact page.",
  "phone number": "You can reach us at +961 12 345 678 or through our Contact page.",
  facilities: "Our facilities include multiple water slides, swimming pools, a wave pool, lazy river, restaurants, cafes, and hotel accommodation.",
  attractions: "Our attractions include thrilling water slides, a wave pool, lazy river, kids' splash zone, and more! Check our Waterpark page for details.",
  food: "We have several dining options including a main restaurant, poolside café, and snack bars throughout the park.",
  restaurant: "We have several dining options including a main restaurant, poolside café, and snack bars throughout the park.",
  menu: "Our menu includes Lebanese cuisine, international dishes, snacks, ice cream, and beverages. Check our Menu page for details.",
  events: "We can host birthday parties, corporate events, and private functions. Please check our Events page for more information.",
  "birthday party": "Yes, we offer birthday party packages! Please contact us through our Events page for details and reservations.",
  "is there wifi": "Yes, free WiFi is available throughout the resort and waterpark for all our guests.",
  wifi: "Yes, free WiFi is available throughout the resort and waterpark for all our guests.",
  parking: "Yes, we offer free parking for all our guests.",
  "is there parking": "Yes, we offer free parking for all our guests.",
  "thank you": "You're welcome! Feel free to ask if you have any other questions. We hope to see you soon at Waterland!",
  thanks: "You're welcome! Feel free to ask if you have any other questions. We hope to see you soon at Waterland!",
};

// Default responses when no keyword match is found
const DEFAULT_RESPONSES = [
  "Thank you for your message. Our team will get back to you shortly. For immediate assistance, please call us at +961 12 345 678.",
  "Thanks for contacting us. For quicker responses, you can also reach out to us on WhatsApp or through our Contact page.",
  "We've received your message and will respond as soon as possible. If you have an urgent query, please call our front desk at +961 12 345 678.",
];

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you with your visit to Waterland Resort & Waterpark?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Auto-open chat after a delay (but don't show on first visit)
    const hasVisited = localStorage.getItem('hasVisitedWaterland');
    
    if (!hasVisited) {
      localStorage.setItem('hasVisitedWaterland', 'true');
    } else {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 10000); // 10 seconds
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  
  const getAutomatedResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Check for keyword matches
    for (const [keyword, response] of Object.entries(AUTOMATED_RESPONSES)) {
      if (lowerCaseMessage.includes(keyword)) {
        return response;
      }
    }
    
    // If no match, return a random default response
    const randomIndex = Math.floor(Math.random() * DEFAULT_RESPONSES.length);
    return DEFAULT_RESPONSES[randomIndex];
  };
  
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    
    // Simulate typing indicator
    setIsTyping(true);
    
    // Delayed response
    setTimeout(() => {
      // Add automated response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutomatedResponse(userMessage.text),
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500); // Delay to simulate typing
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <>
      {/* Chat button */}
      <motion.button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full shadow-lg ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-waterland-blue hover:bg-waterland-blue/90'
        } text-white transition-colors duration-300`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 rounded-lg shadow-xl overflow-hidden bg-white"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '70vh',
              maxHeight: isMinimized ? '60px' : '70vh'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Chat header */}
            <div className="bg-waterland-blue p-3 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare size={20} />
                <h3 className="font-medium">Waterland Resort Chat</h3>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={toggleMinimize}
                  className="p-1 hover:bg-waterland-blue/80 rounded"
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  <ChevronDown 
                    size={18}
                    className={`transform transition-transform ${isMinimized ? 'rotate-180' : ''}`} 
                  />
                </button>
                <button 
                  onClick={toggleChat}
                  className="p-1 hover:bg-waterland-blue/80 rounded"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {/* Chat content */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Messages area */}
                  <div className="p-3 h-[calc(70vh-120px)] overflow-y-auto bg-gray-50">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-3 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.isUser
                              ? 'bg-waterland-blue text-white'
                              : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {!msg.isUser && (
                              <div className="w-6 h-6 rounded-full bg-waterland-lightblue flex items-center justify-center flex-shrink-0 mt-1">
                                <MessageSquare size={12} className="text-white" />
                              </div>
                            )}
                            <div>
                              <p className={`text-sm ${msg.isUser ? 'text-white' : 'text-gray-800'}`}>
                                {msg.text}
                              </p>
                              <p
                                className={`text-xs mt-1 ${
                                  msg.isUser ? 'text-blue-100' : 'text-gray-500'
                                }`}
                              >
                                {msg.timestamp.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            {msg.isUser && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                                <User size={12} className="text-gray-600" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="flex justify-start mb-3">
                        <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-[80%]">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Input area */}
                  <div className="p-3 border-t">
                    <div className="flex space-x-2">
                      <Textarea
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="resize-none"
                        rows={1}
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        size="icon"
                        className="bg-waterland-blue hover:bg-waterland-blue/90"
                        disabled={message.trim() === ''}
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Press Enter to send, Shift+Enter for a new line
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChatWidget;