
import prisma from "../config/prisma.js";

async function createOnlineShoppingSurvey() {
  try {
    const title = "Online Shopping & E-Commerce Experience in Kenya";

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
        question: "How often do you shop online?",
        questionType: "RADIO",
        required: true,
        options: [
          "Several times a month",
          "Once a month",
          "Every few months",
          "A few times a year",
          "Rarely",
          "Never"
        ]
      },

      {
        question: "Which online shopping platforms have you used?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Jumia",
          "Kilimall",
          "Amazon",
          "Jiji",
          "Instagram shops",
          "Facebook Marketplace",
          "TikTok shops",
          "Individual business websites",
          "WhatsApp sellers",
          "Other",
          "None"
        ]
      },

      {
        question: "What products do you most commonly buy online?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Clothing and shoes",
          "Phones and electronics",
          "Beauty products",
          "Household items",
          "Groceries",
          "Food",
          "Furniture",
          "Books",
          "Accessories",
          "Tickets or services",
          "Other"
        ]
      },

      {
        question: "What is the main reason you shop online?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Convenience",
          "Lower prices",
          "More product choices",
          "Easy price comparison",
          "Products unavailable locally",
          "Promotions and discounts",
          "Home delivery",
          "Saving time",
          "Other"
        ]
      },

      {
        question: "How much do you typically spend on an online purchase?",
        questionType: "RADIO",
        required: true,
        options: [
          "Less than KES 500",
          "KES 500 - 999",
          "KES 1,000 - 2,499",
          "KES 2,500 - 4,999",
          "KES 5,000 - 9,999",
          "KES 10,000 or more"
        ]
      },

      {
        question: "What payment method do you usually use for online purchases?",
        questionType: "RADIO",
        required: true,
        options: [
          "M-Pesa",
          "Debit/ATM card",
          "Credit card",
          "Bank transfer",
          "Cash on delivery",
          "Other digital payment"
        ]
      },

      {
        question: "How important is cash-on-delivery when choosing an online seller?",
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
        question: "What factors influence your decision to buy from an online seller?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Price",
          "Product reviews",
          "Seller reputation",
          "Product quality",
          "Delivery cost",
          "Delivery speed",
          "Return policy",
          "Payment options",
          "Brand reputation",
          "Promotions",
          "Other"
        ]
      },

      {
        question: "How important are customer reviews when deciding whether to buy a product online?",
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
        question: "How often have you received an online order later than expected?",
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
        question: "What problems have you experienced when shopping online?",
        questionType: "CHECKBOX",
        required: false,
        options: [
          "Late delivery",
          "Product different from description",
          "Poor product quality",
          "Wrong item delivered",
          "Damaged item",
          "Hidden charges",
          "Payment problems",
          "Difficulty getting a refund",
          "Seller stopped responding",
          "No major problems",
          "Other"
        ]
      },

      {
        question: "Have you ever returned an item bought online?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, more than once",
          "Yes, once",
          "I wanted to but could not",
          "No"
        ]
      },

      {
        question: "How confident are you when making payments to online sellers?",
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
        question: "Have you ever avoided buying something online because you were concerned about fraud or scams?",
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
        question: "Where do you usually discover products you later buy online?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Google",
          "Facebook",
          "Instagram",
          "TikTok",
          "WhatsApp",
          "YouTube",
          "Online marketplaces",
          "Friends or family",
          "Advertisements",
          "Other"
        ]
      },

      {
        question: "How important are discounts and promotional offers when shopping online?",
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
        question: "What would make you shop online more frequently?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Lower prices",
          "Free delivery",
          "Faster delivery",
          "Better product quality",
          "Easier returns",
          "More trusted sellers",
          "Better payment security",
          "More product choices",
          "Better customer support",
          "Other"
        ]
      },

      {
        question: "What is the biggest challenge you face when shopping online in Kenya?",
        questionType: "TEXTAREA",
        required: true,
        placeholder: "Describe your biggest challenge..."
      },

      {
        question: "What should Kenyan online shopping platforms and sellers improve?",
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
            "This survey explores online shopping habits and e-commerce experiences among consumers in Kenya. It examines shopping frequency, preferred platforms, products purchased, payment methods, delivery experiences, trust, fraud concerns, customer reviews, returns, promotions, and factors that influence online purchasing decisions.",
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
    console.error("❌ Error creating online shopping survey:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createOnlineShoppingSurvey();

