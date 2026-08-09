
import prisma from "../config/prisma.js";

async function createSupermarketShoppingSurvey() {
  try {
    const title = "Supermarket & Grocery Shopping Habits in Kenya";

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
        question: "How often do you shop for groceries?",
        questionType: "RADIO",
        required: true,
        options: [
          "Several times a week",
          "Once a week",
          "Every two weeks",
          "Once a month",
          "Less than once a month"
        ]
      },

      {
        question: "Where do you most often buy your groceries?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Supermarket",
          "Local shop or kiosk",
          "Open-air market",
          "Wholesale shop",
          "Online grocery store",
          "Directly from farmers",
          "Other"
        ]
      },

      {
        question: "Which supermarket do you shop at most often?",
        questionType: "SELECT",
        required: true,
        options: [
          "Naivas",
          "Quickmart",
          "Carrefour",
          "Chandarana Foodplus",
          "Cleanshelf",
          "Uchumi",
          "Local independent supermarket",
          "Other"
        ]
      },

      {
        question: "What are the most important factors when choosing where to buy groceries?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Affordable prices",
          "Product quality",
          "Location",
          "Product variety",
          "Promotions and discounts",
          "Customer service",
          "Cleanliness",
          "Parking availability",
          "Opening hours",
          "Online ordering",
          "Other"
        ]
      },

      {
        question: "How much do you typically spend on groceries in a month?",
        questionType: "RADIO",
        required: true,
        options: [
          "Less than KES 2,000",
          "KES 2,000 - 4,999",
          "KES 5,000 - 9,999",
          "KES 10,000 - 19,999",
          "KES 20,000 - 39,999",
          "KES 40,000 or more",
          "Prefer not to say"
        ]
      },

      {
        question: "Which grocery categories do you purchase most frequently?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Fresh vegetables",
          "Fruits",
          "Milk and dairy products",
          "Meat and poultry",
          "Fish",
          "Bread and bakery products",
          "Cereals and grains",
          "Cooking oil",
          "Beverages",
          "Cleaning products",
          "Personal care products",
          "Other"
        ]
      },

      {
        question: "How important are discounts and promotions when deciding where to shop?",
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
        question: "Which types of promotions do you find most attractive?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Price discounts",
          "Buy one get one free",
          "Loyalty points",
          "Coupons",
          "Bundle offers",
          "Cashback",
          "Free products",
          "Member-only offers",
          "Other"
        ]
      },

      {
        question: "Do you compare prices between different shops before buying groceries?",
        questionType: "RADIO",
        required: true,
        options: [
          "Always",
          "Often",
          "Sometimes",
          "Rarely",
          "Never"
        ]
      },

      {
        question: "How do you usually pay when shopping for groceries?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "M-Pesa",
          "Cash",
          "Debit or ATM card",
          "Credit card",
          "Bank payment",
          "Other digital payment"
        ]
      },

      {
        question: "How important is M-Pesa payment availability when choosing a shop?",
        questionType: "RADIO",
        required: true,
        options: [
          "Very important",
          "Important",
          "Somewhat important",
          "Not very important",
          "Not important at all"
        ]
      },

      {
        question: "Have rising prices changed the way you shop for groceries?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, significantly",
          "Yes, somewhat",
          "Only slightly",
          "No",
          "Not sure"
        ]
      },

      {
        question: "What changes have you made because of rising grocery prices?",
        questionType: "CHECKBOX",
        required: false,
        options: [
          "Buying cheaper brands",
          "Buying smaller quantities",
          "Shopping at different stores",
          "Buying in bulk",
          "Reducing non-essential products",
          "Comparing prices more often",
          "Buying from open-air markets",
          "Buying directly from farmers",
          "No changes",
          "Other"
        ]
      },

      {
        question: "How satisfied are you with the variety of products available at your usual supermarket or grocery store?",
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
        question: "How important is product freshness when buying groceries?",
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
        question: "Have you ever ordered groceries online?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, regularly",
          "Yes, occasionally",
          "I have tried it once",
          "No, but I would like to",
          "No, and I am not interested"
        ]
      },

      {
        question: "What would encourage you to buy groceries online more often?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Lower delivery fees",
          "Lower product prices",
          "Faster delivery",
          "More products available",
          "Better product quality",
          "Reliable delivery",
          "Easy payment options",
          "Discounts and promotions",
          "I prefer shopping physically",
          "Other"
        ]
      },

      {
        question: "What is the biggest problem you experience when buying groceries in Kenya?",
        questionType: "TEXTAREA",
        required: true,
        placeholder: "Tell us about your biggest challenge..."
      },

      {
        question: "What could supermarkets and grocery stores do to improve your shopping experience?",
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
            "This survey explores grocery shopping habits among consumers in Kenya, including where people shop, supermarket preferences, spending patterns, product choices, payment methods, price sensitivity, promotions, online grocery shopping, and customer experience.",
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
    console.error("❌ Error creating supermarket survey:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createSupermarketShoppingSurvey();

