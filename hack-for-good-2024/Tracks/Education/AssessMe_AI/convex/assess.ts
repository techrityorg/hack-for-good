import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import * as fs from "node:fs";
import {internal} from "./_generated/api"
import { paginationOptsValidator } from "convex/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const diflevel = (value: string) => {
  const intValue = parseInt(value, 10);
  switch (intValue) {
    case 1:
      return "Beginner";
    case 2:
      return "Intermediate";
    case 3:
      return "Expert/Hard";
    default:
      return "Beginner";
  }
};

const firstMessageContext =
  "You are an interviewer interviewing a candidate for the role of a *insert_job_here* at your company *insert_company_here*. The candidate's name is *insert_name_here*. Speak only from the perspective of the interviewer. Do not include the time of day. Welcome the candidate to the interview and ask them the first question of: ";
const subsequentMessageContext =
  "You are an interviewer interviewing a candidate for the role of a *insert_job_here* at your company *insert_company_here*. The candidate's name is *insert_name_here*. Make sure to give your a concise evaluation based on their previous answer.Then make sure to ask them the next question of: ";
const lastMessageContext =
  "You are an interviewer interviewing a candidate for the role of a *insert_job_here* at your company *insert_company_here*. The candidate's name is *insert_name_here*. Make sure to give your a concise evaluation based on their previous answer .Then make sure to thank them for joining you for the interview.";

const generateAnalytics = `
Your task is to provide a detailed performance assessment for a candidate who recently completed an interview. The candidate was asked the following question by the interviewer: "*insert_question_here*". The candidate's response to this question is: "*insert_answer_here*".

For context, the candidate is applying for the position of *insert_title_here* at *insert_company_here*. The positions they are applying for fall under the category of *insert_type_here*. The job requirements are as follows: "*insert_reqs_here*".

Evaluate the candidate's performance in six specific areas, each with a maximum score. Provide your assessment in the form of a JSON object under the "interviewFeedbackAnalyticsRadar" section. The six parameters to be assessed are:
1. Communication Skills
2. Technical Proficiency
3. Adaptability
4. Team Collaboration
5. Leadership Potential
6. Cultural Fit

For each parameter, assign points based on your assessment of the candidate's performance, considering the points they received out of the maximum points possible.

The response should follow this JSON format:

{
  "interviewFeedbackAnalyticsRadar": [
    { "parameter": "Communication Skills", "points": pointsNumber_1, "maxPoints": maxPointsNumber_1 },
    { "parameter": "Technical Proficiency", "points": pointsNumber_2, "maxPoints": maxPointsNumber_2 },
    { "parameter": "Adaptability", "points": pointsNumber_3, "maxPoints": maxPointsNumber_3 },
    { "parameter": "Team Collaboration", "points": pointsNumber_4, "maxPoints": maxPointsNumber_4 },
    { "parameter": "Leadership Potential", "points": pointsNumber_5, "maxPoints": maxPointsNumber_5 },
    { "parameter": "Cultural Fit", "points": pointsNumber_6, "maxPoints": maxPointsNumber_6 }
  ]
}

Replace maxPointsNumber_* with the maximum points you allocate for each parameter and pointsNumber_* with the points the candidate deserves based on your interview assessment.

Example:

{
  "interviewFeedbackAnalyticsRadar": [
    { "parameter": "Communication Skills", "points": 110, "maxPoints": 150 },
    { "parameter": "Technical Proficiency", "points": 130, "maxPoints": 150 },
    { "parameter": "Adaptability", "points": 130, "maxPoints": 150 },
    { "parameter": "Team Collaboration", "points": 100, "maxPoints": 150 },
    { "parameter": "Leadership Potential", "points": 90, "maxPoints": 150 },
    { "parameter": "Cultural Fit", "points": 85, "maxPoints": 150 }
  ]
}


`;

