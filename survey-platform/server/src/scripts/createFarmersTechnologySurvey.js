
import prisma from "../config/prisma.js";

async function createFarmersTechnologySurvey() {
  try {
    const title = "Kenyan Farmers' Technology Usage Survey";

    // Prevent duplicate survey
    const existingSurvey = await prisma.survey.findFirst({
      where: {
        title
      }
    });

    if (existingSurvey) {
      console.log("⚠️ This survey already exists.");
      console.log(`Survey ID: ${existingSurvey.id}`);
      return;
    }

    const questions = [
      {
        question: "Which county do you currently farm in?",
        questionType: "TEXT",
        required: true,
        placeholder: "Enter your county"
      },

      {
        question: "What type of farming do you mainly practice?",
        questionType: "RADIO",
        required: true,
        options: [
          "Crop farming",
          "Livestock farming",
          "Poultry farming",
          "Dairy farming",
          "Fish farming",
          "Mixed farming",
          "Horticulture",
          "Other"
        ]
      },

      {
        question: "How long have you been involved in farming?",
        questionType: "RADIO",
        required: true,
        options: [
          "Less than 1 year",
          "1-3 years",
          "4-10 years",
          "11-20 years",
          "More than 20 years"
        ]
      },

      {
        question: "What size of farm do you mainly operate?",
        questionType: "RADIO",
        required: true,
        options: [
          "Less than 1 acre",
          "1-5 acres",
          "6-10 acres",
          "11-20 acres",
          "More than 20 acres",
          "I do not know the exact size"
        ]
      },

      {
        question: "Which technologies do you currently use in your farming activities?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Mobile phone",
          "Smartphone",
          "Internet",
          "Mobile money",
          "Online farming platforms",
          "Weather apps",
          "Digital marketplaces",
          "Farm management apps",
          "GPS or mapping tools",
          "I do not use digital technology",
          "Other"
        ]
      },

      {
        question: "How often do you use a mobile phone for farming-related activities?",
        questionType: "RADIO",
        required: true,
        options: [
          "Several times a day",
          "Daily",
          "Several times a week",
          "Weekly",
          "Rarely",
          "Never"
        ]
      },

      {
        question: "What do you mainly use your phone for when managing your farm?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Communicating with customers",
          "Communicating with suppliers",
          "Checking market prices",
          "Checking weather information",
          "Finding farming information",
          "Mobile payments",
          "Selling farm products",
          "Buying farm inputs",
          "Keeping farm records",
          "Other"
        ]
      },

      {
        question: "Do you use M-Pesa or another mobile money service for farming activities?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, frequently",
          "Yes, occasionally",
          "Rarely",
          "No"
        ]
      },

      {
        question: "Which digital sources do you use to obtain farming information?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "WhatsApp",
          "Facebook",
          "YouTube",
          "Google",
          "Agricultural websites",
          "Mobile apps",
          "SMS messages",
          "Online farmer groups",
          "Government websites",
          "I do not use digital sources",
          "Other"
        ]
      },

      {
        question: "How useful is the internet for your farming activities?",
        questionType: "RADIO",
        required: true,
        options: [
          "Very useful",
          "Useful",
          "Somewhat useful",
          "Not very useful",
          "Not useful at all"
        ]
      },

      {
        question: "Have you ever used technology to check current market prices for your farm products?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, regularly",
          "Yes, occasionally",
          "Once or twice",
          "No"
        ]
      },

      {
        question: "Have you used weather information or weather apps to make farming decisions?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, regularly",
          "Sometimes",
          "Rarely",
          "Never"
        ]
      },

      {
        question: "Have you ever sold farm products through an online platform or digital marketplace?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, regularly",
          "Yes, occasionally",
          "I have tried but stopped",
          "No, but I would like to",
          "No, and I am not interested"
        ]
      },

      {
        question: "What are the biggest challenges preventing you from using more technology in farming?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "High cost of smartphones or devices",
          "Expensive internet/data",
          "Poor network coverage",
          "Lack of digital skills",
          "Lack of electricity",
          "Technology is difficult to use",
          "Lack of relevant farming information",
          "Lack of trust in online platforms",
          "I do not have significant challenges",
          "Other"
        ]
      },

      {
        question: "Would you be interested in using an app that helps farmers find buyers, check market prices, access weather information, and manage farm activities?",
        questionType: "RADIO",
        required: true,
        options: [
          "Very interested",
          "Interested",
          "Not sure",
          "Not very interested",
          "Not interested at all"
        ]
      },

      {
        question: "Which features would be most useful in a farming app?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Live market prices",
          "Finding buyers",
          "Weather forecasts",
          "Pest and disease information",
          "Access to agricultural experts",
          "Farm record keeping",
          "Access to farm inputs",
          "Loan and financial information",
          "Agricultural training",
          "Other"
        ]
      },

      {
        question: "How comfortable are you learning to use a new farming technology or mobile application?",
        questionType: "RADIO",
        required: true,
        options: [
          "Very comfortable",
          "Comfortable",
          "Somewhat comfortable",
          "Not very comfortable",
          "Not comfortable at all"
        ]
      },

      {
        question: "What type of technology would you most like to see made available to Kenyan farmers?",
        questionType: "TEXTAREA",
        required: true,
        placeholder: "Tell us what technology or digital service would help your farming..."
      },

      {
        question: "How has technology changed the way you farm?",
        questionType: "TEXTAREA",
        required: false,
        placeholder: "Share your experience..."
      },

      {
        question: "Is there anything else you would like to tell us about technology and farming in Kenya?",
        questionType: "TEXTAREA",
        required: false,
        placeholder: "Share any additional comments..."
      }
    ];

    await prisma.$transaction(async (tx) => {
      const survey = await tx.survey.create({
        data: {
          title,
          description:
            "This survey explores how farmers in Kenya use mobile phones, internet services, mobile money, digital platforms, weather information, online marketplaces, and other technologies in their farming activities. Your responses will help us understand the opportunities and challenges Kenyan farmers face when adopting digital technology.",
          reward: 50,
          timeEstimate: 10,
          status: "ACTIVE"
        }
      });

      await tx.surveyQuestion.createMany({
        data: questions.map((q, index) => ({
          surveyId: survey.id,
          question: q.question,
          questionType: q.questionType,
          options: q.options || null,
          placeholder: q.placeholder || null,
          required: q.required,
          order: index + 1
        }))
      });

      console.log("========================================");
      console.log("✅ SURVEY CREATED SUCCESSFULLY");
      console.log("========================================");
      console.log(`Title: ${survey.title}`);
      console.log(`Survey ID: ${survey.id}`);
      console.log(`Reward: KES ${survey.reward}`);
      console.log(`Time: ${survey.timeEstimate} minutes`);
      console.log(`Questions: ${questions.length}`);
      console.log("========================================");
    });

  } catch (error) {
    console.error("❌ Error creating farmers technology survey:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createFarmersTechnologySurvey();

