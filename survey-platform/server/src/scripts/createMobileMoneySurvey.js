
import prisma from "../config/prisma.js";

async function createMobileMoneySurvey() {
  try {
    const title = "Mobile Money & M-Pesa Usage in Kenya";

    const existingSurvey = await prisma.survey.findFirst({
      where: { title }
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
        question: "Which mobile money services do you currently use?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "M-Pesa",
          "Airtel Money",
          "Equitel Money",
          "Other",
          "None"
        ]
      },

      {
        question: "Which mobile money service do you use most often?",
        questionType: "RADIO",
        required: true,
        options: [
          "M-Pesa",
          "Airtel Money",
          "Equitel Money",
          "Other"
        ]
      },

      {
        question: "How frequently do you use mobile money?",
        questionType: "RADIO",
        required: true,
        options: [
          "Several times a day",
          "Daily",
          "Several times a week",
          "Weekly",
          "Less than once a week",
          "Rarely"
        ]
      },

      {
        question: "Which mobile money services do you use most frequently?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Sending money",
          "Receiving money",
          "Buying airtime",
          "Buying data bundles",
          "Paying bills",
          "Paying for goods",
          "Paying school fees",
          "Receiving salary or business payments",
          "Saving money",
          "Borrowing money",
          "Other"
        ]
      },

      {
        question: "How often do you send money to other people using mobile money?",
        questionType: "RADIO",
        required: true,
        options: [
          "Several times a week",
          "Weekly",
          "Several times a month",
          "Monthly",
          "Rarely",
          "Never"
        ]
      },

      {
        question: "How often do you receive money through mobile money?",
        questionType: "RADIO",
        required: true,
        options: [
          "Several times a week",
          "Weekly",
          "Several times a month",
          "Monthly",
          "Rarely",
          "Never"
        ]
      },

      {
        question: "What do you mainly use mobile money for?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Personal transfers",
          "Family support",
          "Business payments",
          "Paying bills",
          "Shopping",
          "Transport",
          "School fees",
          "Rent",
          "Airtime and data",
          "Saving",
          "Other"
        ]
      },

      {
        question: "How much do you typically spend through mobile money in a month?",
        questionType: "RADIO",
        required: true,
        options: [
          "Less than KES 1,000",
          "KES 1,000 - 4,999",
          "KES 5,000 - 9,999",
          "KES 10,000 - 19,999",
          "KES 20,000 - 49,999",
          "KES 50,000 or more",
          "Not sure"
        ]
      },

      {
        question: "How often do you pay for goods or services using M-Pesa?",
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
        question: "Which types of businesses do you most often pay using mobile money?",
        questionType: "CHECKBOX",
        required: false,
        options: [
          "Supermarkets",
          "Restaurants",
          "Small shops",
          "Online businesses",
          "Transport services",
          "Utility providers",
          "Schools",
          "Hospitals or pharmacies",
          "Other"
        ]
      },

      {
        question: "Do you use a mobile money service for your business?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, as my main business payment method",
          "Yes, regularly",
          "Yes, occasionally",
          "I am planning to",
          "No"
        ]
      },

      {
        question: "Which mobile money business services do you use?",
        questionType: "CHECKBOX",
        required: false,
        options: [
          "Till number",
          "PayBill",
          "Receiving customer payments",
          "Paying suppliers",
          "Paying employees",
          "Business withdrawals",
          "Business savings",
          "None",
          "Other"
        ]
      },

      {
        question: "Have you ever used a mobile money service to save money?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, regularly",
          "Yes, occasionally",
          "I have tried it before",
          "No, but I am interested",
          "No"
        ]
      },

      {
        question: "Have you ever used a mobile money platform to access a loan or financial service?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, currently",
          "Yes, in the past",
          "I have considered it",
          "No"
        ]
      },

      {
        question: "What is the biggest advantage of using mobile money?",
        questionType: "RADIO",
        required: true,
        options: [
          "Convenience",
          "Speed",
          "Availability",
          "Security",
          "Easy access",
          "Ability to pay remotely",
          "Other"
        ]
      },

      {
        question: "What problems have you experienced when using mobile money?",
        questionType: "CHECKBOX",
        required: false,
        options: [
          "Transaction charges",
          "Failed transactions",
          "Delayed transactions",
          "Network problems",
          "Wrong number sent to",
          "Fraud or scams",
          "Agent availability",
          "Difficulty reversing transactions",
          "No major problems",
          "Other"
        ]
      },

      {
        question: "How concerned are you about mobile money fraud and scams?",
        questionType: "RADIO",
        required: true,
        options: [
          "Very concerned",
          "Concerned",
          "Somewhat concerned",
          "Not very concerned",
          "Not concerned at all"
        ]
      },

      {
        question: "What improvement would make mobile money services better for you?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Lower transaction fees",
          "Faster transactions",
          "Better network reliability",
          "Improved fraud protection",
          "Better customer support",
          "Easier transaction reversals",
          "More financial services",
          "Better business tools",
          "Other"
        ]
      },

      {
        question: "What is your biggest challenge or concern when using mobile money in Kenya?",
        questionType: "TEXTAREA",
        required: true,
        placeholder: "Tell us about your experience..."
      }
    ];

    await prisma.$transaction(async (tx) => {
      const survey = await tx.survey.create({
        data: {
          title,
          description:
            "This survey explores how people in Kenya use mobile money services such as M-Pesa and Airtel Money. It examines sending and receiving money, payments, business transactions, savings, digital financial services, transaction costs, security, fraud concerns, and the overall mobile money experience.",
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
    console.error("❌ Error creating mobile money survey:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createMobileMoneySurvey();