const feedbackContext = `
Your role is to give feedback to a candidate who just did an interview. The question they were asked by the interviewer is "*insert_question_here*". 
  The candidate's answer to this question is "*insert_answer_here*". 
  Don't mention or repeat the question or answer in your response. Never mention question or answer as undefined in your response. 
  For context, the candidate is applying for the position *insert_title_here* at the company *insert_company_here*. The type of positions they are applying for 
  are the following: *insert_type_here*. The requirements for this job are the following: "*insert_reqs_here*". 
  Please limit the feedback to 200 words and do not repeat the question or the answer. You are speaking to the candidate in the second person. 
  Please organize your answer into two sections: "strengths" and "improvements", where the "strengths" section talks about what the candidate did well and 
  the "improvements" section talks about areas of improvement for the candidate's answer. For each section, add a heading that highlights each point made. 
  The response should be in a JSON format like the following

{
  "strengths": [
    {
      "feedbackHeading": "feedback_heading_1",
      "feedback": "feedback_1"
    },
    {
      "feedbackHeading": "feedback_heading_2",
      "feedback": "feedback_2"
    }
  ],
  "improvements": [
    {
      "feedbackHeading": "feedback_heading_1",
      "feedback": "feedback_1"
    },
    {
      "feedbackHeading": "feedback_heading_2",
      "feedback": "feedback_2"
    },
    {
      "feedbackHeading": "feedback_heading_3",
      "feedback": "feedback_3"
    }
  ]
}
}

where feedback_heading_* is replaced by the heading that the category of the feedback you have, and feedback_* is replaced by the content of the feedback. The "strengths" and "improvements" sections can have anywhere between three to five feedback points. 

Here is an example:

{
  "strengths": [
    {
      "feedbackHeading": "Personalized answers",
      "feedback": "Good job in making the company personal to you by providing examples!"
    },
    {
      "feedbackHeading": "Adding your impact",
      "feedback": "It's great to always say what impact you had in the previous companies you worked at. What you said was great!"
    }
  ],
  "improvements": [
    {
      "feedbackHeading": "Be more specific",
      "feedback": "Add more details in your answers by recounting a specific scenario or example that you remember from the past. This will make your answer more authentic"
    }
  ]
}
`;

const overallFeedbackContext = `
Your role is to give overall feedback to a candidate who just did an interview.
For context, the candidate is applying for the position *insert_title_here* at the company *insert_company_here*. The type of positions they are applying for 
are the following: *insert_type_here*. The requirements for this job are the following: "*insert_reqs_here*".
The questions of the interviewer and the answers by the candidate are in an array of objects provided below, where each object in the array represents one question/answer pair.
The question field in each object is the question asked by the interviewer and the answer field in each object is the candidate's answer to that respective question.
Here is the array of objects:
*insert_questions_here*

Please limit the feedback to 150 words, the feedback should be in form of 6 distinct feedback separated with "." and do not repeat the question or the answer. You are speaking to the candidate in second person. Your answer should be in the format of 
a JSON with key named feedback.
`;

const generateQuestionsContext = `
Your role is to generate an interview question for a candidate doing an interview. 
For context, the candidate is applying for the position *insert_title_here* at the company *insert_company_here*. The type of positions they are applying for 
are the following: *insert_type_here*. The requirements for this job are the following: "*insert_reqs_here*".
The questions the candidate is already being asked is provided in an array here: *insert_questions_here*
Make sure that the question you generate is not a repeat of any of the questions that are already being asked.
Difficulty level of question will be : *insert_level_here*
Please limit the question to one sentence and make question a lot more technical. The question should be directed to the candidate in the second person. Your answer should be in the form of a valid JSON with only the question.
`;

export const get = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   console.log("damn")
    //   throw new Error("Not Authenticated");
    // }
    const assess_cards = await ctx.db.query("assess").order("desc").paginate(args.paginationOpts);
    return assess_cards;
  },
});



export const getAssessmentCardById = query({
  args: { _id: v.id("assess") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const interviewInfo = await ctx.db
      .query("assess")
      .filter((q) => q.eq(q.field("_id"), args._id))
      .collect();
    return interviewInfo;
  },
});

export const questionSearch = query({
  args:{bodyQuery: v.string()},
  handler: async (ctx, args) => {
    console.log(args.bodyQuery)
    const results = await ctx.db
      .query("assess")
      .withSearchIndex("by_jobtype", (q) => q.search("jobtype", args.bodyQuery))
      .collect();
    console.log(results)
    return results;
  },
})

async function embed(text: string): Promise<number[]> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_KEY environment variable not set!");
  }
  const req = { input: text, model: "text-embedding-ada-002" };
  const resp = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(req),
  });
  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error(`OpenAI API error: ${msg}`);
  }
  const json = await resp.json();
  const vector = json["data"][0]["embedding"];
  console.log(`Computed embedding of "${text}": ${vector.length} dimensions`);
  return vector;
}


export const fetchResults = internalQuery({
  args: { ids: v.array(v.id("assess")) },
  handler: async (ctx, args) => {
    const results: any[] | PromiseLike<any[]> = [];
    for (const id of args.ids) {
      const doc = await ctx.db.get(id);
      if (doc === null) {
        continue;
      }
      results.push(doc);
    }
    return results;
  },
});

