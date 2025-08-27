'use client';

import React, { useState, useRef, useEffect } from 'react';

// Define the ChatMessage interface for type safety.
interface ChatMessage {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const JambolushChatbot: React.FC = () => {
  // State variables to manage the chat application.
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Hi! I'm Amoria Assistant. Here to help you find tours, experiences, and book your stay.",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Consistent color palette
  const primaryBlue = '#083A85';
  const primaryPink = '#F20C8F';
  
  // Quick questions relevant to the original Jambolush content
  const quickQuestions = [
    'How do I book a house?',
    'What payment methods are accepted?',
    'How do I list my property?',
    'Is Jambolush free to use?',
  ];

  // Original Hard-coded Question & Answer data for Jambolush
  const qaData: { [key: string]: { answer: string; keywords: string[] } } = {
    // General Platform Information
    "what is jambolush": {
      answer: "Jambolush is an online platform where users can list, browse, and book houses or spots.",
      keywords: ["jambolush", "platform", "what", "is", "about", "service"]
    },
    "is jambolush free to use": {
      answer: "Yes, creating an account is free. Booking fees may apply depending on the listing.",
      keywords: ["free", "cost", "price", "money", "charge", "fee"]
    },
    // Booking Process
    "how do i book a house": {
      answer: "Select a listing, choose your dates, and click 'Reserve Now' to proceed with the booking.",
      keywords: ["book", "reserve", "how", "booking", "house", "property"]
    },
    "what payment methods are accepted": {
      answer: "Jambolush accepts credit/debit cards, PayPal, and mobile payments.",
      keywords: ["payment", "methods", "credit", "card", "paypal", "pay"]
    },
    // Listing Your Property
    "how do i list my property": {
        answer: "Click 'List Your Property,' fill in the required details, upload photos of your space, and submit it for review.",
        keywords: ["list", "property", "host", "rent", "add", "listing"]
    },
    // ... other original Q&A data can be kept here
  };

  // Function to find the best matching answer
  const findBestMatch = (userInput: string): string => {
    const normalizedInput = userInput.toLowerCase().trim().replace(/[?.!]/g, '');
    let bestMatch = '';
    let highestScore = 0;
    const threshold = 0.2;
    
    if (qaData[normalizedInput]) {
      return qaData[normalizedInput].answer;
    }
    
    for (const [question, data] of Object.entries(qaData)) {
      let score = 0;
      // Using a placeholder for similarity calculation for brevity. Use your original function.
      const questionSimilarity = (s1: string, s2: string) => {
        // Levenshtein distance logic would be here
        const longer = s1.length > s2.length ? s1 : s2;
        if (longer.length === 0) return 1.0;
        const distance = Math.abs(s1.length - s2.length); // Simplified for example
        return (longer.length - distance) / longer.length;
      };
      score += questionSimilarity(normalizedInput, question);

      const keywordMatches = data.keywords.filter(keyword => normalizedInput.includes(keyword)).length;
      score += (keywordMatches / data.keywords.length) * 0.5;

      if (score > highestScore) {
        highestScore = score;
        bestMatch = data.answer;
      }
    }

    if (highestScore > threshold) {
      return bestMatch;
    }

    return "I couldn't find a specific answer. For more help, please contact us at support@amoria.com.";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: ChatMessage = {
      id: Date.now() + Math.random(),
      text: text,
      sender: sender,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };
  
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    addMessage(text, 'user');
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponseText = findBestMatch(text);
      addMessage(botResponseText, 'bot');
      setIsTyping(false);
    }, 1000);
  };
  
  const handleQuickQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer flex items-center justify-center"
          style={{ backgroundColor: primaryPink }}
        >
          <i className="bi bi-chat-dots-fill text-3xl text-white"></i>
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-4 left-4 right-4 flex flex-col backdrop-blur-xl rounded-2xl shadow-2xl transition-all duration-300 
                 sm:left-auto sm:w-full sm:max-w-sm h-[85vh] max-h-[650px] z-50"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url('https://images.stockcake.com/public/9/4/d/94dce4db-7571-41c0-b98f-5e67852fd988_large/elephant-river-crossing-stockcake.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 text-white flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500/20">
              <i className="bi bi-robot text-white text-2xl"></i>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-white">Amoria Assistant</h3>
            <p className="text-sm text-green-400">Online</p>
          </div>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <i className="bi bi-x-lg text-xl"></i>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 1 ? (
          <div>
            <div className="flex justify-start">
               <div className="max-w-xs lg:max-w-md p-3 rounded-xl shadow-md bg-gray-800/80 text-white rounded-bl-none">
                 <p className="text-sm whitespace-pre-line break-words">{messages[0].text}</p>
              </div>
            </div>
            <p className="text-sm text-white/50 mt-6 mb-3">Quick questions:</p>
            <div className="space-y-2">
              {quickQuestions.map((q, i) => (
                <button 
                  key={i}
                  onClick={() => handleQuickQuestionClick(q)}
                  className="w-full text-left p-3 border border-blue-500/50 text-blue-300 rounded-lg text-sm hover:bg-blue-500/20 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md p-3 rounded-xl shadow-md ${
                message.sender === 'user'
                  ? 'text-white rounded-br-none'
                  : 'bg-gray-800/80 text-white rounded-bl-none'
              }`}
              style={message.sender === 'user' ? { backgroundColor: primaryBlue } : {}}>
                <p className="text-sm whitespace-pre-line break-words">{message.text}</p>
                <span className={`text-xs mt-1 block text-right ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-gray-800/80 p-3 rounded-xl shadow-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 bg-transparent border-t border-white/10">
        <div className="flex space-x-3 items-center">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 py-2 px-4 rounded-full bg-slate-800/90 border border-white/10 text-white resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '100px' }}
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim()}
            className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full text-white font-semibold transition-all duration-200 hover:shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer"
            style={{ backgroundColor: !inputText.trim() ? 'rgb(107 114 128)' : primaryPink }}
          >
            <i className="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JambolushChatbot;