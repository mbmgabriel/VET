import React, {useState} from "react";
import { Link } from "react-router-dom";
import ClassesAPI from "../../../../api/ClassesAPI";
import Status from "../../../../components/utilities/Status";
import ShowResultExam from "./ShowResultExam";
import { useParams } from 'react-router'

export default function ExamStatuses({ user, exam, startDate, endDate, noAssigned }) {
  // const getExamAnalysis = async (classId, testId) =>{
  //   let studentId = user?.student?.id
  //   let response = await new ClassesAPI().getExamAnalysis(studentId, classId, testId)
  //     if(response.ok){
  //       setExamAnalysis(response.data.testPartAnswers)
  //     }else{
  //       alert(response.data.errorMessage)
  //     }
  // }

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
      {user.isStudent === true ?(
        <>
          <Status>{exam?.isLoggedUserDone ? "Completed" : "Not Completed"}</Status>
          
        </> 
      ):(<>
        {user.isTeacher && exam?.test?.classId && exam?.test?.isShared ? (<Status>Shared</Status>):(<>{exam?.test?.classId == null ? (<></>) : (<><Status>Not Shared</Status></>)}</>)}
      </>)}
    </div>
  );
}