export const similarRequirements = action({
  args: {
    descriptionQuery: v.string(),
  },
  handler: async (ctx, args) => {
    const embedding = await embed(args.descriptionQuery);
    const results = await ctx.vectorSearch("assess", "by_embedding", {
      vector: embedding,
      limit: 16,
    });
    const searchResults: Array<Doc<"assess">> = await ctx.runQuery(
      internal.assess.fetchResults,
      { ids: results.map((result) => result._id) },
    );
    console.log(searchResults)
    return searchResults;
  },
});
export const assess_create_mutation = internalMutation({
  args: {
    name: v.string(),
    jobProfile: v.string(),
    jobtype: v.string(),
    companyName: v.string(),
    jobRequirements: v.string(),
    level: v.string(),
    embeddings: v.array(v.float64()),
    questions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const userId = identity.subject;

    const assess = await ctx.db.insert("assess", {
      name: args.name,
      jobProfile: args.jobProfile,
      jobtype: args.jobtype,
      companyName: args.companyName,
      jobRequirements: args.jobRequirements,
      level: args.level,
      questions: args.questions,
      embedding:args.embeddings,
      userId,
    });
    return assess;
  },
});


export const assess_create = action({
  args: {
    name: v.string(),
    jobProfile: v.string(),
    jobtype: v.string(),
    companyName: v.string(),
    jobRequirements: v.string(),
    level: v.string(),
    questions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const userId = identity.subject;

    const embeddingArray = await embed( args.jobRequirements );

    const assess:any = await ctx.runMutation(internal.assess.assess_create_mutation, {
      name: args.name,
      jobProfile: args.jobProfile,
      jobtype: args.jobtype,
      companyName: args.companyName,
      jobRequirements: args.jobRequirements,
      level: args.level,
      questions: args.questions,
      embeddings:embeddingArray,
    });
    return assess;
  },
});

export const assess_delete = mutation({
  args: { id: v.id("assess") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const userId = identity.subject;
    const remove = await ctx.db.delete(args.id);
    return remove;
  },
});

export const assess_update = mutation({
  args: {
    id: v.id("assess"),
    name: v.optional(v.string()),
    jobProfile: v.optional(v.string()),
    jobtype: v.optional(v.string()),
    companyName: v.optional(v.string()),
    jobRequirements: v.optional(v.string()),
    level: v.optional(v.string()),
    questions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not Authenticated");
    }
    const userId = identity.subject;

    const { id, ...rest } = args;

    const existing_assess_card = await ctx.db.get(args.id);

    if (!existing_assess_card) {
      throw new Error("Not Found");
    }

    if (existing_assess_card.userId != userId) {
      throw new Error("Unauthorized");
    }

    const update = await ctx.db.patch(args.id, {
      ...rest,
    });

    return update;
  },
});

