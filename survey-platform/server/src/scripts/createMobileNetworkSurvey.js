
import prisma from "../config/prisma.js";

async function createMobileNetworkSurvey() {
  try {
    const title = "Mobile Network & Internet Experience in Kenya";

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
        question: "Which county do you currently live in?",
        questionType: "TEXT",
        required: true,
        placeholder: "Enter your county"
      },

      {
        question: "Which mobile network do you use most often?",
        questionType: "RADIO",
        required: true,
        options: [
          "Safaricom",
          "Airtel",
          "Telkom",
          "Equitel",
          "Faiba",
          "Other"
        ]
      },

      {
        question: "How long have you been using your current mobile network?",
        questionType: "RADIO",
        required: true,
        options: [
          "Less than 6 months",
          "6 months - 1 year",
          "1-3 years",
          "4-5 years",
          "More than 5 years"
        ]
      },

      {
        question: "What do you mainly use your mobile network for?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Voice calls",
          "SMS",
          "Mobile internet",
          "Social media",
          "Online work",
          "Online learning",
          "Streaming videos",
          "Online shopping",
          "Mobile banking",
          "Mobile money",
          "Other"
        ]
      },

      {
        question: "How frequently do you use mobile internet?",
        questionType: "RADIO",
        required: true,
        options: [
          "Several times a day",
          "Every day",
          "Several times a week",
          "Once a week",
          "Rarely"
        ]
      },

      {
        question: "Which type of mobile network do you normally use?",
        questionType: "RADIO",
        required: true,
        options: [
          "5G",
          "4G/LTE",
          "3G",
          "2G",
          "It varies depending on location",
          "I am not sure"
        ]
      },

      {
        question: "How would you rate the network coverage where you live?",
        questionType: "RADIO",
        required: true,
        options: [
          "Excellent",
          "Good",
          "Average",
          "Poor",
          "Very poor"
        ]
      },

      {
        question: "How reliable is your mobile internet connection?",
        questionType: "RADIO",
        required: true,
        options: [
          "Very reliable",
          "Reliable",
          "Sometimes unreliable",
          "Often unreliable",
          "Very unreliable"
        ]
      },

      {
        question: "How often do you experience slow mobile internet?",
        questionType: "RADIO",
        required: true,
        options: [
          "Several times a day",
          "Daily",
          "Several times a week",
          "Occasionally",
          "Rarely",
          "Never"
        ]
      },

      {
        question: "What do you normally spend on mobile data per month?",
        questionType: "RADIO",
        required: true,
        options: [
          "Less than KES 200",
          "KES 200 - 499",
          "KES 500 - 999",
          "KES 1,000 - 1,999",
          "KES 2,000 - 4,999",
          "KES 5,000 or more",
          "I am not sure"
        ]
      },

      {
        question: "Which types of data bundles do you usually purchase?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Daily bundles",
          "Weekly bundles",
          "Monthly bundles",
          "Social media bundles",
          "Night bundles",
          "Unlimited bundles",
          "Home internet bundles",
          "I mainly use Wi-Fi",
          "Other"
        ]
      },

      {
        question: "What is the main factor you consider when choosing a mobile network?",
        questionType: "RADIO",
        required: true,
        options: [
          "Network coverage",
          "Internet speed",
          "Data prices",
          "Call quality",
          "Customer service",
          "Promotions and offers",
          "Mobile money services",
          "Availability in my area",
          "Other"
        ]
      },

      {
        question: "Do you use Wi-Fi or fixed home internet?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, regularly",
          "Yes, occasionally",
          "I used to but no longer do",
          "No"
        ]
      },

      {
        question: "What do you mainly use home or Wi-Fi internet for?",
        questionType: "CHECKBOX",
        required: false,
        options: [
          "Work",
          "Online business",
          "Education",
          "Streaming",
          "Gaming",
          "Social media",
          "Video calls",
          "Downloading files",
          "General browsing",
          "Other"
        ]
      },

      {
        question: "Have network or internet problems ever affected your work, business, or studies?",
        questionType: "RADIO",
        required: true,
        options: [
          "Frequently",
          "Sometimes",
          "Rarely",
          "Never",
          "Not applicable"
        ]
      },

      {
        question: "How satisfied are you with the value you receive for the money you spend on mobile data?",
        questionType: "RADIO",
        required: true,
        options: [
          "Very satisfied",
          "Satisfied",
          "Neither satisfied nor dissatisfied",
          "Dissatisfied",
          "Very dissatisfied"
        ]
      },

      {
        question: "Have you ever switched mobile networks because of poor service?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, more than once",
          "Yes, once",
          "I have considered switching",
          "No"
        ]
      },

      {
        question: "Which improvements would most improve your internet experience?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Lower data prices",
          "Faster internet speeds",
          "Better rural coverage",
          "More reliable connections",
          "Better customer service",
          "More affordable home internet",
          "More transparent data bundle terms",
          "Better 4G/5G coverage",
          "Other"
        ]
      },

      {
        question: "What is the biggest internet or network challenge you experience?",
        questionType: "TEXTAREA",
        required: true,
        placeholder: "Describe your biggest challenge..."
      },

      {
        question: "What would you like mobile network providers in Kenya to improve?",
        questionType: "TEXTAREA",
        required: true,
        placeholder: "Share your suggestions..."
      }
    ];

    await prisma.$transaction(async (tx) => {
      const survey = await tx.survey.create({
        data: {
          title,
          description:
            "This survey explores how people in Kenya use mobile networks and internet services. It looks at network coverage, mobile data usage, internet costs, connection reliability, preferred services, customer experiences, and the improvements users would like to see from mobile network providers.",
          reward: 40,
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
    console.error("❌ Error creating mobile network survey:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createMobileNetworkSurvey();

