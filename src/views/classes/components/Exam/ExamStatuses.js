import React, {useState} from "react";
import { Link } from "react-router-dom";
import ClassesAPI from "../../../../api/ClassesAPI";
import Status from "../../../../components/utilities/Status";
import ShowResultExam from "./ShowResultExam";
import { useParams } from 'react-router'

export default function ExamStatuses({ user, exam, startDate, endDate, noAssigned }) {
  const[examAnalysis, setExamAnalysis] = useState([])
  const [viewAnalysis, setViewAnalysis] = useState(false)
  const { id } = useParams()

  const openModalShowResutl = (testId) => {
    getExamAnalysis(testId)
    setViewAnalysis(true)
  }
  // const getExamAnalysis = async (classId, testId) =>{
  //   let studentId = user?.student?.id
  //   let response = await new ClassesAPI().getExamAnalysis(studentId, classId, testId)
  //     if(response.ok){
  //       setExamAnalysis(response.data.testPartAnswers)
  //     }else{
  //       alert(response.data.errorMessage)
  //     }
  // }

  const getExamAnalysis = async(testid) => {
    // console.log(selectedClassId)
    sessionStorage.setItem('analysis','true')
    let classId = id
    let studentId = user?.student?.id
    // sessionStorage.setItem('testid',testid)
    let response = await new ClassesAPI().getExamAnalysis(studentId, classId, testid)
    if(response.ok){
      setExamAnalysis(response.data)
      console.log(response.data)
      
    }else{
      alert(response.data.errorMessage)
    }
  }

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
          <Status>{exam?.classTest?.showAnalysis ? <div  onClick={() => openModalShowResutl(exam?.test?.id)}> Show Result </div> :  'Disable Show Result'}</Status>
        </> 
      )}
      {user.isTeacher && exam?.test?.classId && exam?.test?.isShared && <Status>Shared</Status>}
      <ShowResultExam setViewAnalysis={setViewAnalysis} viewAnalysis={viewAnalysis} examAnalysis={examAnalysis} />
    </div>
  );
}
