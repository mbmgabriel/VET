import React, {useState} from "react";
import { Link } from "react-router-dom";
import ClassesAPI from "../../../../api/ClassesAPI";
import Status from "../../../../components/utilities/Status";
import ShowResultExam from "./ShowResultExam";

export default function ExamStatuses({ user, exam, startDate, endDate, noAssigned }) {
  const[examAnalysis, setExamAnalysis] = useState([])

  const openModalShowResutl = (classId, testId) => {
    getExamAnalysis(classId, testId)
  }
  const getExamAnalysis = async (classId, testId) =>{
    let studentId = user?.student?.id
    let response = await new ClassesAPI().getExamAnalysis(studentId, classId, testId)
      if(response.ok){
        setExamAnalysis(response.data.testPartAnswers)
      }else{
        alert(response.data.errorMessage)
      }
  }

  console.log('examAnalysis:', examAnalysis)

  return (
    <div className='exam-status'>
      {exam?.test?.classId == null ? (<Status>Created in Course</Status>) : (<Status>Created in Class</Status>)}
      {user.isTeacher && exam?.classTest == null && !noAssigned && <Status>Unassigned</Status>}
      {exam?.classTest && (
        <>
          {startDate > new Date() && <Status>Upcoming</Status>}
          {startDate < new Date() && endDate > new Date() && <Status>Ongoing</Status>}
          {endDate < new Date() && <Status>Ended</Status>}
        </>
      )}
      {user.isStudent && (
        <>
          <Status>{exam?.isLoggedUserDone ? "Completed" : "Not Completed"}</Status>
          <Status>{exam?.classTest?.showAnalysis ? <div  onClick={() => openModalShowResutl(exam?.classTest?.classId, exam?.test?.id)}> Show Result </div> : ''}</Status>
        </> 
      )}
      {user.isTeacher && exam?.test?.classId && exam?.test?.isShared && <Status>Shared</Status>}
      <ShowResultExam examAnalysis={examAnalysis} />
    </div>
  );
}
