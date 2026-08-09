
import prisma from "../config/prisma.js";

async function createMpesaSurvey() {
  try {
    const title = "M-Pesa Usage & Mobile Money Habits in Kenya";

    // Prevent duplicate survey
    const existingSurvey = await prisma.survey.findFirst({
      where: {
        title,
      },
    });

    if (existingSurvey) {
      console.log("⚠️ This survey already exists.");
      console.log(`Survey ID: ${existingSurvey.id}`);
      return;
    }

    const questions = [
      {
        question: "How often do you use M-Pesa?",
        questionType: "RADIO",
        required: true,
        options: [
          "Several times a day",
          "Once a day",
          "Several times a week",
          "Once a week",
          "Less than once a week",
          "I do not use M-Pesa"
        ]
      },

      {
        question: "What do you mainly use M-Pesa for?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Sending money to family or friends",
          "Receiving money",
          "Buying airtime or data",
          "Paying bills",
          "Paying for goods and services",
          "Receiving salary or business payments",
          "Saving money",
          "Sending money to businesses",
          "Other"
        ]
      },

      {
        question: "How would you rate your overall experience with M-Pesa?",
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
        question: "Which M-Pesa services do you use regularly?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Send Money",
          "Lipa na M-Pesa",
          "Buy Goods",
          "PayBill",
          "Airtime",
          "M-Pesa App",
          "M-Pesa Global",
          "M-Shwari",
          "Fuliza",
          "Other"
        ]
      },

      {
        question: "How frequently do you pay for goods or services using Lipa na M-Pesa?",
        questionType: "RADIO",
        required: true,
        options: [
          "Several times a week",
          "About once a week",
          "Several times a month",
          "Once a month",
          "Rarely",
          "Never"
        ]
      },

      {
        question: "Where do you most commonly use Lipa na M-Pesa?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Supermarkets",
          "Restaurants",
          "Small shops and kiosks",
          "Pharmacies",
          "Fuel stations",
          "Online businesses",
          "Transport services",
          "Hotels and accommodation",
          "Other"
        ]
      },

      {
        question: "Which method do you usually use to access M-Pesa?",
        questionType: "RADIO",
        required: true,
        options: [
          "USSD (*334#)",
          "M-Pesa App",
          "SIM Toolkit",
          "Business Till/PayBill",
          "Other"
        ]
      },

      {
        question: "What is the main reason you choose M-Pesa instead of cash?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Convenience",
          "Speed",
          "Security",
          "Easy record of transactions",
          "Widely accepted",
          "I do not need to carry cash",
          "Easy to send money remotely",
          "Other"
        ]
      },

      {
        question: "Have you ever experienced a failed or delayed M-Pesa transaction?",
        questionType: "RADIO",
        required: true,
        options: [
          "Frequently",
          "Sometimes",
          "Rarely",
          "Never"
        ]
      },

      {
        question: "How confident are you that your money is secure when using M-Pesa?",
        questionType: "RADIO",
        required: true,
        options: [
          "Very confident",
          "Confident",
          "Neutral",
          "Not very confident",
          "Not confident at all"
        ]
      },

      {
        question: "Which other mobile money services have you used in Kenya?",
        questionType: "CHECKBOX",
        required: false,
        options: [
          "Airtel Money",
          "Equitel Money",
          "Bank mobile money services",
          "Digital wallets",
          "None",
          "Other"
        ]
      },

      {
        question: "What is the biggest challenge you experience when using M-Pesa?",
        questionType: "RADIO",
        required: true,
        options: [
          "Transaction charges",
          "Network problems",
          "Failed transactions",
          "Delayed transactions",
          "Agent availability",
          "Fraud or security concerns",
          "Transaction limits",
          "I do not experience significant problems",
          "Other"
        ]
      },

      {
        question: "How often do you withdraw cash from an M-Pesa agent?",
        questionType: "RADIO",
        required: true,
        options: [
          "Several times a week",
          "Once a week",
          "Several times a month",
          "Once a month",
          "Rarely",
          "Never"
        ]
      },

      {
        question: "What improvements would make M-Pesa more useful to you?",
        questionType: "TEXTAREA",
        required: true,
        placeholder: "Tell us what you would like M-Pesa to improve..."
      },

      {
        question: "Is there anything else you would like to share about your experience using mobile money services in Kenya?",
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
            "This survey explores how Kenyans use M-Pesa and other mobile money services in their daily lives. We want to understand usage patterns, preferred services, payment habits, customer experiences, challenges, and areas where mobile money services could be improved.",
          reward: 30,
          timeEstimate: 8,
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
    console.error("❌ Error creating M-Pesa survey:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createMpesaSurvey();

