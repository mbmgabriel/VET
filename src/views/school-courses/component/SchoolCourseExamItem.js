import React, { useState, useEffect } from 'react'
import ExamAPI from '../../../api/ExamAPI'
import getStartAndEndDateFromClassTest from '../../../utils/getStartAndEndDateFromClassTest';
import { useContext } from "react";
import ExamStatuses from '../../classes/components/Exam/ExamStatuses';
import { UserContext } from '../../../context/UserContext';
import { Accordion } from "react-bootstrap";
import { displayQuestionType } from '../../../utils/displayQuestionType';
import Questions from '../../exam-creation/components/questions/Questions';

function SchoolCourseExamItem({examId}) {
  const [exam, setExam] = useState([])
  const userContext = useContext(UserContext);
  const { user } = userContext.data;
  const { startDate, endDate } = getStartAndEndDateFromClassTest(exam);

  const getExamInformation = async () =>{
    let response = await new ExamAPI().getExamInformation(examId)
      if(response.ok){
        setExam(response.data)
      }
  }

  useEffect(() => {
    if(examId !== null){
      return(
        getExamInformation() 
      )
    }  
  }, [])

  const arrageAlphabetical = (data) => {
    let temp = Object.values(data).sort(function(a, b){
      let nameA = displayQuestionType(a.questionPart.questionTypeId).toLocaleLowerCase();
      let nameB = displayQuestionType(b.questionPart.questionTypeId).toLocaleLowerCase();
      if(nameA < nameB)
        return -1
    });
    return temp;
  }

  console.log('examItem:', exam)

  return (
    <>
    <div className='d-flex justify-content-between '>
    <div>
      <p style={{ fontSize: 36, color: "#707070", margin: 0 }}>
        Exam Information
      </p>
      <p className='primary-title' style={{ fontSize: 24 }}>
        {exam?.testName}
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
        // noAssigned={noAssigned}
      />
      <p className='secondary-title mb-2'>{`${exam.rawScore} Total Point(s)`}</p>
      <p className='secondary-title mb-2'>{`${exam.questionPartDto?.length} Total Part(s)`}</p>
    </div>
    <hr />
  </div>
        <Accordion>
          {exam.map((item, index)=>(
                    <Accordion.Item eventKey={index} key={index}>1
               <Accordion.Header>
                {item?.questionPartDto}
               </Accordion.Header>
               <Accordion.Body>
        
              </Accordion.Body>
           </Accordion.Item>
          ))}
  
        </Accordion>

  {/* <Accordion defaultActiveKey='0' className='exam-part-creation'>
      {arrageAlphabetical(exam?.questionPartDto).map((part, index) => (
        <Accordion.Item
          style={{ border: "1px solid #f1f1f1", padding: "8px 16px" }}
          eventKey={index}
          key={index}
        >1
          <Accordion.Header>
            <div className='accordion-block-header'>
              <div className='header-content'>
                <h3>{`${part.questionPart.instructions} `}</h3>
                <p>{displayQuestionType(part.questionPart.questionTypeId)}</p>
                <span>{`${part.questionDtos.length} Question(s)`}</span>
              </div>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <Questions
              part={part}
              getExamInformation={getExamInformation}
            />
          </Accordion.Body>
        </Accordion.Item>
      ))}
      {exam.questionPartDto.length == 0 && (
        <p>Exam parts will be displayed here...</p>
      )}
    </Accordion> */}
  </>
  
  )
}

export default SchoolCourseExamItem