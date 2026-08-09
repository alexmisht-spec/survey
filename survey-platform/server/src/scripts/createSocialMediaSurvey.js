
import prisma from "../config/prisma.js";

async function createSocialMediaSurvey() {
  try {
    const title = "Social Media Usage & Digital Habits in Kenya";

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
        question: "Which social media platforms do you currently use?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "WhatsApp",
          "Facebook",
          "Instagram",
          "TikTok",
          "YouTube",
          "X (Twitter)",
          "LinkedIn",
          "Telegram",
          "Snapchat",
          "Other"
        ]
      },

      {
        question: "Which social media platform do you use most often?",
        questionType: "RADIO",
        required: true,
        options: [
          "WhatsApp",
          "Facebook",
          "Instagram",
          "TikTok",
          "YouTube",
          "X (Twitter)",
          "LinkedIn",
          "Telegram",
          "Other"
        ]
      },

      {
        question: "How much time do you typically spend on social media each day?",
        questionType: "RADIO",
        required: true,
        options: [
          "Less than 30 minutes",
          "30 minutes - 1 hour",
          "1-2 hours",
          "2-4 hours",
          "4-6 hours",
          "More than 6 hours"
        ]
      },

      {
        question: "What do you mainly use social media for?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Keeping in touch with friends and family",
          "Entertainment",
          "News",
          "Business",
          "Finding jobs",
          "Education",
          "Shopping",
          "Networking",
          "Following influencers",
          "Promoting products or services",
          "Other"
        ]
      },

      {
        question: "How often do you watch short-form videos such as TikTok, Instagram Reels, or YouTube Shorts?",
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
        question: "Which type of content do you enjoy most on social media?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Comedy",
          "News and current affairs",
          "Music",
          "Sports",
          "Business",
          "Technology",
          "Fashion and beauty",
          "Food",
          "Education",
          "Politics",
          "Lifestyle",
          "Other"
        ]
      },

      {
        question: "Do you use social media to discover products or services?",
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
        question: "Have you ever purchased something after seeing it advertised or recommended on social media?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, many times",
          "Yes, a few times",
          "Once",
          "No, but I have considered it",
          "No"
        ]
      },

      {
        question: "Which social media platforms do you trust most when researching a product or service?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Facebook",
          "Instagram",
          "TikTok",
          "YouTube",
          "X (Twitter)",
          "LinkedIn",
          "WhatsApp",
          "Google",
          "None",
          "Other"
        ]
      },

      {
        question: "How often do you communicate with businesses through WhatsApp or social media?",
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
        question: "Do you use social media to earn money or promote a business?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, as my main source of income",
          "Yes, as a secondary income source",
          "Yes, occasionally",
          "I am planning to",
          "No"
        ]
      },

      {
        question: "Which activities do you use social media for to generate income?",
        questionType: "CHECKBOX",
        required: false,
        options: [
          "Selling products",
          "Advertising services",
          "Content creation",
          "Affiliate marketing",
          "Freelancing",
          "Influencer marketing",
          "Online teaching",
          "Finding clients",
          "Other"
        ]
      },

      {
        question: "How often do you get news or information from social media?",
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
        question: "How often do you verify information before sharing it on social media?",
        questionType: "RADIO",
        required: true,
        options: [
          "Always",
          "Usually",
          "Sometimes",
          "Rarely",
          "Never"
        ]
      },

      {
        question: "What concerns you most about using social media?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Privacy",
          "Scams and fraud",
          "Fake news",
          "Cyberbullying",
          "Addiction or excessive use",
          "Data usage costs",
          "Online harassment",
          "Unwanted advertising",
          "Account security",
          "I have no major concerns",
          "Other"
        ]
      },

      {
        question: "How concerned are you about your personal information being collected by social media platforms?",
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
        question: "Have you ever reduced your social media usage because it was taking too much of your time?",
        questionType: "RADIO",
        required: true,
        options: [
          "Yes, and I still use it less",
          "Yes, but I returned to my normal usage",
          "I have considered doing so",
          "No"
        ]
      },

      {
        question: "What would make your social media experience better?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Less advertising",
          "Better privacy controls",
          "Less misinformation",
          "Better content recommendations",
          "Lower data costs",
          "Better account security",
          "Less harmful content",
          "Better customer support",
          "Other"
        ]
      },

      {
        question: "How has social media affected your daily life?",
        questionType: "TEXTAREA",
        required: true,
        placeholder: "Tell us how social media has affected your work, business, relationships, entertainment, or daily activities..."
      }
    ];

    await prisma.$transaction(async (tx) => {
      const survey = await tx.survey.create({
        data: {
          title,
          description:
            "This survey explores social media usage and digital habits among people in Kenya. It looks at the platforms people use, time spent online, entertainment, news, business, shopping, content creation, privacy concerns, digital safety, and the overall impact of social media on everyday life.",
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
    console.error("❌ Error creating social media survey:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createSocialMediaSurvey();

