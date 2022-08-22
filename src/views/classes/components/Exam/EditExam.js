import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import ExamAPI from "../../../../api/ExamAPI";
import ContentField from "../../../../components/content_field/ContentField";
import ClassCourseFileLibrary from "../ClassCourseFileLibrary";

export default function EditExam({
  showEditModal,
  setShowEditModal,
  onSubmit,
  id,
  exam,
  fetchExams,
  setLoading
}) {
  const [testInstructions, setTestInstructions] = useState(exam.test.testInstructions);
  const [testName, setTestName] = useState(exam.test.testName);
  const [sequenceNo, setSequenceNo] = useState(exam?.test?.sequenceNo)
  const [showFiles, setShowFiles] = useState(false);

  useEffect(()=> {
    setTestInstructions(exam.test?.testInstructions)
    setTestName(exam.test?.testName)
    setSequenceNo(exam?.test?.sequenceNo)
  }, [])
  
  const updateExam = async(e) => {
    e.preventDefault();
    if(sequenceNo === '' || sequenceNo === null){
      toast.error('Please input all the required fields.')
    }else{
      setLoading(true)
      const data = {
        isShared: false,
        testInstructions,
        testName,
        sequenceNo
      }
      let response = await new ExamAPI().updateExam(exam.test.id, data)
      if(response.ok){
        toast.success("Successfully updated the exam!")
        setShowEditModal(false)
        setShowFiles(false)
        fetchExams()
      }else{
        toast.error(response?.data?.errorMessage || 'Please input all the required fields.')
        setLoading(false)
      }
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
        <div className={showFiles ? 'mb-3' : 'd-none'}>
            <ClassCourseFileLibrary />
          </div>
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
          <Form.Group className="m-b-20">
            <Form.Label for="courseName">
                Sequence no.
            </Form.Label>
            <Form.Control 
              defaultValue={sequenceNo}
              className="custom-input" 
              size="lg" 
              type="number" 
              placeholder="Enter Sequence no."
              // min="0"
              // step="1" 
              onChange={(e) => setSequenceNo(e.target.value)}
            />
          </Form.Group>
            <div>
              <Button className='float-right my-2' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
            </div>
          <Form.Group className='m-b-20'>
            <Form.Label for='courseName'>Exam Instruction</Form.Label>
            {/* <Form.Control
              // defaultValue={testInstructions}
              className='custom-input'
              value={testInstructions}
              size='lg'
              type='text'
              placeholder='Enter exam instruction'
              onChange={(e) => setTestInstructions(e.target.value)}
            /> */}
            <ContentField withTextInput={true} value={testInstructions}  placeholder='Enter instruction here'  onChange={value => setTestInstructions(value)} />
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
