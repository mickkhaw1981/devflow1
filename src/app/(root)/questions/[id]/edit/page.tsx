import { notFound, redirect } from "next/navigation";
import React from "react";

import { auth } from "~/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import { getQuestion } from "@/lib/actions/question.action";
import ROUTES from "~/constants/routes";

interface RouteParams {
  params: {
    id: string;
  };
}

const EditQuestion = async ({ params }: RouteParams) => {
  const { id } = params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect("/sign-in");

  const { data: question, success } = await getQuestion({ questionId: id });
  if (!success) return notFound();

  // Check if the current user is the author
  if (question?.author?._id !== session?.user?.id) {
    redirect(ROUTES.QUESTION(id));
  }

  return (
    <main>
      <QuestionForm question={question} isEdit />
    </main>
  );
};

export default EditQuestion;
