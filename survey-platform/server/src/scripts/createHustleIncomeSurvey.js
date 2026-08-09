
import prisma from "../config/prisma.js";

async function createHustleIncomeSurvey() {
  try {
    const title = "Hustle & Business Income Sources in Kenya";

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
        question: "Which county do you currently live or operate your business in?",
        questionType: "TEXT",
        required: true,
        placeholder: "Enter your county"
      },

      {
        question: "Which of the following best describes your current income situation?",
        questionType: "RADIO",
        required: true,
        options: [
          "Formal employment",
          "Self-employed",
          "Informal business/hustle",
          "Both employed and self-employed",
          "Student with an income source",
          "Currently looking for work",
          "Other"
        ]
      },

      {
        question: "Which income-generating activities do you currently participate in?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Retail shop/kiosk",
          "Food business",
          "Agriculture/farming",
          "Livestock or poultry",
          "Boda boda/motorcycle business",
          "Online selling",
          "Freelancing",
          "Digital jobs",
          "Transport services",
          "Construction/manual work",
          "Beauty/barber services",
          "Clothing/fashion",
          "Mobile money agency",
          "Professional services",
          "Other"
        ]
      },

      {
        question: "How long have you been earning income from your main hustle or business?",
        questionType: "RADIO",
        required: true,
        options: [
          "Less than 6 months",
          "6 months - 1 year",
          "1-2 years",
          "3-5 years",
          "More than 5 years"
        ]
      },

      {
        question: "How many different sources of income do you currently have?",
        questionType: "RADIO",
        required: true,
        options: [
          "One",
          "Two",
          "Three",
          "Four",
          "Five or more"
        ]
      },

      {
        question: "Which source currently provides you with the largest share of your income?",
        questionType: "SELECT",
        required: true,
        options: [
          "Employment salary",
          "Retail/business",
          "Agriculture",
          "Online work",
          "Freelancing",
          "Transport",
          "Food business",
          "Professional services",
          "Casual work",
          "Other"
        ]
      },

      {
        question: "How often do you receive income from your main hustle or business?",
        questionType: "RADIO",
        required: true,
        options: [
          "Several times a day",
          "Daily",
          "Several times a week",
          "Weekly",
          "Monthly",
          "Irregularly"
        ]
      },

      {
        question: "How do your customers usually pay you?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "M-Pesa",
          "Cash",
          "Airtel Money",
          "Bank transfer",
          "Card payment",
          "Online payment platforms",
          "Credit",
          "Other"
        ]
      },

      {
        question: "How important is M-Pesa to your business or income-generating activities?",
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
        question: "Which methods do you use to find or attract customers?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Word of mouth",
          "WhatsApp",
          "Facebook",
          "TikTok",
          "Instagram",
          "Google/Search",
          "Physical location/signage",
          "Referrals",
          "Online marketplaces",
          "Advertising",
          "Other"
        ]
      },

      {
        question: "Do you use social media to promote your business or hustle?",
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
        question: "Which challenges have the biggest impact on your income?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "High cost of goods or supplies",
          "Low customer demand",
          "Competition",
          "High rent",
          "High transport costs",
          "Taxes and fees",
          "Limited access to capital",
          "High cost of internet/data",
          "Unreliable electricity",
          "Economic conditions",
          "Late customer payments",
          "Other"
        ]
      },

      {
        question: "Have you ever borrowed money to start or grow your hustle or business?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, from a bank",
          "Yes, from an MFI",
          "Yes, from a SACCO",
          "Yes, through a digital loan",
          "Yes, from family or friends",
          "No"
        ]
      },

      {
        question: "What is the biggest reason you would seek additional business funding?",
        questionType: "RADIO",
        required: true,
        options: [
          "Buying stock",
          "Expanding the business",
          "Buying equipment",
          "Rent or premises",
          "Marketing",
          "Hiring workers",
          "Managing cash flow",
          "Starting a new business",
          "I would not seek funding",
          "Other"
        ]
      },

      {
        question: "How do you normally keep track of your business income and expenses?",
        questionType: "RADIO",
        required: true,
        options: [
          "Notebook/manual records",
          "Excel or spreadsheets",
          "Mobile app",
          "Accounting software",
          "M-Pesa statements",
          "I do not keep records",
          "Other"
        ]
      },

      {
        question: "Which digital tools do you currently use for your hustle or business?",
        questionType: "CHECKBOX",
        required: false,
        options: [
          "M-Pesa Business/Till",
          "WhatsApp Business",
          "Social media",
          "Online marketplaces",
          "Mobile banking",
          "Accounting apps",
          "Inventory apps",
          "Online advertising",
          "Google Business Profile",
          "None",
          "Other"
        ]
      },

      {
        question: "Would you be interested in an app that helps you track income, expenses, customers, stock, and profits?",
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
        question: "What would help you increase your income the most?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "More customers",
          "Access to affordable capital",
          "Lower operating costs",
          "Better marketing",
          "Business training",
          "Better technology",
          "Reliable suppliers",
          "Better market information",
          "New business opportunities",
          "Other"
        ]
      },

      {
        question: "What is the biggest challenge you face when trying to increase your income?",
        questionType: "TEXTAREA",
        required: true,
        placeholder: "Tell us about your biggest challenge..."
      },

      {
        question: "What kind of business or income opportunity would you like to pursue in the future?",
        questionType: "TEXTAREA",
        required: true,
        placeholder: "Tell us about the opportunity you would like to pursue..."
      }
    ];

    await prisma.$transaction(async (tx) => {
      const survey = await tx.survey.create({
        data: {
          title,
          description:
            "This survey explores the different ways Kenyans earn income through businesses, informal hustles, employment, freelancing, agriculture, digital work, and other income-generating activities. We want to understand how people manage their income, find customers, use digital tools, access financing, and overcome challenges when building their livelihoods.",
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
    console.error("❌ Error creating Hustle & Business Income survey:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createHustleIncomeSurvey();

