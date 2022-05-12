import React, { useState } from "react";
import { Accordion, Button } from "react-bootstrap";
import Status from "../../../components/utilities/Status";
import { integerToRoman } from "../../../utils/integerToRoman";
import QuestionInput from "./QuestionInput";
import SweetAlert from "react-bootstrap-sweetalert";

export default function ExamForm({
  exam,
  onAnswer,
  onSubmit,
  examStarted,
  submitPartsAnswer,
}) {
  const [showAlert, setShowAlert] = useState(false);

  if (exam == null) return <div />;
  if (!examStarted) return <div />;
  return (
    <div>
      {exam.questionPartDto.map((part, index) => (
        <Accordion defaultActiveKey={null} key={index}>
          <Accordion.Item eventKey='0'>
            <Accordion.Header>
              <div>
                <p className='primary-title' style={{ fontSize: 24 }}
                  dangerouslySetInnerHTML={{__html:part.questionPart.instructions }}
                />
                <p
                  className='secondary-title'
                  style={{ fontSize: 16 }}
                >{`${part.questionDtos.length} Question(s)`}</p>
                <Status>{part.isDone ? "Completed" : "Not Completed"}</Status>
              </div>
            </Accordion.Header>
            {!part.hidden && (
              <Accordion.Body>
              {part.questionDtos.map((question, index) => {
                return (
                  <QuestionInput
                    number={index + 1}
                    part={part}
                    question={question}
                    key={index}
                    onAnswer={onAnswer}
                    onSubmit={onSubmit}
                  />
                );
              })}
              {examStarted && !part.isDone && (
                <Button
                  className='btn btn-primary my-4 mx-3'
                  variant='primary'
                  size='lg'
                  onClick={() => submitPartsAnswer(part)}
                >
                  SUBMIT
                </Button>
              )}
            </Accordion.Body>
            )}
            
          </Accordion.Item>
        </Accordion>
      ))}
      <SweetAlert
        warning
        showCancel
        show={showAlert}
        confirmBtnText='Yes!'
        confirmBtnBsStyle='danger'
        cancelBtnBsStyle='light'
        title='Are you sure you want to end the exam?'
        onConfirm={(e) => {
          onSubmit();
          setShowAlert(false);
        }}
        onCancel={() => {
          setShowAlert(false);
        }}
        focusCancelBtn
      >
        All not submitted answers will be lost.
      </SweetAlert>
      {examStarted && (
        <Button
          className='btn btn-primary my-4 mx-3'
          variant='primary'
          size='lg'
          onClick={() => {
            setShowAlert(true);
          }}
        >
          END EXAM
        </Button>
      )}
    </div>
  );
}
