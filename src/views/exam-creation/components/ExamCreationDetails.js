import React from "react";
import { useContext } from "react";
import { Button } from "react-bootstrap";
import { UserContext } from "../../../context/UserContext";
import getStartAndEndDateFromClassTest from "../../../utils/getStartAndEndDateFromClassTest";
import ExamStatuses from "../../classes/components/Exam/ExamStatuses";
import ExamParts from "./ExamParts";

export default function ExamCreationDetails({
  exam,
  selectedPart,
  setSelectedPart,
  getExamInformation,
  setLoading,
  setShowModal,
  deletePart,
  noAssigned,
  editable
}) {
  const userContext = useContext(UserContext);
  const { user } = userContext.data;

  const { startDate, endDate } = getStartAndEndDateFromClassTest(exam);

  return exam != null ? (
    <div className='exam-information-container'>
      <div className='d-flex justify-content-between '>
        <div>
          <p style={{ fontSize: 36, color: "#707070", margin: 0 }}>
            Exam Information
          </p>
          <p className='primary-title' style={{ fontSize: 24 }}>
            {exam.test.testName}
          </p>
          <p className='primary-title' style={{ fontSize: 16 }}>
            {exam.class?.className}
          </p>
          <p className='secondary-title'>{`${exam.totalItems} Total Item(s)`}</p>
          {exam.classTest && (
            <p className='secondary-title mb-2'>{`Time limit: ${exam.classTest?.timeLimit} minute(s)`}</p>
          )}
          <ExamStatuses
            user={user}
            exam={exam}
            startDate={startDate}
            endDate={endDate}
            noAssigned={noAssigned}
          />
        </div>
      </div>
      <hr />
      <p className='secondary-title mt-4'>Exam Parts</p>
      {editable && (
        <Button
          className='btn btn-primary my-4'
          variant='primary'
          size='lg'
          onClick={() => {
            setSelectedPart(null);
            setShowModal(true);
          }}
        >
          Add Part
        </Button>
      )}
      <ExamParts
        selectedPart={selectedPart}
        setSelectedPart={setSelectedPart}
        exam={exam}
        deletePart={deletePart}
        getExamInformation={getExamInformation}
        setLoading={setLoading}
        setShowModal={setShowModal}
        editable={editable}
      />
    </div>
  ) : (
    <div>Loading Exam Information...</div>
  );
}
