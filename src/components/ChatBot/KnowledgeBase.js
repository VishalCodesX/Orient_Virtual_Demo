// Updated KnowledgeBase.js with new products

export const productKnowledgeBase = {
  raptor: {
    panels: {
      "86-inch": {
        model: "RPDCI86",
        name: "RAPTOR 86\" Interactive Panel",
        resolution: "4K UHD 3840×2160",
        touchPoints: "40 Points Touch",
        brightness: "350 cd/m²",
        ram: "8GB",
        storage: "128GB",
        android: "Android 14.0",
        speakers: "2×20W",
        connectivity: "WiFi 5, Bluetooth 5.0",
        dimensions: "1952.96×1184.4×87.3mm",
        weight: "65.4±1kgs",
        power: "450W max",
        features: [
          "4K Ultra HD display",
          "40-point infrared touch",
          "Android 14.0 OS",
          "Built-in WiFi & Bluetooth",
          "Anti-glare LCD",
          "Professional speakers",
          "VESA mount compatible"
        ],
        useCases: [
          "Large classrooms (30+ students)",
          "Conference rooms",
          "Training centers",
          "Auditoriums"
        ],
        pricing: "contact_sales"
      },
      "75-inch": {
        model: "RPDCI75",
        name: "RAPTOR 75\" Interactive Panel",
        resolution: "4K UHD 3840×2160",
        touchPoints: "20 Points Touch",
        brightness: "400 cd/m²",
        android: "Android 14.0",
        features: [
          "4K display quality",
          "Multi-touch capability",
          "Energy efficient",
          "Medium room solution"
        ],
        useCases: [
          "Medium classrooms (20-30 students)",
          "Meeting rooms",
          "Small auditoriums"
        ],
        pricing: "contact_sales"
      },
      "65-inch": {
        model: "RPDCI65", 
        name: "RAPTOR 65\" Interactive Panel",
        resolution: "4K UHD 3840×2160",
        touchPoints: "20 Points Touch",
        android: "Android 14.0",
        features: [
          "Compact design",
          "4K clarity",
          "Touch interaction",
          "Cost-effective"
        ],
        useCases: [
          "Small classrooms (10-20 students)",
          "Huddle rooms",
          "Offices",
          "Small meeting spaces"
        ],
        pricing: "contact_sales"
      }
    },
    podium: {
      model: "Smart Podium",
      name: "RAPTOR Smart Podium", 
      features: [
        "Integrated display",
        "Adjustable height",
        "Cable management",
        "Secure storage",
        "Built-in amplifier",
        "VHF microphone system"
      ],
      useCases: [
        "Lecture halls",
        "Conference centers", 
        "Auditoriums",
        "Presentation rooms"
      ],
      pricing: "contact_sales"
    },
    // NEW: OPS Computer
    ops: {
      model: "OPS-i5-12500H",
      name: "RAPTOR OPS Computer",
      processor: "Intel Core i5-12500H Quad Core (8 Thread)",
      memory: "8GB DDR4-2666MHz (Max 32GB)",
      storage: "256GB M.2 SSD",
      os: "Windows 11 Pro",
      graphics: "UHD Graphics for 12th Gen Intel",
      features: [
        "12th Generation Intel Core i5",
        "Windows 11 Pro OS",
        "4K @ 60Hz video playback",
        "Plug-and-play installation",
        "Multiple connectivity options",
        "3-year warranty",
        "OPS compliant design"
      ],
      connectivity: [
        "Gigabit Ethernet",
        "Wi-Fi Dual Band",
        "Bluetooth 4.2",
        "HDMI 2.0 out",
        "DisplayPort out",
        "USB Type-C",
        "6x USB 3.0 ports"
      ],
      useCases: [
        "Upgrading Android panels to Windows",
        "Running Windows applications on panels",
        "Business presentations",
        "Digital education with Windows software",
        "Enterprise applications"
      ],
      pricing: "contact_sales"
    },
    // NEW: LED Wall
    ledwall: {
      model: "LED-Wall-Modular",
      name: "RAPTOR LED Wall Display",
      pixel_pitch: "P2, P2.5, P3.076, P4, P5",
      module_size: "320 x 160mm",
      brightness: {
        indoor: "600-800 cd/sqm",
        outdoor: "4000-6000 cd/sqm"
      },
      refresh_rate: "≥1920Hz",
      gray_scale: "16bit",
      viewing_angle: "160°/160° (H/V)",
      features: [
        "Modular design for scalability",
        "High resolution display",
        "Edge protection technology", 
        "Advanced design aesthetics",
        "One-man installation system",
        "Slim thickness profile",
        "Front and rear service access"
      ],
      variants: [
        {
          type: "Indoor LED Wall",
          applications: ["Conference rooms", "Auditoriums", "Control centers", "Broadcasting studios"],
          protection: "IP43"
        },
        {
          type: "Outdoor LED Wall", 
          applications: ["Building facades", "Sports stadiums", "Advertising displays", "Public spaces"],
          protection: "IP65"
        }
      ],
      accessories: [
        "AI Auto Tracking 4K Camera",
        "PTZ cameras with optical zoom",
        "Bluetooth speakerphone",
        "Wireless microphone systems"
      ],
      useCases: [
        "Large venue displays",
        "Outdoor advertising",
        "Stadium scoreboards",
        "Control room video walls",
        "Broadcasting backgrounds",
        "Corporate lobbies",
        "Event backdrops"
      ],
      pricing: "contact_sales"
    }
  },
  kyocera: {
    // ... existing KYOCERA products remain the same
    taskalfa: {
      "2020": {
        name: "KYOCERA TASKalfa 2020",
        type: "Monochrome Multifunction",
        speed: "20 ppm",
        capacity: "350 sheets",
        features: [
          "Compact design",
          "Energy efficient", 
          "Network ready",
          "Mobile printing support"
        ],
        useCases: ["Small offices", "Workgroups"]
      },
      "3200": {
        name: "KYOCERA TASKalfa 3200", 
        type: "Monochrome Multifunction",
        speed: "32 ppm",
        capacity: "600 sheets",
        features: [
          "High-speed performance",
          "Advanced security",
          "Large paper capacity",
          "Workflow optimization"
        ],
        useCases: ["Medium offices", "Departments"]
      },
      "2554ci": {
        name: "KYOCERA TASKalfa 2554ci",
        type: "Color Multifunction", 
        speed: "25 ppm color",
        touchPanel: "7-inch",
        features: [
          "Full color capability",
          "Touch screen interface",
          "High-speed scanning",
          "Advanced finishing options"
        ],
        useCases: ["Marketing departments", "Design teams"]
      }
    },
    ecosys: {
      "ma4000x": {
        name: "KYOCERA ECOSYS MA4000x",
        type: "Monochrome Multifunction",
        speed: "40 ppm", 
        capacity: "1,150 sheets",
        features: [
          "High-volume capability",
          "Duplex printing standard",
          "Long-life components",
          "Cost-effective operation"
        ],
        useCases: ["High-volume printing", "Large offices"]
      },
      "m8124cidn": {
        name: "KYOCERA ECOSYS M8124cidn",
        type: "A3 Color Multifunction",
        speed: "24 ppm A3 color",
        memory: "4 GB",
        features: [
          "A3 format support",
          "Professional color quality", 
          "High-speed duplex scanning",
          "Enterprise security features"
        ],
        useCases: ["Design studios", "Engineering firms", "Large enterprises"]
      }
    }
  }
};

