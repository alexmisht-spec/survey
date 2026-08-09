
import prisma from "../config/prisma.js";

async function createBankingSurvey() {
  try {
    const title = "Banking & Financial Services in Kenya";

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
        question: "Which financial institutions do you currently use?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Commercial bank",
          "SACCO",
          "Microfinance institution",
          "Digital bank",
          "Mobile money service",
          "Chama",
          "Other",
          "None"
        ]
      },

      {
        question: "Which bank do you use most frequently?",
        questionType: "SELECT",
        required: true,
        options: [
          "KCB",
          "Equity Bank",
          "Co-operative Bank",
          "Absa Bank",
          "NCBA",
          "Stanbic Bank",
          "I&M Bank",
          "Family Bank",
          "DTB",
          "Standard Chartered",
          "Ecobank",
          "Other"
        ]
      },

      {
        question: "How long have you had your main bank account?",
        questionType: "RADIO",
        required: true,
        options: [
          "Less than 1 year",
          "1-3 years",
          "4-5 years",
          "6-10 years",
          "More than 10 years"
        ]
      },

      {
        question: "How frequently do you use your bank account?",
        questionType: "RADIO",
        required: true,
        options: [
          "Several times a day",
          "Daily",
          "Several times a week",
          "Weekly",
          "Monthly",
          "Rarely"
        ]
      },

      {
        question: "What do you mainly use your bank account for?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Receiving salary",
          "Receiving business income",
          "Saving money",
          "Paying bills",
          "Sending money",
          "Receiving money",
          "Making purchases",
          "Loan repayments",
          "Investments",
          "Other"
        ]
      },

      {
        question: "How do you normally access your bank account?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Mobile banking app",
          "USSD",
          "ATM",
          "Bank branch",
          "Internet banking",
          "Agent",
          "Other"
        ]
      },

      {
        question: "How often do you visit a physical bank branch?",
        questionType: "RADIO",
        required: true,
        options: [
          "Several times a month",
          "Once a month",
          "Every few months",
          "Once or twice a year",
          "Rarely",
          "Never"
        ]
      },

      {
        question: "How satisfied are you with your main bank?",
        questionType: "RADIO",
        required: true,
        options: [
          "Very satisfied",
          "Satisfied",
          "Neutral",
          "Dissatisfied",
          "Very dissatisfied"
        ]
      },

      {
        question: "What factors are most important when choosing a bank?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Low fees",
          "Interest rates",
          "Mobile banking",
          "Branch availability",
          "ATM availability",
          "Customer service",
          "Security",
          "Loan availability",
          "Savings products",
          "Reputation",
          "Other"
        ]
      },

      {
        question: "How important are bank transaction fees when choosing a financial institution?",
        questionType: "RADIO",
        required: true,
        options: [
          "Extremely important",
          "Very important",
          "Somewhat important",
          "Not very important",
          "Not important at all"
        ]
      },

      {
        question: "Do you regularly save money with a bank, SACCO, or other financial institution?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, every month",
          "Yes, occasionally",
          "I save irregularly",
          "I currently do not save"
        ]
      },

      {
        question: "Where do you prefer to keep your savings?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Bank account",
          "SACCO",
          "Mobile money",
          "Chama",
          "Money market fund",
          "Cash",
          "Investment account",
          "Other"
        ]
      },

      {
        question: "Have you ever taken a loan from a financial institution?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, currently",
          "Yes, in the past",
          "I have applied but was not approved",
          "I have considered applying",
          "No"
        ]
      },

      {
        question: "What would you most likely borrow money for?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Business",
          "Education",
          "Home improvement",
          "Medical expenses",
          "Emergency expenses",
          "Buying a vehicle",
          "Agriculture",
          "Personal expenses",
          "Investment",
          "I would not borrow",
          "Other"
        ]
      },

      {
        question: "What is the biggest concern you have when taking a loan?",
        questionType: "RADIO",
        required: true,
        options: [
          "High interest rates",
          "Hidden charges",
          "Repayment period",
          "Loan eligibility",
          "Collateral requirements",
          "Debt burden",
          "Poor customer service",
          "I do not have concerns",
          "Other"
        ]
      },

      {
        question: "How often do you use mobile banking?",
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
        question: "What would make you more satisfied with your bank or financial institution?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Lower fees",
          "Better mobile apps",
          "Better customer service",
          "Faster transactions",
          "Better loan products",
          "Higher savings interest",
          "More branches or ATMs",
          "Better security",
          "More financial education",
          "Other"
        ]
      },

      {
        question: "What is the biggest challenge you face when using banking or financial services in Kenya?",
        questionType: "TEXTAREA",
        required: true,
        placeholder: "Describe your biggest challenge..."
      },

      {
        question: "What financial service would you like banks or other financial institutions in Kenya to improve or introduce?",
        questionType: "TEXTAREA",
        required: true,
        placeholder: "Share your suggestion..."
      }
    ];

    await prisma.$transaction(async (tx) => {
      const survey = await tx.survey.create({
        data: {
          title,
          description:
            "This survey explores banking and financial service experiences among consumers in Kenya. It examines bank usage, digital banking, savings, loans, SACCOs, transaction fees, customer service, financial preferences, and the challenges people face when accessing financial services.",
          reward: 45,
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
    console.error("❌ Error creating banking survey:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createBankingSurvey();

