import React, { useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { toast } from "react-toastify";
import ExamAPI from "../../../../api/ExamAPI";
import Enumeration from "./Enumeration";
import Essay from "./Essay";
import Identification from "./Identification";
import MultipleChoice from "./MultipleChoice";
import TrueOrFalse from "./TrueOrFalse";

const QuestionSwitch = ({
  part,
  getExamInformation,
  setLoading,
  editable,
  shared,
  deleteQuestion,
  examName
}) => {
  console.log(part)
  switch (part.questionPart.questionTypeId) {
    case 1:
      return (
        <MultipleChoice
          shared={shared}  
          examName={examName}
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
          shared={shared}  
          examName={examName}
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
          shared={shared}  
          examName={examName}
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
          shared={shared}  
          examName={examName}
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
          shared={shared}  
          examName={examName}
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
};

export default function Questions({
  part,
  getExamInformation,
  setLoading,
  editable,
  shared,
  examName
}) {

  const [selectedId, setSelectedId] = useState(null)
  const [showWarning, setShowWarning] = useState(false)
  const deleteQuestion = async (e, id) => {
    setLoading(true);
    await new ExamAPI().deleteQuestion(id);
    getExamInformation();
    setSelectedId(null)
    toast.success("Question deleted successfully");
  };

  return (
    <div>
      <SweetAlert
        warning
        showCancel
        show={showWarning}
        confirmBtnText='Yes, delete it!'
        confirmBtnBsStyle='danger'
        title='Are you sure?'
        onConfirm={async (e) => {
          await deleteQuestion(e, selectedId);
          setShowWarning(false);
        }}
        onCancel={() => setShowWarning(false)}
        focusCancelBtn
      >
        You will not be able to recover this exam!
      </SweetAlert>
      <QuestionSwitch
        examName={examName}
        part={part}
        getExamInformation={getExamInformation}
        setLoading={setLoading}
        editable={editable}
        shared={shared}
        deleteQuestion={(e, id) => {
          e.preventDefault();
          setShowWarning(true)
          setSelectedId(id)
          
        }}
      />
    </div>
  );
}
