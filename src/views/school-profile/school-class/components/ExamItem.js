import CoursesAPI from "../../../../api/CoursesAPI";
import React, { useContext, useState, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { useParams } from "react-router-dom";
import ClassesAPI from "../../../../api/ClassesAPI";
import Status from "../../../../components/utilities/Status";
import { UserContext } from "../../../../context/UserContext";
import getStartAndEndDateFromClassTest from "../../../../utils/getStartAndEndDateFromClassTest";
import AssignExam from "../../../classes/components/Exam/AssignExam";
import EditExam from "../../../classes/components/Exam/EditExam";
import ExamItemContent from "./ExamContent";
import ExamStatuses from "../../../classes/components/Exam/ExamStatuses";
import TeacherExamActions from "../../../classes/components/Exam/TeacherExamActions";
import PreviewExam from "../../../classes/components/Exam/PreviewExam";

export default function ExamItem({ exam, deleteExam, setLoading, fetchExams }) {
  const userContext = useContext(UserContext);
  const { user } = userContext.data;
  const id = window.location.pathname.split('/')[2]
  const [showWarning, setShowWarning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { startDate, endDate } = getStartAndEndDateFromClassTest(exam);

  const toggleShare = async () => {
    console.log({exam})
    setLoading(true);
    let response = await new CoursesAPI().editExam(exam.test?.id, {
      isShared: !exam.test?.isShared,
      testName: exam.test?.testName,
      testInstructions: exam.test?.testInstructions
    });
    if (response.ok) {
      fetchExams()
    } else {
      alert(response.data.errorMessage);
    }
  };
  const [showPreviewExamModal, setShowPreviewExamModal] = useState(false)
  const [testItem, setTestItem] = useState([])
  const [questionPartDto, setQuestionPartDto] = useState([]) 
  
  const getInformationExam = async (e, item) => {
    let response = await new ClassesAPI().getInformationExam(item)
    if(response.ok){
      setTestItem(response.data)
      setQuestionPartDto(response.data.questionPartDto)
      setShowPreviewExamModal(true)
    }else{
      alert("Something went wrong while fetching Exam Item");
    }
  }

  console.log('questionPartDto:', questionPartDto)

  return (
    <div className='exam-item-container'>
      <SweetAlert
        warning
        showCancel
        show={showWarning}
        confirmBtnText='Yes, delete it!'
        confirmBtnBsStyle='danger'
        title='Are you sure?'
        onConfirm={async (e) => {
          await deleteExam(exam.test.id);
          setShowWarning(false);
        }}
        onCancel={() => setShowWarning(false)}
        focusCancelBtn
      >
        You will not be able to recover this exam!
      </SweetAlert>
      <div className='exam-content'>
        <ExamItemContent
          id={id}
          exam={exam}
          user={user}
          startDate={startDate}
          endDate={endDate}
        />
        <ExamStatuses
          exam={exam}
          user={user}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      {user.isTeacher && (
        <TeacherExamActions
          toggleShare={toggleShare}
          exam={exam}
          setShowModal={setShowModal}
          setShowEditModal={setShowEditModal}
          setShowWarning={setShowWarning}
          getInformationExam={getInformationExam}
        />)
      }
        
      <AssignExam
        showModal={showModal}
        setShowModal={setShowModal}
        id={id}
        exam={exam}
        setLoading={setLoading}
        fetchExams={fetchExams}
        closeModal={() => setShowModal(false)}
      />
      <EditExam
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        id={id}
        exam={exam}
        setLoading={setLoading}
        fetchExams={fetchExams}
      />
      <PreviewExam 
      showPreviewExamModal={showPreviewExamModal}
      setShowPreviewExamModal={setShowPreviewExamModal}
      testItem={testItem}
      questionPartDto={questionPartDto}
      />
    </div>
  );
}