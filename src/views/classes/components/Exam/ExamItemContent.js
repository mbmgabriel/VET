import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import ContentViewer from "../../../../components/content_field/ContentViewer";

export default function ExamItemContent({
  id,
  user,
  exam,
  startDate,
  endDate,
}) {
  console.log(user.isStudent, 'sampleeee')
  return (
    <>
      <Link
        to={
          user.isStudent
            ? `/classExam/${id}/exam/${exam.test.id}`
            : `/class/${id}/exam/${exam.test.id}?class_id=${id}&${exam.test.classId == null && 'not_editable=true'}`
        }
        className='exam-title'
      >
       <span dangerouslySetInnerHTML={{__html:exam.test.testName }} /> 
      </Link>
      <ContentViewer className='mb-2'>{exam.test.testInstructions}</ContentViewer>
      <b><p style={{fontSize: '16px'}} className='exam-course-name'>{exam.module?.moduleName}</p></b>
      {/* <p className='exam-instruction 'dangerouslySetInnerHTML={{__html:exam.test.testInstructions }} /> */}
      {startDate && (
        <p className='exam-instruction m-0'>
          <span className='d-inline-block' style={{ width: 40 }}>
            Start:
          </span>
          <b>{moment(startDate).format("MMMM Do YYYY, h:mm:ss a")}</b>
        </p>
        
      )}
      {endDate && (
        <p className='exam-instruction m-0 mb-3'>
          <span className='d-inline-block' style={{ width: 40 }}>
            End:
          </span>
          <b>{moment(endDate).format("MMMM Do YYYY, h:mm:ss a")}</b>
        </p>
      )}
    </>
  );
}
