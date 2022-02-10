import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

export default function ExamItemContent({
  id,
  user,
  exam,
  startDate,
  endDate,
}) {


  return (
    <>
      <Link
        to={
          user.isStudent
            ? `/class/${id}/exam/${exam.test.id}`
            : `/exam_creation/${exam.test.id}?class_id=${id}`
        }
        className='exam-title'
      >
        {exam.test.testName}
      </Link>
      <p className='exam-course-name'>{exam.module?.moduleName}</p>
      <p className='exam-instruction '>{exam.test.testInstructions}</p>
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
