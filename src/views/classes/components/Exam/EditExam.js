import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import ExamAPI from "../../../../api/ExamAPI";

export default function EditExam({
  showEditModal,
  setShowEditModal,
  onSubmit,
  id,
  exam,
  fetchExams,
  setLoading
}) {
  console.log({ exam });
  const [testInstructions, setTestInstructions] = useState(exam.test.testInstructions);
  const [testName, setTestName] = useState(exam.test.testName);

  useEffect(()=> {
    setTestInstructions(exam.test?.testInstructions)
    setTestName(exam.test?.testName)
  }, [])
  
  const updateExam = async(e) => {
    e.preventDefault();
    setLoading(true)
    const data = {
      isShared: false,
      testInstructions,
      testName,
    }
    console.log({data})
    let response = await new ExamAPI().updateExam(exam.test.id, data)
    if(response.ok){
      toast.success("Successfully updated the exam!")
      setShowEditModal(false)
      fetchExams()
    }else{
      toast.error(response?.data?.errorMessage || "Something went wrong while updating the exam")
      setLoading(false)
    }
  }

  return (
    <Modal
      size='lg'
      className='modal-all'
      show={showEditModal}
      onHide={() => setShowEditModal(false)}
    >
      <Modal.Header className='modal-header' closeButton>
        Edit Exam
      </Modal.Header>
      <Modal.Body className='modal-label b-0px'>
        <Form onSubmit={updateExam}>
          <Form.Group className='m-b-20'>
            <Form.Label for='courseName'>Exam Name</Form.Label>
            <Form.Control
              // defaultValue={testName}
              className='custom-input'
              value={testName}
              size='lg'
              type='text'
              placeholder='Enter exam name'
              onChange={(e) => setTestName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='m-b-20'>
            <Form.Label for='courseName'>Exam Instruction</Form.Label>
            <Form.Control
              // defaultValue={testInstructions}
              className='custom-input'
              value={testInstructions}
              size='lg'
              type='text'
              placeholder='Enter exam instruction'
              onChange={(e) => setTestInstructions(e.target.value)}
            />
          </Form.Group>
          <span style={{ float: "right" }}>
            <Button className='tficolorbg-button' type='submit'>
              Update Exam
            </Button>
          </span>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
