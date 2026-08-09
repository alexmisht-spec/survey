
import prisma from "../config/prisma.js";

async function createFoodDeliverySurvey() {
  try {
    const title = "Food Delivery & Restaurant Services in Kenya";

    // Prevent duplicate survey
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
        question: "How often do you buy food from restaurants or food outlets?",
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
        question: "How often do you order food for delivery?",
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
        question: "Which food delivery services have you used in Kenya?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Glovo",
          "Uber Eats",
          "Bolt Food",
          "Restaurant's own delivery service",
          "Phone/WhatsApp ordering",
          "Other",
          "None"
        ]
      },

      {
        question: "Which method do you usually use when ordering food?",
        questionType: "RADIO",
        required: true,
        options: [
          "Food delivery app",
          "Restaurant website",
          "WhatsApp",
          "Phone call",
          "Social media",
          "I usually eat at the restaurant",
          "Other"
        ]
      },

      {
        question: "What types of food do you order most frequently?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Fast food",
          "Kenyan traditional food",
          "Pizza",
          "Chicken",
          "Burgers",
          "Indian food",
          "Chinese food",
          "African cuisine",
          "Bakery products",
          "Healthy/fitness meals",
          "Other"
        ]
      },

      {
        question: "How much do you typically spend on a food delivery order?",
        questionType: "RADIO",
        required: true,
        options: [
          "Less than KES 300",
          "KES 300 - 499",
          "KES 500 - 999",
          "KES 1,000 - 1,999",
          "KES 2,000 - 4,999",
          "KES 5,000 or more"
        ]
      },

      {
        question: "What factors are most important when choosing a restaurant?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Food quality",
          "Price",
          "Location",
          "Menu variety",
          "Customer reviews",
          "Restaurant cleanliness",
          "Customer service",
          "Delivery availability",
          "Promotions",
          "Brand reputation",
          "Other"
        ]
      },

      {
        question: "What factors are most important when choosing a food delivery service?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Delivery fee",
          "Delivery speed",
          "Food quality",
          "Number of restaurants available",
          "App usability",
          "Payment options",
          "Promotions and discounts",
          "Order tracking",
          "Customer support",
          "Other"
        ]
      },

      {
        question: "How satisfied are you with the food delivery services you have used?",
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
        question: "How often has your food delivery arrived later than expected?",
        questionType: "RADIO",
        required: true,
        options: [
          "Very often",
          "Often",
          "Sometimes",
          "Rarely",
          "Never"
        ]
      },

      {
        question: "Which payment method do you normally use for restaurant or food delivery orders?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "M-Pesa",
          "Cash",
          "Debit/ATM card",
          "Credit card",
          "Mobile banking",
          "Other digital payment"
        ]
      },

      {
        question: "How important are discounts and promotions when deciding where to order food?",
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
        question: "What types of food offers would encourage you to order more frequently?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Percentage discounts",
          "Free delivery",
          "Buy one get one free",
          "Meal bundles",
          "Loyalty rewards",
          "Cashback",
          "Free drinks or sides",
          "Other"
        ]
      },

      {
        question: "Have you ever stopped using a restaurant or food delivery service because of a bad experience?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, several times",
          "Yes, once",
          "I considered it but continued using it",
          "No"
        ]
      },

      {
        question: "What problems have you experienced when ordering food?",
        questionType: "CHECKBOX",
        required: false,
        options: [
          "Late delivery",
          "Missing items",
          "Wrong order",
          "Poor food quality",
          "Food arrived cold",
          "High delivery fees",
          "Payment problems",
          "Poor customer service",
          "Restaurant cancelled the order",
          "No major problems",
          "Other"
        ]
      },

      {
        question: "Would you order food more often if delivery fees were lower?",
        questionType: "RADIO",
        required: true,
        options: [
          "Definitely",
          "Probably",
          "Not sure",
          "Probably not",
          "Definitely not"
        ]
      },

      {
        question: "What would make you more likely to use food delivery services?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Lower prices",
          "Lower delivery fees",
          "Faster delivery",
          "More restaurants",
          "Better food quality",
          "More payment options",
          "Better customer service",
          "More promotions",
          "Reliable delivery times",
          "Other"
        ]
      },

      {
        question: "What is the biggest problem you face when ordering food from restaurants or delivery services in Kenya?",
        questionType: "TEXTAREA",
        required: true,
        placeholder: "Describe your biggest challenge..."
      },

      {
        question: "What should restaurants and food delivery services in Kenya improve?",
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
            "This survey explores restaurant and food delivery habits in Kenya. It looks at how consumers choose restaurants, order food, use delivery services, make payments, respond to promotions, and evaluate food quality, delivery speed, pricing, and customer service.",
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
    console.error("❌ Error creating food delivery survey:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createFoodDeliverySurvey();

