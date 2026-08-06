import prisma from "../config/prisma.js";

async function createWelcomeSurvey() {
  try {
    // Prevent duplicates
    const exists = await prisma.survey.findFirst({
      where: {
        title: "Welcome to SurveyPool",
      },
    });

    if (exists) {
      console.log("⚠️ Welcome Survey already exists.");
      return;
    }

    await prisma.$transaction(async (tx) => {
      const survey = await tx.survey.create({
        data: {
          title: "Welcome to SurveyPool",
          description:
            "Welcome to SurveyPool! This short survey helps us understand your interests, experience, devices, and preferences so we can match you with relevant paid opportunities including surveys, app testing, website testing, product reviews, market research and more.",
          reward: 100,
          timeEstimate: 10,
          status: "ACTIVE",
        },
      });

      const questions = [
        {
          question: "How did you hear about SurveyPool?",
          questionType: "RADIO",
          required: true,
          options: [
            "Facebook",
            "Instagram",
            "TikTok",
            "WhatsApp",
            "Google Search",
            "Friend",
            "YouTube",
            "Other",
          ],
        },
        {
          question: "Which age group do you belong to?",
          questionType: "SELECT",
          required: true,
          options: ["18-24", "25-34", "35-44", "45-54", "55+"],
        },
        {
          question: "What is your gender?",
          questionType: "RADIO",
          required: true,
          options: ["Male", "Female", "Prefer not to say"],
        },
        {
          question: "Which county do you currently live in?",
          questionType: "TEXT",
          required: true,
          placeholder: "Enter your county",
        },
        {
          question: "Which devices do you regularly use?",
          questionType: "CHECKBOX",
          required: true,
          options: [
            "Android Phone",
            "iPhone",
            "Windows PC",
            "MacBook",
            "Tablet",
          ],
        },
        {
          question: "Which internet connection do you mostly use?",
          questionType: "RADIO",
          required: true,
          options: ["Mobile Data", "Wi-Fi", "Both"],
        },
        {
          question: "How many hours do you spend online each day?",
          questionType: "RADIO",
          required: true,
          options: [
            "Less than 1 hour",
            "1-3 hours",
            "4-6 hours",
            "7-10 hours",
            "More than 10 hours",
          ],
        },
        {
          question: "Which paid tasks interest you?",
          questionType: "CHECKBOX",
          required: true,
          options: [
            "Online Surveys",
            "App Testing",
            "Website Testing",
            "Product Reviews",
            "Market Research",
            "Data Collection",
            "Mystery Shopping",
            "Watching Videos",
          ],
        },
        {
          question: "Have you ever earned money online before?",
          questionType: "RADIO",
          required: true,
          options: ["Yes", "No"],
        },
        {
          question: "If yes, which platforms have you used?",
          questionType: "CHECKBOX",
          required: false,
          options: [
            "Toloka",
            "Clickworker",
            "Remotasks",
            "UserTesting",
            "Swagbucks",
            "Fiverr",
            "Upwork",
            "Other",
          ],
        },
        {
          question: "Have you ever tested a mobile app?",
          questionType: "RADIO",
          required: true,
          options: ["Yes", "No"],
        },
        {
          question: "Which phone brand do you currently use?",
          questionType: "SELECT",
          required: true,
          options: [
            "Samsung",
            "Tecno",
            "Infinix",
            "Xiaomi",
            "Oppo",
            "Vivo",
            "Huawei",
            "Google Pixel",
            "iPhone",
            "Other",
          ],
        },
        {
          question: "Which operating system does your phone use?",
          questionType: "RADIO",
          required: true,
          options: ["Android", "iOS"],
        },
        {
          question: "Which languages can you comfortably read?",
          questionType: "CHECKBOX",
          required: true,
          options: [
            "English",
            "Kiswahili",
            "French",
            "Arabic",
            "Other",
          ],
        },
        {
          question: "How often do you shop online?",
          questionType: "RADIO",
          required: true,
          options: [
            "Never",
            "Rarely",
            "Monthly",
            "Weekly",
            "Several times a week",
          ],
        },
        {
          question: "Which payment methods have you used?",
          questionType: "CHECKBOX",
          required: true,
          options: [
            "M-Pesa",
            "Airtel Money",
            "Bank Transfer",
            "PayPal",
            "Visa/Mastercard",
          ],
        },
        {
          question: "Why did you join SurveyPool?",
          questionType: "TEXTAREA",
          required: true,
          placeholder: "Tell us why you joined...",
        },
        {
          question: "Which type of tasks would you like to receive first?",
          questionType: "RADIO",
          required: true,
          options: [
            "Surveys",
            "App Testing",
            "Website Testing",
            "Product Reviews",
            "Any Available Task",
          ],
        },
        {
          question: "What is your highest level of education?",
          questionType: "SELECT",
          required: true,
          options: [
            "Primary",
            "Secondary",
            "Certificate",
            "Diploma",
            "Bachelor's Degree",
            "Master's Degree",
            "Doctorate",
          ],
        },
        {
          question: "What is your employment status?",
          questionType: "RADIO",
          required: true,
          options: [
            "Student",
            "Employed",
            "Self-employed",
            "Unemployed",
            "Retired",
          ],
        },
        {
          question: "Which social media platforms do you use regularly?",
          questionType: "CHECKBOX",
          required: true,
          options: [
            "Facebook",
            "Instagram",
            "TikTok",
            "X",
            "LinkedIn",
            "Snapchat",
            "YouTube",
          ],
        },
        {
          question:
            "I understand SurveyPool offers paid surveys, app testing, website testing, product reviews and market research. I agree to provide honest responses.",
          questionType: "CHECKBOX",
          required: true,
          options: ["I Agree"],
        },
      ];

      await tx.surveyQuestion.createMany({
        data: questions.map((q, index) => ({
          surveyId: survey.id,
          question: q.question,
          questionType: q.questionType,
          placeholder: q.placeholder || null,
          required: q.required,
          options: q.options || null,
          order: index + 1,
        })),
      });

      console.log(
        `✅ Welcome Survey created with ${questions.length} questions.`
      );
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createWelcomeSurvey();