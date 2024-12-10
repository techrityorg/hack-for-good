import { z } from "zod";

export const createAssessSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  jobProfile: z.string().min(1, { message: "Job Profile is required" }),
  jobtype: z.string().min(1, { message: "Job Type is required" }),
  companyName: z.string().min(1, { message: "Company Name is required" }),
  jobRequirements: z
    .string()
    .min(1, { message: "Job Requirements is required" }),
  level: z.string().min(1, { message: "Level is required" }),
  questions: z.array(z.string()).refine((data) => data.length >= 3, {
    message: "At least three questions are required",
  }),
});

export const createResultSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  jobProfile: z.string().min(1, { message: "Job Profile is required" }),
  jobtype: z.string().min(1, { message: "Job Type is required" }),
  companyName: z.string().min(1, { message: "Company Name is required" }),
  jobRequirements: z
    .string()
    .min(1, { message: "Job Requirements is required" }),
  level: z.string().min(1, { message: "Level is required" }),
  questions: z.array(
    z.object({
      question: z.string().min(1, { message: "Question is required" }),
      answer: z.string().min(1, { message: "Answer is required" }),
      isAI: z.boolean(),
      strengths: z.array(
        z.object({
          feedbackHeading: z
            .string()
            .min(1, { message: "Feedback Heading is required" }),
          feedback: z.string().min(1, { message: "Feedback is required" }),
        })
      ),
      improvements: z.array(
        z.object({
          feedbackHeading: z
            .string()
            .min(1, { message: "Feedback Heading is required" }),
          feedback: z.string().min(1, { message: "Feedback is required" }),
        })
      ),
    })
  ),
  overview: z.string().min(1, { message: "Overview is required" }),
  analytics: z.array(
    z.object({
      parameter: z.string().min(1, { message: "Parameter is required" }),
      points: z.number().min(0, { message: "Points must be a number" }),
      maxPoints: z.number().min(1, { message: "Max Points must be a number" }),
    })
  ),
});

export const createAutomatedAssessSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  jobProfile: z.string().min(1, { message: "Job Profile is required" }),
  jobtype: z.string().min(1, { message: "Job Type is required" }),
  companyName: z.string().min(1, { message: "Company Name is required" }),
  jobRequirements: z
    .string()
    .min(1, { message: "Job Requirements is required" }),
  level: z.string().min(1, { message: "Level is required" }),
  questions: z.array(z.string()).refine((data) => data.length >= 3, {
    message: "At least three questions are required",
  }),
});

export const createAutomatedResultSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  jobProfile: z.string().min(1, { message: "Job Profile is required" }),
  jobtype: z.string().min(1, { message: "Job Type is required" }),
  companyName: z.string().min(1, { message: "Company Name is required" }),
  jobRequirements: z
    .string()
    .min(1, { message: "Job Requirements is required" }),
  level: z.string().min(1, { message: "Level is required" }),
  questions: z.array(
    z.object({
      question: z.string().min(1, { message: "Question is required" }),
      answer: z.string().min(1, { message: "Answer is required" }),
      isAI: z.boolean(),
      strengths: z.array(
        z.object({
          feedbackHeading: z
            .string()
            .min(1, { message: "Feedback Heading is required" }),
          feedback: z.string().min(1, { message: "Feedback is required" }),
        })
      ),
      improvements: z.array(
        z.object({
          feedbackHeading: z
            .string()
            .min(1, { message: "Feedback Heading is required" }),
          feedback: z.string().min(1, { message: "Feedback is required" }),
        })
      ),
    })
  ),
  overview: z.string().min(1, { message: "Overview is required" }),
  analytics: z.array(
    z.object({
      parameter: z.string().min(1, { message: "Parameter is required" }),
      points: z.number().min(0, { message: "Points must be a number" }),
      maxPoints: z.number().min(1, { message: "Max Points must be a number" }),
    })
  ),
});

export const updateAssessSchema = createAssessSchema.extend({
  id: z.string().min(1),
});
export const updateAutoAssessSchema = createAutomatedAssessSchema.extend({
  id: z.string().min(1),
});

export const deleteAssessSchema = z.object({
  id: z.string().min(1),
});
export const deleteAutoAssessSchema = z.object({
  id: z.string().min(1),
});

export type CreateAssessSchema = z.infer<typeof createAssessSchema>;
export type CreateResultSchema = z.infer<typeof createResultSchema>;

export type CreateAutomatedAssessSchema = z.infer<
  typeof createAutomatedAssessSchema
>;
export type CreateAutomatedResultSchema = z.infer<
  typeof createAutomatedResultSchema
>;
