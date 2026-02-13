import React from 'react';
import { useEvent } from '../context/eventHooks';
import ChatWindow from '../components/ChatWindow';
import { 
  Bot, 
  MessageCircle, 
  Sparkles, 
  Zap,
  Brain,
  Lightbulb
} from 'lucide-react';

const FestBuddy = () => {
  const { state, actions } = useEvent();

  const quickQuestions = [
    "How many tickets have been sold?",
    "Are we over budget?",
    "Is there any ticket fraud?",
    "Which vendor is risky?",
    "What is the predicted attendance?",
    "Show sustainability metrics",
    "What's the event status?",
    "Any vendor issues?"
  ];

  const capabilities = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Natural Language",
      description: "Ask questions in plain English about your event"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Real-time Insights",
      description: "Get instant answers based on current event data"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Actions",
      description: "Receive recommendations and alerts instantly"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Smart Suggestions",
      description: "Get AI-powered recommendations for event optimization"
    }
  ];

  const exampleQueries = [
    {
      category: "Ticket Management",
      queries: [
        "How many tickets have been sold?",
        "What's our check-in rate?",
        "Are there any fraud attempts?",
        "Show me duplicate tickets"
      ]
    },
    {
      category: "Budget & Finance",
      queries: [
        "Are we over budget?",
        "How much have we spent?",
        "Which category is over budget?",
        "What's our remaining budget?"
      ]
    },
    {
      category: "Vendor Management",
      queries: [
        "Which vendors are at risk?",
        "Show vendor reliability scores",
        "Are there any delivery delays?",
        "Who are our most reliable vendors?"
      ]
    },
    {
      category: "Event Operations",
      queries: [
        "What's our current capacity?",
        "Predict final attendance",
        "Show sustainability metrics",
        "What's the event status?"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bot className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">FestBuddy AI Assistant</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your intelligent event management companion. Ask me anything about your event using natural language.
        </p>
      </div>

      {/* Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {capabilities.map((capability, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary-600">
              {capability.icon}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{capability.title}</h3>
            <p className="text-sm text-gray-600">{capability.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg border border-primary-200 p-8">
        <div className="text-center mb-6">
          <Sparkles className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Start a Conversation</h2>
          <p className="text-gray-600">
            Click the chat button or try one of these example questions
          </p>
        </div>

        {/* Quick Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => {
                actions.toggleChat();
                setTimeout(() => {
                  // This will be handled by the chat component
                }, 100);
              }}
              className="p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all text-left text-sm"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Example Queries by Category */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Example Questions by Category</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {exampleQueries.map((category, index) => (
            <div key={index} className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                {category.category}
              </h4>
              <div className="space-y-2">
                {category.queries.map((query, queryIndex) => (
                  <button
                    key={queryIndex}
                    onClick={() => {
                      actions.toggleChat();
                      setTimeout(() => {
                        // This will be handled by the chat component
                      }, 100);
                    }}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
                  >
                    "{query}"
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
          <div className="text-sm text-gray-600">Availability</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{state.chatMessages.length}</div>
          <div className="text-sm text-gray-600">Conversations Today</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">Instant</div>
          <div className="text-sm text-gray-600">Response Time</div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Pro Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific with your questions for more accurate answers</li>
              <li>• Ask follow-up questions to dive deeper into insights</li>
              <li>• Use natural language - no need for technical terms</li>
              <li>• FestBuddy learns from your event data to provide better recommendations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <ChatWindow 
        isOpen={state.chatOpen} 
        onClose={() => actions.toggleChat()} 
      />
    </div>
  );
};

export default FestBuddy;
