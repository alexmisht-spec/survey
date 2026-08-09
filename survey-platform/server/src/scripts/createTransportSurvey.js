
import prisma from "../config/prisma.js";

async function createTransportSurvey() {
  try {
    const title = "Transport, Matatu & Boda Boda Experience in Kenya";

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
        question: "What is your main method of transport?",
        questionType: "RADIO",
        required: true,
        options: [
          "Matatu",
          "Boda boda",
          "Private car",
          "Taxi",
          "Ride-hailing service",
          "Walking",
          "Bicycle",
          "Motorcycle",
          "Public bus",
          "Other"
        ]
      },

      {
        question: "How often do you use public transport?",
        questionType: "RADIO",
        required: true,
        options: [
          "Every day",
          "Several times a week",
          "Weekly",
          "Several times a month",
          "Rarely",
          "Never"
        ]
      },

      {
        question: "Which forms of public transport do you regularly use?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Matatu",
          "Bus",
          "Boda boda",
          "Tuk-tuk",
          "Taxi",
          "Ride-hailing",
          "Train",
          "Other"
        ]
      },

      {
        question: "How often do you use boda boda services?",
        questionType: "RADIO",
        required: true,
        options: [
          "Daily",
          "Several times a week",
          "Weekly",
          "Several times a month",
          "Rarely",
          "Never"
        ]
      },

      {
        question: "How often do you use ride-hailing services?",
        questionType: "RADIO",
        required: true,
        options: [
          "Several times a week",
          "Weekly",
          "Several times a month",
          "Once a month",
          "Rarely",
          "Never"
        ]
      },

      {
        question: "Which ride-hailing services have you used?",
        questionType: "CHECKBOX",
        required: false,
        options: [
          "Uber",
          "Bolt",
          "Little Cab",
          "Faras",
          "Other",
          "None"
        ]
      },

      {
        question: "What is the most important factor when choosing transport?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Price",
          "Safety",
          "Speed",
          "Convenience",
          "Availability",
          "Comfort",
          "Reliability",
          "Driver behaviour",
          "Cleanliness",
          "Other"
        ]
      },

      {
        question: "How much do you typically spend on transport in a week?",
        questionType: "RADIO",
        required: true,
        options: [
          "Less than KES 500",
          "KES 500 - 999",
          "KES 1,000 - 1,999",
          "KES 2,000 - 4,999",
          "KES 5,000 or more",
          "Not sure"
        ]
      },

      {
        question: "How do you usually pay for transport?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Cash",
          "M-Pesa",
          "Card",
          "Ride-hailing app",
          "Other digital payment"
        ]
      },

      {
        question: "How satisfied are you with public transport services in your area?",
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
        question: "What problems do you experience most often when using public transport?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "High fares",
          "Traffic delays",
          "Overcrowding",
          "Poor vehicle condition",
          "Unsafe driving",
          "Unreliable schedules",
          "Poor customer service",
          "Long waiting times",
          "Poor road conditions",
          "Other"
        ]
      },

      {
        question: "How concerned are you about safety when using public transport?",
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
        question: "Have you ever avoided a transport service because you considered it unsafe?",
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
        question: "What improvements would most improve public transport in Kenya?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Lower fares",
          "Better roads",
          "Better vehicle maintenance",
          "Improved driver behaviour",
          "Better safety measures",
          "More reliable schedules",
          "Less overcrowding",
          "Better payment systems",
          "Better customer service",
          "Other"
        ]
      },

      {
        question: "How often does traffic affect your ability to arrive at your destination on time?",
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
        question: "Would you use a transport app that compares fares and travel times between different transport options?",
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
        question: "What transport information would be most useful to you?",
        questionType: "CHECKBOX",
        required: true,
        options: [
          "Live traffic updates",
          "Transport fares",
          "Route information",
          "Vehicle availability",
          "Estimated travel time",
          "Safety information",
          "Public transport schedules",
          "Other"
        ]
      },

      {
        question: "What is the biggest transport challenge you face in Kenya?",
        questionType: "TEXTAREA",
        required: true,
        placeholder: "Describe your biggest transport challenge..."
      },

      {
        question: "What should transport providers or authorities improve?",
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
            "This survey explores transportation experiences in Kenya, including matatus, buses, boda bodas, taxis, ride-hailing services, and private transport. It examines travel habits, transport costs, safety, reliability, customer experience, traffic, payment methods, and improvements passengers would like to see.",
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
    console.error("❌ Error creating transport survey:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createTransportSurvey();

