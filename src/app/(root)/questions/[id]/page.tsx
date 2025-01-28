import TagCard from "@/components/cards/TagCard";
import { Preview } from "@/components/editor/Preview";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "~/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { auth } from "~/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;
  const session = await auth();

  const { success, data: question } = await getQuestion({ questionId: id });

  if (!success || !question) return redirect("/404");

  const { author, createdAt, answers, views, tags, content, title } = question;

  const isAuthor = session?.user?.id === author._id;

  console.log("Debug auth:", {
    sessionUserId: session?.user?.id, // The current logged-in user's ID from the auth session, if any
    authorId: author._id, // MongoDB ObjectId converted to string in getQuestion()
    isAuthor,
  });

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>

          <div className="flex justify-end gap-3">
            <p>Votes</p>
            {isAuthor && (
              <Button
                className="paragraph-medium btn-secondary text-dark300_light900 min-h-[41px] min-w-[87px] px-4 py-3"
                asChild
              >
                <Link href={`/questions/${id}/edit`}>Edit</Link>
              </Button>
            )}
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={answers}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      <Preview content={content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>
    </>
  );
};

export default QuestionDetails;
