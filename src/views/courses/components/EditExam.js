import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";

export default function EditExam({openEditExamModal, setOpenEditExamModal, selectedExam}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [testName, setTestName] = useState('')
	const [testInstructions, setTestInstructions] = useState('')
  
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = e => {
    e.preventDefault()
    setOpenEditExamModal(false)
  }

	const saveEditExam = async(e) => {
    e.preventDefault()
    setLoading(true)
    let response = await new CoursesAPI().editExam(
      sessionModule,
      {testName, testInstructions}
    )
    if(response.ok){
      alert("Saved")
			handleCloseModal(e)
    }else{
      alert(response.data.errorMessage)
    }
    setLoading(false)
  }

  const getCourseUnitPages = async(e, data, data1) => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseUnitPages(sessionCourse, sessionModule)
    setLoading(false)
    if(response.ok){
      setModulePages(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all pages")
    }
  }

	useEffect(() => {
  }, [])

  useEffect(() => {
    if(selectedExam !== null) {
			setTestName(selectedExam?.testName)
			setTestInstructions(selectedExam?.testInstructions)
		}
  }, [selectedExam])

	return (
		<div>
			<Modal size="lg" className="modal-all" show={openEditExamModal} onHide={()=> setOpenEditExamModal(!openEditExamModal)} >
				<Modal.Header className="modal-header" closeButton>
				Edit Exam
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveEditExam}>
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Test Name
										</Form.Label>
										<Form.Control 
                      defaultValue={selectedExam?.testName}
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter test name"
                      onChange={(e) => setTestName(e.target.value)}
                    />
								</Form.Group>

								<Form.Group className="m-b-20">
										<Form.Label for="description">
												Test Instructions
										</Form.Label>
										<Form.Control 
                      defaultValue={selectedExam?.testInstructions}
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter test instructions"
                      onChange={(e) => setTestInstructions(e.target.value)}
                    />
								</Form.Group>

								<span style={{float:"right"}}>
										<Button className="tficolorbg-button" type="submit">
												Save
										</Button>
								</span>
						</Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}