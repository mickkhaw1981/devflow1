import React from "react";
import QuestionForm from "@/components/forms/QuestionForm";

const AskQuestion = () => {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <QuestionForm />
      </div>
    </div>
  );
};

export default AskQuestion;
