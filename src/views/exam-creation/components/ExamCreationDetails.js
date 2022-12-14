import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { Button } from "react-bootstrap";
import CoursesAPI from "../../../api/CoursesAPI";
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
  const courseid = sessionStorage.getItem('courseid')
  const [courseInfos, setCourseInfos] = useState([])
  const [isContributor, setIsContributor] = useState(true);
  const ifCoursetab = window.location.pathname.includes('course') ? true : !exam?.test?.isShared;

  const getContributor = async() => {
    let response = await new CoursesAPI().getContributor(courseid)
    if(response.ok){
      let temp = response.data;
      let ifContri = temp.find(i => i.userInformation?.userId == user.userId);
      setIsContributor(ifContri ? true : false);
    }
  }

  const getCourseInformation = async () =>{
    let response = await new CoursesAPI().getCourseInformation(courseid)
    if(response.ok){
      setCourseInfos(response.data)
    }
  }

  useEffect(() => {
    if(window.location.pathname.includes('course')){
      getContributor();
      getCourseInformation();
    }
  }, [])

  return exam != null ? (
    <div className='exam-information-container' title="">
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
          <p className='secondary-title mb-2'>{`${exam.rawScore} Total Point(s)`}</p>
          <p className='secondary-title mb-2'>{`${exam.questionPartDto?.length} Total Part(s)`}</p>
        </div>
      </div>
      <hr />
      <p className='secondary-title mt-4'>Exam Parts</p>
      {
        isContributor && editable && ifCoursetab && 
          <Button
            className='btn btn-primary my-4'
            variant='primary'
            size='lg'
            title=""
            onClick={() => {
              setSelectedPart(null);
              setShowModal(true);
            }}
          >
            Add Part
          </Button>
      }
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
