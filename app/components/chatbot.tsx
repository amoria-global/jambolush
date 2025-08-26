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
      text: "Hi! I'm Amoria Assistant  Here to help you find tours, experiences, and book your stay",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hard-coded Question & Answer data with keywords for better matching
  const qaData: { [key: string]: { answer: string; keywords: string[] } } = {
    // General Platform Information
    "what is jambolush": {
      answer: "Jambolush is an online platform where users can list, browse, and book houses or spots.",
      keywords: ["jambolush", "platform", "what", "is", "about", "service"]
    },
    "who can use jambolush": {
      answer: "Anyone looking to book a place or list their property can use Jambolush.",
      keywords: ["who", "can", "use", "anyone", "eligible", "allowed"]
    },
    "is jambolush free to use": {
      answer: "Yes, creating an account is free. Booking fees may apply depending on the listing.",
      keywords: ["free", "cost", "price", "money", "charge", "fee"]
    },
    "can i access jambolush on mobile": {
      answer: "Yes, Jambolush is mobile-friendly and works on smartphones and tablets.",
      keywords: ["mobile", "phone", "tablet", "smartphone", "app", "device"]
    },
    "do i need to create an account to browse listings": {
      answer: "No, browsing is available without an account, but booking requires one.",
      keywords: ["account", "register", "signup", "browse", "without", "need"]
    },
    "how do i create an account": {
      answer: "Click 'Sign Up,' fill in your details, and verify your email.",
      keywords: ["create", "account", "register", "signup", "join", "how"]
    },
    "can i log in with social accounts": {
      answer: "Yes, Jambolush supports login via Google or Facebook.",
      keywords: ["social", "login", "google", "facebook", "connect", "signin"]
    },
    "is my personal information safe on jambolush": {
      answer: "Yes, we use secure encryption to protect your data.",
      keywords: ["safe", "secure", "privacy", "protection", "data", "information"]
    },
    "can i use jambolush internationally": {
      answer: "Yes, Jambolush supports bookings and listings worldwide.",
      keywords: ["international", "worldwide", "global", "abroad", "countries"]
    },
    "how often are new listings added": {
      answer: "New listings are added daily by property owners and hosts.",
      keywords: ["new", "listings", "added", "daily", "fresh", "updated"]
    },

    // Booking Process
    "how do i book a house": {
      answer: "Select a listing, choose dates, and click 'Reserve Now' to book.",
      keywords: ["book", "reserve", "how", "booking", "house", "property"]
    },
    "can i book multiple houses at once": {
      answer: "Yes, you can add multiple bookings to your cart and complete them together.",
      keywords: ["multiple", "houses", "several", "many", "at once", "together"]
    },
    "what payment methods are accepted": {
      answer: "Jambolush accepts credit/debit cards, PayPal, and mobile payments.",
      keywords: ["payment", "methods", "credit", "card", "paypal", "pay"]
    },
    "can i pay in installments": {
      answer: "Some listings may offer installment options; check the property details.",
      keywords: ["installments", "payment", "plan", "split", "partial", "monthly"]
    },
    "how do i know my booking is confirmed": {
      answer: "You will receive a confirmation email and booking receipt instantly.",
      keywords: ["confirmation", "confirmed", "email", "receipt", "booking"]
    },
    "can i cancel my booking": {
      answer: "Yes, go to 'My Bookings' and select the booking to cancel. Refund policies apply.",
      keywords: ["cancel", "cancellation", "refund", "booking", "remove"]
    },
    "what if i arrive late or early": {
      answer: "Check the listing's check-in policy; you can contact the host for special arrangements.",
      keywords: ["late", "early", "arrive", "check-in", "time", "arrival"]
    },
    "can i extend my stay": {
      answer: "Contact the host directly or update your booking if the dates are available.",
      keywords: ["extend", "longer", "stay", "more", "days", "additional"]
    },

    // Listing Your Property
    "how do i list my property on jambolush": {
      answer: "Click 'List Your Property,' fill in details, upload photos, and submit.",
      keywords: ["list", "property", "host", "rent", "add", "listing"]
    },
    "is there a fee to list my property": {
      answer: "Creating a listing is free; service fees apply when booked.",
      keywords: ["fee", "cost", "list", "property", "charge", "hosting"]
    },
    "how do i make my listing more visible": {
      answer: "Add high-quality photos, detailed descriptions, and respond promptly to inquiries.",
      keywords: ["visible", "visibility", "promote", "boost", "improve", "better"]
    },
    "can i edit my listing after posting": {
      answer: "Yes, go to 'My Listings' and click 'Edit.'",
      keywords: ["edit", "modify", "change", "update", "listing", "after"]
    },
    "can i delete a listing": {
      answer: "Yes, you can remove a listing from 'My Listings.'",
      keywords: ["delete", "remove", "listing", "take down", "disable"]
    },

    // Payments & Transactions
    "how do i pay for a booking": {
      answer: "Select your payment method on the checkout page and complete the transaction.",
      keywords: ["pay", "payment", "booking", "checkout", "transaction"]
    },
    "can i save my card for future bookings": {
      answer: "Yes, you can securely save your card for faster payments.",
      keywords: ["save", "card", "future", "store", "payment", "method"]
    },
    "does jambolush charge service fees": {
      answer: "Yes, service fees are displayed before booking confirmation.",
      keywords: ["service", "fees", "charge", "cost", "additional"]
    },
    "when will i be charged": {
      answer: "Your card is charged once the booking is confirmed.",
      keywords: ["charged", "when", "payment", "billing", "card"]
    },
    "can i get a receipt for my payment": {
      answer: "Yes, a digital receipt is sent to your email automatically.",
      keywords: ["receipt", "invoice", "payment", "proof", "email"]
    },

    // Troubleshooting & Technical Issues
    "i forgot my password what do i do": {
      answer: "Click 'Forgot Password,' enter your email, and follow the reset instructions.",
      keywords: ["forgot", "password", "reset", "login", "access", "recover"]
    },
    "i didnt receive a confirmation email": {
      answer: "Check your spam folder or request a resend from support.",
      keywords: ["confirmation", "email", "didn't", "receive", "spam", "missing"]
    },
    "my booking isnt showing in my bookings": {
      answer: "Refresh the page or log out and log back in. Contact support if missing.",
      keywords: ["booking", "showing", "missing", "not", "visible", "my bookings"]
    },
    "the website isnt loading properly": {
      answer: "Clear your cache, update your browser, or try a different device.",
      keywords: ["website", "loading", "problem", "not", "working", "slow"]
    },
    "i cant upload photos for my listing": {
      answer: "Ensure the images meet size and format requirements (JPEG/PNG, <10MB).",
      keywords: ["upload", "photos", "images", "can't", "problem", "listing"]
    },

    // Customer Support & Policies
    "how do i contact jambolush support": {
      answer: "Use the chat, email, or 'Contact Us' form available on the website.",
      keywords: ["contact", "support", "help", "customer", "service", "assistance"]
    },
    "what are jambolushs operating hours": {
      answer: "Support is available 24/7 via chat and email.",
      keywords: ["hours", "operating", "support", "available", "time", "24/7"]
    },
    "how do i report a host or guest": {
      answer: "Use the 'Report' button on their profile or booking page.",
      keywords: ["report", "host", "guest", "problem", "issue", "complain"]
    },
    "what is jambolushs cancellation policy": {
      answer: "Policies vary per listing; check each property's terms before booking.",
      keywords: ["cancellation", "policy", "refund", "terms", "cancel"]
    }
  };

  // Function to calculate string similarity (Levenshtein distance based)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    const editDistance = getEditDistance(longer, shorter);
    if (longer.length === 0) return 1.0;
    return (longer.length - editDistance) / longer.length;
  };

  const getEditDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i += 1) {
      matrix[0][i] = i;
    }
    
    for (let j = 0; j <= str2.length; j += 1) {
      matrix[j][0] = j;
    }
    
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator, // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  // Function to find the best matching answer
  const findBestMatch = (userInput: string): string => {
    const normalizedInput = userInput.toLowerCase().trim().replace(/[?.!]/g, '');
    const inputWords = normalizedInput.split(' ').filter(word => word.length > 1);
    
    let bestMatch = '';
    let highestScore = 0;
    const threshold = 0.2; // Lowered threshold for better matching

    console.log('User input:', normalizedInput);
    console.log('Input words:', inputWords);

    // First, try exact match
    if (qaData[normalizedInput]) {
      console.log('Exact match found!');
      return qaData[normalizedInput].answer;
    }

    // Then try fuzzy matching
    for (const [question, data] of Object.entries(qaData)) {
      let score = 0;
      
      // Calculate similarity with the question itself
      const questionSimilarity = calculateSimilarity(normalizedInput, question);
      score += questionSimilarity * 0.4;
      
      // Calculate keyword matching score with more flexible matching
      const keywordMatches = data.keywords.filter(keyword => 
        inputWords.some(word => {
          const contains = word.includes(keyword) || keyword.includes(word);
          const similar = calculateSimilarity(word, keyword) > 0.6;
          return contains || similar;
        })
      ).length;
      
      const keywordScore = keywordMatches > 0 ? keywordMatches / data.keywords.length : 0;
      score += keywordScore * 0.4;
      
      // Check if any input words are contained in the question
      const containsWords = inputWords.filter(word => 
        word.length > 2 && (question.includes(word) || word.includes('book') && question.includes('book'))
      ).length;
      
      if (containsWords > 0) {
        score += (containsWords / inputWords.length) * 0.4;
      }
      
      // Boost score for common question patterns
      if (normalizedInput.includes('how') && question.includes('how')) {
        score += 0.2;
      }
      if (normalizedInput.includes('can i') && question.includes('can i')) {
        score += 0.2;
      }
      if (normalizedInput.includes('book') && question.includes('book')) {
        score += 0.3;
      }
      
      console.log(`Question: "${question}" - Score: ${score.toFixed(3)}`);
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = data.answer;
      }
    }

    console.log('Highest score:', highestScore);
    console.log('Threshold:', threshold);

    if (highestScore > threshold) {
      return bestMatch;
    }

    return "I couldn't find a specific answer to your question. Please contact us at support@amoria.com for personalized assistance, or try rephrasing your question.";
  };

  // Scrolls the chat window to the bottom when new messages are added.
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect hook to call scrollToBottom whenever the messages state changes.
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Use the enhanced matching function
    const botResponseText = findBestMatch(inputText);

    const botMessage: ChatMessage = {
      id: Date.now() + 1,
      text: botResponseText,
      sender: 'bot',
      timestamp: new Date(),
    };

    // Simulate typing delay for a more natural feel
    setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
    }, 1000); 
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="relative p-4 rounded-full shadow-xl hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer flex items-center justify-center"
          style={{ backgroundColor: '#083693ff' }} // blue circle
        >
          {/* Chat Icon */}
          <i className="bi bi-chat-dots-fill" style={{ fontSize: '1.8rem', color: '#fff' }}></i>

          {/* Online Status Dot */}
          <span
            className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-white"
            style={{ backgroundColor: '#2ecc71' }} // green dot
          ></span>
        </button>

      </div>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-full max-w-sm h-[80vh] max-h-[600px] bg-gray-950 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100"
      style={{
        backgroundImage: `linear-gradient(rgba(37, 37, 37, 0.7), rgba(44, 44, 44, 0.7)), url('https://images.stockcake.com/public/9/4/d/94dce4db-7571-41c0-b98f-5e67852fd988_large/elephant-river-crossing-stockcake.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header */}
      <div className="bg-opacity-70 backdrop-blur-md p-4 text-white flex items-center justify-between rounded-t-3xl shadow-lg border-b border-gray-700" 
           style={{ backgroundColor: '#083A85' }}>
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl"
                 style={{ backgroundColor: '#e91e63' }}>
              {/* Logo Bootstrap Icon */}
              <i className="bi bi-robot text-white text-2xl animate-bounce"></i>
            </div>
            <div className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-white">Amoria Assistant</h3>
            <p className="text-sm text-green-400">Active</p>
          </div>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-white hover:text-gray-300 transition-colors cursor-pointer"
        >
          <i className="bi bi-x-lg text-xl"></i>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl shadow-xl ${
              message.sender === 'user'
                ? 'text-white rounded-br-none'
                : 'bg-gray-800 text-white rounded-bl-none'
            }`}
            style={message.sender === 'user' ? { backgroundColor: '#083A85' } : {}}>
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-xs ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="text-sm whitespace-pre-line">{message.text}</p>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 p-3 rounded-2xl shadow-xl">
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
      <div className="p-4 bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-b-3xl mt-4 shadow-2xl">
        <div className="flex space-x-2 items-center">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about Jambolush..."
            className="flex-1 p-3 rounded-full bg-gray-800 border border-gray-700 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '100px' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="w-12 h-12 flex items-center justify-center rounded-full text-white font-semibold transition-all shadow-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer"
          >
            <i className="bi bi-send-fill text-lg"></i>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Powered by Amoria Global Tech
        </p>
      </div>
    </div>
  );
};

export default JambolushChatbot;