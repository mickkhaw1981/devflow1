"use server";

import mongoose from "mongoose";

import Question from "~/database/question.model";
import TagQuestion from "~/database/tag-question.model";
import Tag from "~/database/tag.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { AskQuestionSchema } from "../validations";

export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // Destructure the validated question parameters (title, content, tags) from the validation result
  // The ! operator asserts that params is not null since validation passed
  const { title, content, tags } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  // Start a MongoDB transaction session to ensure data consistency
  // This allows us to perform multiple database operations atomically
  // If any operation fails, all changes will be rolled back
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [question] = await Question.create(
      [{ title, content, author: userId }],
      { session }
    );

    if (!question) {
      throw new Error("Failed to create question");
    }

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );

      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    // Update the question document to add all tag IDs to its tags array
    // - question._id: The ID of the question we just created
    // - $push with $each: Adds multiple tag IDs to the tags array in one operation
    // - session: Keeps this update as part of the transaction
    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );

    await session.commitTransaction();

    // We need to convert the Mongoose document to a plain JavaScript object
    // JSON.parse(JSON.stringify()) is used to handle any non-serializable fields
    // This ensures the response can be safely transmitted over the network
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
