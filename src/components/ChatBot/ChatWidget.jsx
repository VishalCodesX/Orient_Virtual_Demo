// src/components/ChatBot/ChatWidget.jsx

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Phone, Mail, ArrowRight } from 'lucide-react';
import { processMessage } from './ChatBotLogic';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "👋 Hi! I'm your Orient Solutions assistant. I can help you with product specs, AR features, or connect you with our sales team!",
      timestamp: new Date(),
      quickReplies: [
        "Tell me about RAPTOR panels",
        "How to use AR features?",
        "Get pricing info",
        "Compare products"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const messagesEndRef = useRef(null);
  const recognition = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Detect current page for context awareness
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('raptor')) setCurrentPage('raptor');
    else if (path.includes('kyocera')) setCurrentPage('kyocera');
    else if (path.includes('product')) setCurrentPage('product');
    else setCurrentPage('home');
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending messages
  const sendMessage = async (text = inputText, isQuickReply = false) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Process message with our chat logic
      const response = await processMessage(text.trim(), currentPage);
      
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.text,
        timestamp: new Date(),
        quickReplies: response.quickReplies,
        actions: response.actions,
        productInfo: response.productInfo
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: "I'm having trouble right now. You can always reach our team directly at +91 98409 09409 or sales@orientsolutions.com",
        timestamp: new Date(),
        actions: [
          { type: 'contact', label: 'Contact Sales', icon: Phone }
        ]
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle voice input
  const toggleListening = () => {
    if (!recognition.current) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  };

  // Handle action buttons
  const handleAction = (action) => {
    switch (action.type) {
      case 'contact':
        window.open('tel:+919840909409', '_blank');
        break;
      case 'email':
        window.open('mailto:sales@orientsolutions.com', '_blank');
        break;
      case 'ar':
        // Trigger AR modal (you'll need to connect this to your AR system)
        console.log('Trigger AR for:', action.product);
        break;
      case 'compare':
        // Navigate to comparison view
        window.location.href = '/raptor';
        break;
      case 'demo':
        // Open demo scheduling
        window.open('https://calendly.com/orientsolutions', '_blank');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Message component
  const Message = ({ message }) => (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        message.type === 'user' 
          ? 'bg-green-500 text-white' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        <p className="text-sm">{message.text}</p>
        
        {/* Product Info Card */}
        {message.productInfo && (
          <div className="mt-3 p-3 bg-white rounded-lg border">
            <h4 className="font-bold text-sm text-gray-800">{message.productInfo.name}</h4>
            <div className="text-xs text-gray-600 mt-1">
              {message.productInfo.specs.map((spec, i) => (
                <div key={i}>• {spec}</div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Reply Buttons */}
        {message.quickReplies && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => sendMessage(reply, true)}
                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-full transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {message.actions && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleAction(action)}
                className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
              >
                {action.icon && <action.icon size={12} />}
                {action.label}
              </button>
            ))}
          </div>
        )}

        <div className="text-xs opacity-70 mt-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm">Orient Solutions</h3>
              <p className="text-xs text-green-100">Virtual Assistant</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-green-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map(message => (
              <Message key={message.id} message={message} />
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={toggleListening}
                className={`p-2 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Voice input"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button
                onClick={() => sendMessage()}
                disabled={!inputText.trim()}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center ${
          isOpen 
            ? 'bg-gray-500 hover:bg-gray-600' 
            : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 animate-pulse'
        }`}
      >
        {isOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <MessageCircle className="text-white" size={24} />
        )}
      </button>

      {/* Notification Badge */}
      {!isOpen && (
        <div className="fixed bottom-16 right-6 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center z-50 animate-bounce">
          1
        </div>
      )}
    </>
  );
};

export default ChatWidget;