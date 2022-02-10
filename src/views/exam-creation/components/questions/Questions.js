import React from "react";
import { toast } from "react-toastify";
import ExamAPI from "../../../../api/ExamAPI";
import Enumeration from "./Enumeration";
import Essay from "./Essay";
import Identification from "./Identification";
import MultipleChoice from "./MultipleChoice";
import TrueOrFalse from "./TrueOrFalse";

export default function Questions({ part, getExamInformation, setLoading, editable }) {

  const deleteQuestion = async (e, id) => {
    e.preventDefault();
    setLoading(true);
    await new ExamAPI().deleteQuestion(id);
    getExamInformation();
    toast.success("Question deleted successfully");
  };

  switch (part.questionPart.questionTypeId) {
    case 1:
      return (
        <MultipleChoice
          editable={editable}
          part={part}
          questionTypeId={part.questionPart.questionTypeId}
          getExamInformation={getExamInformation}
          setLoading={setLoading}
          deleteQuestion={deleteQuestion}
        />
      );
    case 2:
      return (
        <TrueOrFalse
          editable={editable}
          part={part}
          questionTypeId={part.questionPart.questionTypeId}
          getExamInformation={getExamInformation}
          setLoading={setLoading}
          deleteQuestion={deleteQuestion}
        />
      );
    case 3:
      return (
        <Identification
          editable={editable}
          part={part}
          questionTypeId={part.questionPart.questionTypeId}
          getExamInformation={getExamInformation}
          setLoading={setLoading}
          deleteQuestion={deleteQuestion}
        />
      );
    case 4:
      return (
        <Essay
          editable={editable}
          part={part}
          questionTypeId={part.questionPart.questionTypeId}
          getExamInformation={getExamInformation}
          setLoading={setLoading}
          deleteQuestion={deleteQuestion}
        />
      );
    case 5:
      return (
        <Enumeration
          editable={editable}
          part={part}
          questionTypeId={part.questionPart.questionTypeId}
          getExamInformation={getExamInformation}
          setLoading={setLoading}
          deleteQuestion={deleteQuestion}
        />
      );
    default:
      return <div>Unknown</div>;
  }
}
