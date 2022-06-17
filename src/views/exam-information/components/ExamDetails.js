import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import Status from "../../../components/utilities/Status";
import { UserContext } from "../../../context/UserContext";
import getStartAndEndDateFromClassTest from "../../../utils/getStartAndEndDateFromClassTest";
import ExamStatuses from "../../classes/components/Exam/ExamStatuses";
import ExamTimer from "./ExamTimer";

const ExamParts = ({ exam }) => {
  return exam.questionPartDto.map((part, index) => (
    <div className='exam-parts-container default-item-container' key={index}>
      <p className='primary-title' style={{ fontSize: 24 }} dangerouslySetInnerHTML={{__html:part.questionPart.instructions }} />
      <p
        className='secondary-title'
        style={{ fontSize: 16 }}
      >{`${part.questionDtos.length} Question(s)`}</p>
    </div>
  ));
};

export default function ExamDetails({
  exam,
  loading,
  remainingTime,
  startExam,
  examStarted,
  isDoneTest,
  additionalExamInfo,
}) {
  const { startDate, endDate } = getStartAndEndDateFromClassTest(additionalExamInfo);
  const userContext = useContext(UserContext);
  const { user } = userContext.data;
  console.log({ startDate, endDate, exam, additionalExamInfo });
  return exam != null && !loading ? (
    <div className='exam-information-container'>
      <div className='d-flex justify-content-between '>
        <div>
          <p style={{ fontSize: 36, color: "#707070", margin: 0 }}>
            Exam Information
          </p>
          <p className='primary-title' style={{ fontSize: 24 }}>
            {exam.test?.testName}
          </p>
          <p className='secondary-title mb-2'>{`${exam.totalItems} Total Item(s)`}</p>
          {additionalExamInfo && (
            <ExamStatuses
              exam={additionalExamInfo}
              user={user}
              startDate={startDate}
              endDate={endDate}
            />
          )}

          {!examStarted && !isDoneTest && (
            <Status>Not Started</Status>
          )}
          {examStarted && <Status>{"Exam is Ongoing.."}</Status>}
          <br />
          {!examStarted && !isDoneTest && startDate < new Date() && endDate > new Date() && (
            <Button
              className='btn btn-primary my-4 '
              variant='primary'
              size='lg'
              onClick={() => startExam()}
            >
              START EXAM
            </Button>
          )}
        </div>
        {<ExamTimer remainingTime={remainingTime} examStarted={examStarted} />}
      </div>
      <hr />
      <p className='secondary-title mt-4'>Exam Parts</p>
      {!examStarted && <ExamParts exam={exam} />}
    </div>
  ) : (
    <div>Loading Exam Information...</div>
  );
}