export const assess_action_GenerateResponse = action({
  args: {
    prompt: v.object({
      queryType: v.string(),
      jobProfile: v.optional(v.string()),
      companyName: v.optional(v.string()),
      question: v.optional(v.string()),
      name: v.optional(v.string()),
      prevQuestion: v.optional(v.string()),
      prevAnswer: v.optional(v.string()),
      answer: v.optional(v.string()),
      jobtype: v.optional(v.string()),
      jobRequirements: v.optional(v.string()),
      questions: v.optional(
        v.array(
          v.object({
            question: v.string(),
            answer: v.string(),
          })
        )
      ),
      questionsAfterInterview: v.optional(
        v.array(
          v.object({
            question: v.string(),
            answer: v.string(),
            isAI: v.optional(v.boolean()),
            strengths: v.array(
              v.object({
                feedbackHeading: v.string(),
                feedback: v.string(),
              })
            ),
            improvements: v.array(
              v.object({
                feedbackHeading: v.string(),
                feedback: v.string(),
              })
            ),
          })
        )
      ),
      level: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const body = args.prompt;
    const queryType = body.queryType;

    console.log("generating response :)", queryType);

    let context: any[] = [];

    if (queryType == "firstMessage") {
      const jobProfile = body.jobProfile;
      const companyName = body.companyName;
      const questions = body.question;
      const name = body.name;

      const systemContext = firstMessageContext
        .replace("*insert_company_here*", companyName ?? "null")
        .replace("*insert_job_here*", jobProfile ?? "null")
        .replace("*insert_name_here*", name ?? "null")
        .concat(questions ?? "null");

      context.push({
        role: "system",
        content: systemContext,
      });
    } else if (queryType == "subsequentMessage") {
      const jobProfile = body.jobProfile;
      const companyName = body.companyName;
      const prevQuestion = body.prevQuestion;
      const prevAnswer = body.prevAnswer;
      const questions = body.question;
      const name = body.name;

      const systemContext = subsequentMessageContext
        .replace("*insert_job_here*", jobProfile ?? "null")
        .replace("*insert_prevAnswer_here*", prevAnswer ?? "null")
        .replace("*insert_company_here*", companyName ?? "null")
        .replace("*insert_name_here*", name ?? "null")
        .concat(questions ?? "null");

      context.push({
        role: "system",
        content: systemContext,
      });

      context.push({
        role: "assistant",
        content: prevQuestion,
      });

      context.push({
        role: "user",
        content: prevAnswer,
      });
    } else if (queryType == "lastMessage") {
      const jobProfile = body.jobProfile;
      const companyName = body.companyName;
      const prevQuestion = body.prevQuestion;
      const prevAnswer = body.prevAnswer;
      const name = body.name;

      const systemContext = lastMessageContext
        .replace("*insert_job_here*", jobProfile ?? "null")
        .replace("*insert_company_here*", companyName ?? "null")
        .replace("*insert_prevAnswer_here*", prevAnswer ?? "null")
        .replace("*insert_name_here*", name ?? "null");

      context.push({
        role: "system",
        content: systemContext,
      });

      context.push({
        role: "assistant",
        content: prevQuestion,
      });

      context.push({
        role: "user",
        content: prevAnswer,
      });
    } else if (queryType == "feedback") {
      const question = body.question;
      const answer = body.answer;
      const jobProfile = body.jobProfile;
      const jobtype = body.jobtype;
      const companyName = body.companyName;
      const jobRequirements = body.jobRequirements;

      const systemContext = feedbackContext
        .replace("*insert_question_here*", question ?? "null")
        .replace("*insert_answer_here*", answer ?? "null")
        .replace("*insert_title_here*", jobProfile ?? "null")
        .replace("*insert_type_here*", jobtype ?? "null")
        .replace("*insert_company_here*", companyName ?? "null")
        .replace("*insert_reqs_here*", jobRequirements ?? "null");

      context.push({
        role: "system",
        content: systemContext,
      });
    } else if (queryType == "generateAnalytics") {
      const jobProfile = body.jobProfile ?? "null";
      const jobtype = body.jobtype ?? "null";
      const companyName = body.companyName ?? "null";
      const jobRequirements = body.jobRequirements ?? "null";

      const questions = body.questions ?? []; // Ensure questions array exists and handle null case

      const questionsArray = questions.map((q: any) => q.question ?? "null"); // Extract questions
      const answersArray = questions.map((q: any) => q.answer ?? "null"); // Extract answers

      const systemContext = generateAnalytics
        .replace("*insert_question_here*", questionsArray.join(", "))
        .replace("*insert_answer_here*", answersArray.join(", "))
        .replace("*insert_title_here*", jobProfile)
        .replace("*insert_type_here*", jobtype)
        .replace("*insert_company_here*", companyName)
        .replace("*insert_reqs_here*", jobRequirements);

      console.log(systemContext);
      context.push({ role: "system", content: systemContext });
    } else if (queryType == "overall") {
      const questionsString = (body.questionsAfterInterview ?? [])
        .map((q) => q?.question ?? "")
        .join("\n");
      const jobProfile = body.jobProfile;
      const jobtype = body.jobtype;
      const companyName = body.companyName;
      const jobRequirements = body.jobRequirements;

      const systemContext = overallFeedbackContext
        .replace("*insert_questions_here*", questionsString)
        .replace("*insert_title_here*", jobProfile ?? "null")
        .replace("*insert_type_here*", jobtype ?? "null")
        .replace("*insert_company_here*", companyName ?? "null")
        .replace("*insert_reqs_here*", jobRequirements ?? "null");

      context.push({
        role: "system",
        content: systemContext,
      });
    } else if (queryType == "generateQuestion") {
      const questionsString = (body.questions ?? [])
        .map((q) => q?.question ?? "")
        .join("\n");
      const jobProfile = body.jobProfile;
      const jobtype = body.jobtype;
      const companyName = body.companyName;
      const jobRequirements = body.jobRequirements;
      const level = body.level;

      console.log(
        questionsString,
        jobProfile,
        jobtype,
        companyName,
        level,
        jobRequirements
      );

      const systemContext = generateQuestionsContext
        .replace("*insert_questions_here*", questionsString ?? "null")
        .replace("*insert_title_here*", jobProfile ?? "null")
        .replace("*insert_type_here*", jobtype ?? "null")
        .replace("*insert_company_here*", companyName ?? "null")
        .replace("*insert_reqs_here*", jobRequirements ?? "null")
        .replace("*insert_level_here*", diflevel(level ?? "null"));

      console.log(systemContext);

      context.push({ role: "system", content: systemContext });
    }

    const completion = await openai.chat.completions.create({
      messages: context,
      model: "gpt-3.5-turbo",
      stream: true,
    });

    const stream = OpenAIStream(completion);

    console.log("response generated :)");

    const handleStream = async (stream: ReadableStream<Uint8Array>) => {
      let result = "";
      const reader = stream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += new TextDecoder().decode(value);
        }
      } finally {
        reader.releaseLock();
      }
      return result;
    };

    const streamResult = await handleStream(stream);
    return streamResult;
  },
});