export const faqDatabase = {
  ar_features: {
    patterns: ["ar", "augmented reality", "3d model", "camera", "virtual"],
    response: "Our AR feature works on both iOS and Android devices! Simply click 'View in AR' on any RAPTOR panel product page. You can place the virtual panel in your space, resize it, and see exactly how it will look before purchasing.",
    quickReplies: ["AR requirements", "Supported devices", "Try AR demo"]
  },
  installation: {
    patterns: ["install", "installation", "setup", "mount", "mounting"],
    response: "Professional installation is included with every RAPTOR panel! Our certified technicians handle wall mounting (VESA compatible), cable management, calibration, and provide comprehensive user training. Installation typically takes 2-3 hours.",
    quickReplies: ["Installation time", "Training details", "Warranty info", "Schedule install"]
  },
  connectivity: {
    patterns: ["connect", "wifi", "bluetooth", "wireless", "network"],
    response: "All RAPTOR panels feature built-in WiFi 5 (dual-band 2.4GHz/5GHz) and Bluetooth 5.0. They also include multiple ports: HDMI, USB 3.0, VGA, and RJ45 ethernet for wired connections.",
    quickReplies: ["Port details", "Network setup", "Wireless range", "Technical specs"]
  },
  touch_technology: {
    patterns: ["touch", "multi-touch", "infrared", "writing", "pen"],
    response: "Our panels use advanced infrared touch technology with up to 40 touch points (86\" model). They support simultaneous pen and finger touch, with ±1mm precision and ≤5ms response time. Perfect for natural writing and multi-user collaboration.",
    quickReplies: ["Touch accuracy", "Multi-user support", "Pen compatibility", "Touch demo"]
  },
  software: {
    patterns: ["software", "android", "apps", "applications", "os"],
    response: "RAPTOR panels run Android 14.0 with 8GB RAM and 128GB storage. They come with pre-installed educational and business apps, plus access to Google Play Store. The interface is optimized for large-screen touch interaction.",
    quickReplies: ["Pre-installed apps", "Play Store access", "Custom software", "Updates"]
  },
  // NEW: OPS Computer FAQ
  ops_computer: {
    patterns: ["ops", "windows", "computer", "pc", "pluggable", "specification"],
    response: "The RAPTOR OPS Computer transforms your Android panel into a powerful Windows 11 PC! It features 12th Gen Intel Core i5, 8GB RAM, 256GB SSD, and plugs directly into compatible panels. Perfect for running Windows applications, business software, and enterprise solutions.",
    quickReplies: ["OPS compatibility", "Windows features", "Installation process", "Performance specs"]
  },
  // NEW: LED Wall FAQ  
  led_wall: {
    patterns: ["led wall", "led display", "video wall", "large display", "outdoor display"],
    response: "Our RAPTOR LED Wall offers stunning visual experiences with modular design! Available in various pixel pitches (P2-P5), suitable for both indoor and outdoor use. Features include high brightness, excellent viewing angles, and easy maintenance with front/rear access.",
    quickReplies: ["Indoor vs outdoor", "Pixel pitch options", "Installation requirements", "Maintenance"]
  },
  warranty: {
    patterns: ["warranty", "support", "service", "maintenance"],
    response: "All Orient Solutions products come with comprehensive warranty coverage and 24/7 support. We provide on-site service, remote assistance, and preventive maintenance. Our support team is available at +91 98409 09409.",
    quickReplies: ["Warranty details", "Support hours", "Contact support"]
  },
  comparison: {
    patterns: ["compare", "difference", "vs", "versus", "which", "better"],
    response: "I can help you compare our products! For RAPTOR panels: 65\" is perfect for small rooms, 75\" for medium spaces, and 86\" for large classrooms. For KYOCERA: TASKalfa for multifunction needs, ECOSYS for cost-effective printing. We also offer OPS computers for Windows functionality and LED walls for large displays.",
    quickReplies: ["Panel comparison", "Printer comparison", "OPS vs Android", "LED wall sizes"]
  },
  training: {
    patterns: ["training", "learn", "how to use", "tutorial", "guide"],
    response: "We provide comprehensive training with every installation! This includes hands-on tutorials, user manuals, video guides, and ongoing support. Our team ensures you're comfortable using all features before we leave.",
    quickReplies: ["Training duration", "Video tutorials", "User manual", "Advanced features"]
  }
};