import React, { useState, useEffect } from "react";
import { Accordion, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import { displayQuestionType } from "../../../utils/displayQuestionType";
import { useContext } from "react";
import Questions from "./questions/Questions";
import { UserContext } from "../../../context/UserContext";
import CoursesAPI from "../../../api/CoursesAPI";

export default function ExamParts({
  exam,
  deletePart,
  getExamInformation,
  setLoading,
  setSelectedPart,
  setShowModal,
  editable
}) {
  console.log({exam});
  const [selectedId, setSelectedId] = useState(null)
  const [showWarning, setShowWarning] = useState(false)
  const userContext = useContext(UserContext);
  const { user } = userContext.data;
  const [courseInfo, setCourseInfo] = useState("")
  

  const courseid = sessionStorage.getItem('courseid')

  const getCourseInformation = async() => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseInformation(courseid)
    setLoading(false)
    if(response.ok){
      setCourseInfo(response.data)
    }else{
      alert("Something went wrong while fetching course information")
    }
  }

  useEffect(() => {
    if(courseid != null){
      getCourseInformation();
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

  const renderTooltipEdit = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit
    </Tooltip>
  )

  const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete
    </Tooltip>
  )

  return (
    <Accordion title=""  defaultActiveKey='0' className='exam-part-creation'>
      <SweetAlert
        warning
        showCancel
        show={showWarning}
        confirmBtnText='Yes, delete it!'
        confirmBtnBsStyle='danger'
        title='Are you sure?'
        onConfirm={async (e) => {
          await deletePart(e, selectedId);
          setShowWarning(false);
        }}
        onCancel={() => setShowWarning(false)}
        focusCancelBtn
      >
        You will not be able to recover this exam!
      </SweetAlert>
      {arrageAlphabetical(exam.questionPartDto).map((part, index) => (
        <Accordion.Item
          style={{ border: "1px solid #f1f1f1", padding: "8px 16px" }}
          eventKey={index}
          key={index}
        >
          <Accordion.Header title="">
            <div className='accordion-block-header'>
              <div className='header-content'>
                <h3 dangerouslySetInnerHTML={{__html:part.questionPart.instructions }} title='' />
                <p title=''>{displayQuestionType(part.questionPart.questionTypeId)} </p>
                <span title=''>{`${part.questionDtos.length} Question(s)`}</span>
              </div>
            </div>
            {/* {courseInfo?.isTechfactors? (<></>):(<>

            </>)} */}
            {user?.isTeacher &&
            <>  
              {editable && (
                <div className='exam-actions' >
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 0, hide: 0 }}
                    overlay={renderTooltipEdit}>
                  <a
                    href='#edit-part'
                    onClick={(e) => {
                      setShowModal(true);
                      setSelectedPart(part);
                    }}
                  >
                    <i class='fas fa-edit' title=""></i>
                  </a>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 0, hide: 0 }}
                    overlay={renderTooltipDelete}>
                  <a href='#delete-part' onClick={(e) => {
                    setShowWarning(true)
                    setSelectedId(part)
                  }}>
                    <i class='fas fa-trash-alt' title=""></i>
                  </a>
                  </OverlayTrigger>
                </div>
              )}
            </>
            }
           
         
          </Accordion.Header>
          <Accordion.Body>
            <Questions
              examName={exam.test?.testName}
              part={part}
              getExamInformation={getExamInformation}
              setLoading={setLoading}
              editable={editable}
            />
          </Accordion.Body>
        </Accordion.Item>
      ))}
      {exam.questionPartDto.length == 0 && (
        <p>Exam parts will be displayed here...</p>
      )}
    </Accordion>
  );
}
