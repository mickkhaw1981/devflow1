import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { getTagQuestions } from "@/lib/actions/tag.action";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_QUESTION } from "~/constants/states";
import ROUTES from "~/constants/routes";

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string };
}

const TagDetails = async ({ params, searchParams }: Props) => {
  const { page, pageSize, query } = searchParams;

  const { success, data, error } = await getTagQuestions({
    tagId: params.id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
  });

  const { tag, questions } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">
          Questions tagged [{tag?.name}]
        </h1>

        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href="/ask-question">Ask a Question</Link>
        </Button>
      </section>

      <section className="mt-11">
        <LocalSearch
          route={`${ROUTES.TAGS}/${params.id}`}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default TagDetails;
