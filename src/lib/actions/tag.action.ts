"use server";

import { FilterQuery } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  PaginatedSearchParamsSchema,
  GetTagQuestionsSchema,
} from "../validations";
import { Tag, Question } from "~/database";

// getTags is an async function... That accepts a param object (from the URL) that has the data shape define by PaginatedSearchParams... And will return a Promise of a type ActionResponse (the generic data shape defined in global.d.ts), and specifically an array of tags and isNext property for pagination..
export const getTags = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{ tags: Tag[]; isNext: boolean }>> => {
  // Validate the params object using the PaginatedSearchParamsSchema
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  // If the validationResult is an instance of Error, then we return the error response
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // Destructure the params object to get the page, pageSize, query, and filter values
  const { page = 1, pageSize = 10, query, filter } = params;

  // Calculate the skip value for pagination
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  // Initialize an empty MongoDB filter query object that will be used to filter Tag documents
  const filterQuery: FilterQuery<typeof Tag> = {};

  // If the query is provided, add a $or condition to the filter query to search for tags with names matching the query (case-insensitive)
  if (query) {
    filterQuery.$or = [{ name: { $regex: query, $options: "i" } }];
  }

  // Initialize an empty sort criteria object that will be used to sort the tags
  let sortCriteria = {};

  // Switch statement to set the sort criteria based on the filter value
  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;
    case "recent":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "name":
      sortCriteria = { name: 1 };
      break;
    default:
      sortCriteria = { questions: -1 };
      break;
  }

  try {
    // Count the total number of tags that match the filter query
    const totalTags = await Tag.countDocuments(filterQuery);

    // Find the tags that match the filter query, sort them, skip the appropriate number of tags, and limit the results to the page size
    ///Exampleapi/tags?query=react&filter=popular&page=1&pageSize=10
    const tags = await Tag.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalTags > skip + tags.length;

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
        isNext,
      },
    };
  } catch (error) {
    //
    return handleError(error) as ErrorResponse;
  }
};

export const getTagQuestions = async (
  params: GetTagQuestionsParams
): Promise<
  ActionResponse<{ tag: Tag; questions: Question[]; isNext: boolean }>
> => {
  const validationResult = await action({
    params,
    schema: GetTagQuestionsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { tagId, page = 1, pageSize = 10, query } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const tag = await Tag.findById(tagId);
    if (!tag) throw new Error("Tag not found");

    const filterQuery: FilterQuery<typeof Question> = {
      tags: { $in: [tagId] },
    };

    if (query) {
      filterQuery.title = { $regex: query, $options: "i" };
    }

    const totalQuestions = await Question.countDocuments(filterQuery);

    const questions = await Question.find(filterQuery)
      .select("_id title views answers upvotes downvotes author createdAt")
      .populate([
        { path: "author", select: "name image" },
        { path: "tags", select: "name" },
      ])
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
