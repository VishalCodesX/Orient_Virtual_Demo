// src/components/ChatBot/ChatBotLogic.js

import { productKnowledgeBase, faqDatabase } from './KnowledgeBase';
import { queryGeminiAPI } from './GeminiIntegration';
import { Phone, Mail, ArrowRight } from 'lucide-react';
import { Eye } from 'lucide-react';

// Main message processing logic
export const processMessage = async (message, currentPage = 'home') => {
  const normalizedMessage = message.toLowerCase().trim();
  
  // 1. Check for product-specific queries (including size recommendations)
  const productResponse = checkProductQueries(normalizedMessage, currentPage);
  if (productResponse) return productResponse;
  
  // 2. Check FAQ database
  const faqResponse = checkFAQDatabase(normalizedMessage);
  if (faqResponse) return faqResponse;
  
  // 3. Check for contact/sales queries
  const contactResponse = checkContactQueries(normalizedMessage);
  if (contactResponse) return contactResponse;
  
  // 4. Check for feature/AR queries
  const featureResponse = checkFeatureQueries(normalizedMessage);
  if (featureResponse) return featureResponse;
  
  // 5. Check for general business/product queries (NEW - expanded local knowledge)
  const generalResponse = checkGeneralQueries(normalizedMessage);
  if (generalResponse) return generalResponse;
  
  // 6. Try Gemini API for complex queries only (with better error handling)
  try {
    // Only use Gemini for very general questions that our local system can't handle
    if (shouldUseGeminiAPI(normalizedMessage)) {
      const geminiResponse = await queryGeminiAPI(message);
      return {
        text: geminiResponse,
        quickReplies: ["Tell me about RAPTOR panels", "KYOCERA printers", "Contact sales"]
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    // Don't show error to user, fall through to default response
  }
  
  // 7. Default helpful response (instead of error message)
  return {
    text: "I'd be happy to help you with information about our products! I can tell you about RAPTOR interactive panels, KYOCERA printers, AR features, installation, pricing, and more. What would you like to know?",
    quickReplies: [
      "RAPTOR panel sizes", 
      "KYOCERA printer options", 
      "AR demonstration", 
      "Get pricing"
    ],
    actions: [
      { type: 'contact', label: 'Talk to Expert', icon: Phone }
    ]
  };
};

// Determine if question needs Gemini API
const shouldUseGeminiAPI = (message) => {
  // Local knowledge keywords - if message contains these, handle locally
  const localKeywords = [
    'raptor', 'panel', 'kyocera', 'printer', 'price', 'cost', 'size', 'inch',
    'ar', 'augmented', 'reality', 'touch', 'display', 'installation', 'install',
    'classroom', 'students', 'meeting', 'room', 'specs', 'specification',
    'android', 'resolution', 'brightness', 'connect', 'wireless', 'bluetooth',
    'wifi', 'training', 'support', 'warranty', 'demo', 'orient', 'solutions'
  ];
  
  // If message contains any local keywords, don't use Gemini
  if (localKeywords.some(keyword => message.includes(keyword))) {
    return false;
  }
  
  // Use Gemini only for very general questions
  const geminiKeywords = [
    'what is', 'how does', 'explain', 'tell me about', 'what are the benefits of',
    'artificial intelligence', 'machine learning', 'technology trends', 'future of',
    'best practices', 'how to improve', 'what should i', 'advice', 'recommend'
  ];
  
  return geminiKeywords.some(keyword => message.includes(keyword));
};

// Product-specific query handler
const checkProductQueries = (message, currentPage) => {
  const productKeywords = {
    raptor: ['raptor', 'panel', 'interactive', 'touch', 'display', '86', '75', '65'],
    kyocera: ['kyocera', 'printer', 'print', 'taskalfa', 'ecosys'],
    general: ['specs', 'specification', 'resolution', 'size', 'price', 'cost'],
    recommendation: ['best', 'recommend', 'which', 'choose', 'classroom', 'students', 'room', 'meeting']
  };

  // Check for size/recommendation queries FIRST (most important)
  if (productKeywords.recommendation.some(keyword => message.includes(keyword))) {
    const recommendationResponse = checkClassroomSizeRecommendation(message);
    if (recommendationResponse) return recommendationResponse;
  }

  // Check for RAPTOR queries
  if (productKeywords.raptor.some(keyword => message.includes(keyword)) || currentPage === 'raptor') {
    return handleRaptorQueries(message);
  }

  // Check for KYOCERA queries
  if (productKeywords.kyocera.some(keyword => message.includes(keyword)) || currentPage === 'kyocera') {
    return handleKyoceraQueries(message);
  }

  return null;
};

// Smart classroom size recommendation system
const checkClassroomSizeRecommendation = (message) => {
  const classroomKeywords = ['classroom', 'students', 'room', 'space', 'best size', 'recommend', 'which size'];
  const numberPattern = /(\d+)/g;
  
  if (!classroomKeywords.some(keyword => message.includes(keyword))) {
    return null;
  }

  // Extract numbers from the message
  const numbers = message.match(numberPattern);
  const studentCount = numbers ? parseInt(numbers[0]) : null;

  // Room type detection
  const isClassroom = message.includes('classroom') || message.includes('students');
  const isMeeting = message.includes('meeting') || message.includes('conference') || message.includes('boardroom');
  const isAuditorium = message.includes('auditorium') || message.includes('hall') || message.includes('lecture');

  // Smart recommendation logic
  let recommendation;
  let reasoning;
  let alternatives = [];

  if (studentCount) {
    if (studentCount <= 15) {
      recommendation = "65-inch";
      reasoning = `For ${studentCount} students, the 65" panel provides excellent visibility and interaction. It's cost-effective and perfect for intimate learning environments.`;
      alternatives = ["Consider 75\" for future expansion", "View all sizes"];
    } else if (studentCount <= 30) {
      recommendation = "75-inch";
      reasoning = `With ${studentCount} students, the 75" panel offers the ideal balance of size and visibility. Students in back rows will clearly see content.`;
      alternatives = ["Upgrade to 86\" for premium experience", "Compare with 65\""];
    } else {
      recommendation = "86-inch";
      reasoning = `For ${studentCount} students, I strongly recommend the 86" panel! It ensures everyone can see clearly, even from the back. The large display enhances engagement and collaboration.`;
      alternatives = ["See 75\" alternative", "Budget considerations"];
    }
  } else if (isClassroom) {
    recommendation = "75-inch";
    reasoning = "For typical classrooms, the 75\" panel is our most popular choice. It works great for 20-30 students and offers excellent value.";
    alternatives = ["Small class? Try 65\"", "Large class? Consider 86\""];
  } else if (isMeeting) {
    recommendation = "65-inch";
    reasoning = "For meeting rooms, the 65\" panel is perfect. It's ideal for 8-15 participants and fits well in most corporate spaces.";
    alternatives = ["Large boardroom? Consider 75\"", "Executive room? Try 86\""];
  } else if (isAuditorium) {
    recommendation = "86-inch";
    reasoning = "For auditoriums and lecture halls, the 86\" panel is essential. It ensures visibility from any distance and supports large group interactions.";
    alternatives = ["See installation options", "Multiple panel setup"];
  } else {
    recommendation = "75-inch";
    reasoning = "Based on your requirements, I recommend the 75\" panel as our most versatile option. It works well for most educational and business environments.";
    alternatives = ["Tell me room size for better recommendation", "Compare all sizes"];
  }

  return {
    text: `🎯 **My Recommendation: RAPTOR ${recommendation.toUpperCase()} Panel**

${reasoning}

**Why this size?**
• ${recommendation === "65-inch" ? "Cost-effective for smaller groups" : 
      recommendation === "75-inch" ? "Perfect balance of size and price" : 
      "Maximum visibility and engagement"}
• ${recommendation === "65-inch" ? "Easy installation in tight spaces" : 
      recommendation === "75-inch" ? "Ideal viewing distance for most rooms" : 
      "Professional presentation impact"}
• ${recommendation === "65-inch" ? "Suitable for interactive small groups" : 
      recommendation === "75-inch" ? "Great for collaborative learning" : 
      "Supports large group activities"}

Of course, the final choice is yours! Would you like to see other options?`,
    productInfo: {
      name: `RAPTOR ${recommendation.toUpperCase()} Panel - RECOMMENDED`,
      specs: recommendation === "65-inch" ? [
        "Perfect for 10-20 students",
        "4K Ultra HD display",
        "Cost-effective solution",
        "Compact design"
      ] : recommendation === "75-inch" ? [
        "Ideal for 20-30 students", 
        "4K UHD Resolution",
        "20-point multi-touch",
        "Best value for money"
      ] : [
        "Perfect for 30+ students",
        "4K UHD Resolution (3840×2160)",
        "40-point infrared touch",
        "Maximum visibility and impact"
      ]
    },
    quickReplies: [
      `View ${recommendation} in AR`,
      alternatives[0] || "See alternatives",
      "Get pricing",
      "Installation info"
    ],
    actions: [
      { type: 'ar', label: `Try ${recommendation} in AR`, product: recommendation },
      { type: 'contact', label: 'Discuss My Needs', icon: Phone },
      { type: 'compare', label: 'Compare All Sizes' }
    ]
  };
};

// Handle RAPTOR-specific queries
const handleRaptorQueries = (message) => {
  // Check for classroom/room size recommendations
  const classroomMatch = checkClassroomSizeRecommendation(message);
  if (classroomMatch) return classroomMatch;

  if (message.includes('86') || message.includes('largest')) {
    return {
      text: "The RAPTOR 86\" Interactive Panel (RPDCI86) is our flagship model! Here are the key specs:",
      productInfo: {
        name: "RAPTOR 86\" Interactive Panel",
        specs: [
          "4K UHD Resolution (3840×2160)",
          "40-point infrared touch",
          "Android 14.0, 8GB RAM, 128GB storage",
          "350 cd/m² brightness",
          "2×20W built-in speakers",
          "WiFi 5, Bluetooth 5.0"
        ]
      },
      quickReplies: ["Compare with 75\"", "View in AR", "Get pricing", "Installation details"],
      actions: [
        { type: 'ar', label: 'View in AR', product: '86-inch' },
        { type: 'contact', label: 'Get Quote', icon: Phone }
      ]
    };
  }

  if (message.includes('75')) {
    return {
      text: "The RAPTOR 75\" panel is perfect for medium-sized classrooms and meeting rooms:",
      productInfo: {
        name: "RAPTOR 75\" Interactive Panel",
        specs: [
          "4K UHD Resolution",
          "20-point multi-touch",
          "Android OS with 8GB RAM",
          "Perfect for 20-30 person spaces",
          "Anti-glare display",
          "Energy efficient design"
        ]
      },
      quickReplies: ["Compare with 86\"", "AR demo", "Classroom setup", "Pricing"],
      actions: [
        { type: 'ar', label: 'View in AR', product: '75-inch' }
      ]
    };
  }

  if (message.includes('65')) {
    return {
      text: "The RAPTOR 65\" panel is ideal for smaller spaces and huddle rooms:",
      productInfo: {
        name: "RAPTOR 65\" Interactive Panel",
        specs: [
          "4K Ultra HD display",
          "Multi-touch capability",
          "Compact design",
          "Perfect for 10-15 person meetings",
          "Easy installation",
          "Cost-effective solution"
        ]
      },
      quickReplies: ["View larger sizes", "AR demo", "Installation", "Compare features"],
      actions: [
        { type: 'ar', label: 'View in AR', product: '65-inch' }
      ]
    };
  }

  // General RAPTOR info
  return {
    text: "Our RAPTOR Interactive Panels come in 65\", 75\", and 86\" sizes. All feature 4K displays, multi-touch capability, and Android OS. Which size interests you most?",
    quickReplies: ["86-inch specs", "75-inch specs", "65-inch specs", "Compare all sizes"],
    actions: [
      { type: 'compare', label: 'Compare Sizes' }
    ]
  };
};

// Handle KYOCERA-specific queries
const handleKyoceraQueries = (message) => {
  if (message.includes('taskalfa')) {
    return {
      text: "KYOCERA TASKalfa series offers reliable multifunction printing solutions:",
      productInfo: {
        name: "KYOCERA TASKalfa Series",
        specs: [
          "TASKalfa 2020: 20ppm, 350 sheets",
          "TASKalfa 3200: 32ppm, 600 sheets", 
          "TASKalfa 2554ci: Color, 25ppm",
          "TASKalfa 2321: Compact, 23ppm",
          "Network ready, energy efficient",
          "Long-life components"
        ]
      },
      quickReplies: ["Color vs mono", "Specifications", "Best for office", "Pricing"],
      actions: [
        { type: 'contact', label: 'Get Quote', icon: Phone }
      ]
    };
  }

  if (message.includes('ecosys')) {
    return {
      text: "KYOCERA ECOSYS series provides cost-effective, eco-friendly printing:",
      productInfo: {
        name: "KYOCERA ECOSYS Series",
        specs: [
          "ECOSYS MA4000x: 40ppm mono",
          "ECOSYS M8124cidn: A3 color, 24ppm",
          "Low running costs",
          "Duplex printing standard",
          "Professional quality output",
          "Environmental sustainability"
        ]
      },
      quickReplies: ["A3 vs A4", "Running costs", "Eco features", "Compare models"],
      actions: [
        { type: 'contact', label: 'Request Demo', icon: Phone }
      ]
    };
  }

  return {
    text: "Our KYOCERA printer range includes TASKalfa (multifunction) and ECOSYS (cost-effective) series. Both offer exceptional reliability and print quality. What's your primary printing need?",
    quickReplies: ["High volume printing", "Color printing", "Small office", "Compare series"]
  };
};

// Handle FAQ queries
const checkFAQDatabase = (message) => {
  for (const [category, faq] of Object.entries(faqDatabase)) {
    if (faq.patterns.some(pattern => message.includes(pattern.toLowerCase()))) {
      return {
        text: faq.response,
        quickReplies: faq.quickReplies || ["More info", "Contact sales", "Other questions"]
      };
    }
  }
  return null;
};

// Handle contact/sales queries
const checkContactQueries = (message) => {
  const contactKeywords = ['price', 'cost', 'quote', 'buy', 'purchase', 'demo', 'visit', 'contact', 'sales', 'call'];
  
  if (contactKeywords.some(keyword => message.includes(keyword))) {
    return {
      text: "I'd be happy to connect you with our sales team for personalized pricing and demos!",
      actions: [
        { type: 'contact', label: 'Call Sales', icon: Phone },
        { type: 'email', label: 'Email Us', icon: Mail },
        { type: 'demo', label: 'Schedule Demo', icon: ArrowRight }
      ],
      quickReplies: ["Product specifications", "AR demo", "Installation info"]
    };
  }
  return null;
};

// Handle feature/AR queries
const checkFeatureQueries = (message) => {
  const arKeywords = ['ar', 'augmented', 'reality', '3d', 'camera', 'view'];
  const installKeywords = ['install', 'setup', 'mount', 'installation'];
  
  if (arKeywords.some(keyword => message.includes(keyword))) {
    return {
      text: "Our AR feature lets you visualize RAPTOR panels in your actual space! Just click 'View in AR' on any panel product page and use your phone camera to place the virtual panel.",
      quickReplies: ["Try AR now", "Which panels have AR?", "AR requirements"],
      actions: [
        { type: 'ar', label: 'Launch AR Demo', product: 'demo' }
      ]
    };
  }

  if (installKeywords.some(keyword => message.includes(keyword))) {
    return {
      text: "Professional installation is included with all RAPTOR panels! Our certified technicians handle wall mounting, calibration, cable management, and user training.",
      quickReplies: ["Installation time", "Training included?", "Warranty details", "Schedule install"]
    };
  }

  return null;
};

// Expanded general queries handler
const checkGeneralQueries = (message) => {
  // Company information
  if (message.includes('orient solutions') || message.includes('company') || message.includes('about')) {
    return {
      text: "Orient Solutions is a leading provider of innovative technology solutions in India. We specialize in RAPTOR interactive panels for education and KYOCERA printers for offices. We're committed to delivering excellence with cutting-edge AR visualization and professional support.",
      quickReplies: ["Our products", "Contact info", "Why choose us", "Get demo"],
      actions: [
        { type: 'contact', label: 'Learn More', icon: Phone }
      ]
    };
  }

  // Technology trends / benefits
  if (message.includes('benefit') || message.includes('advantage') || message.includes('why choose')) {
    return {
      text: "Our solutions offer significant benefits: Enhanced student engagement with interactive panels, improved productivity with reliable KYOCERA printers, cost savings through energy-efficient technology, and future-ready features like AR visualization. Plus, we provide complete support from installation to training.",
      quickReplies: ["Cost savings details", "Student engagement", "AR benefits", "Support services"]
    };
  }

  // Interactive learning / education technology
  if (message.includes('interactive learning') || message.includes('education technology') || message.includes('smart classroom')) {
    return {
      text: "Interactive learning transforms education! Our RAPTOR panels enable touch-based collaboration, multimedia presentations, and student participation. Features like multi-touch, Android apps, and wireless connectivity create engaging digital classrooms that improve learning outcomes.",
      quickReplies: ["RAPTOR features", "Classroom setup", "Student benefits", "See demo"],
      actions: [
        { type: 'ar', label: 'Try AR Demo', product: 'demo' }
      ]
    };
  }

  // Printing solutions / office productivity  
  if (message.includes('printing solution') || message.includes('office productivity') || message.includes('document management')) {
    return {
      text: "Our KYOCERA printers boost office productivity with fast, reliable printing, scanning, and copying. Features include energy efficiency, network connectivity, mobile printing, and long-life components that reduce downtime and operating costs.",
      quickReplies: ["KYOCERA models", "Cost per page", "Mobile printing", "Maintenance"]
    };
  }

  // Return null if no general query matches
  return null;
};