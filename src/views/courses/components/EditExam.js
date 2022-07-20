import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContentField from "../../../components/content_field/ContentField";
import CourseFileLibrary from "./CourseFileLibrary";

export default function EditExam({examInfo, setExamInfo, openEditExamModal, setOpenEditExamModal, selectedExam}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [testName, setTestName] = useState('')
	const [testInstructions, setTestInstructions] = useState('')
  const [showFiles, setShowFiles] = useState(false);
  
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = () => {
    setOpenEditExamModal(false)
    setTestName('')
    setShowFiles(false)
  }

	const saveEditExam = async(e) => {
    e.preventDefault()
    setLoading(true)
    let response = await new CoursesAPI().editExam(
      selectedExam?.id,
      {testName, testInstructions}
    )
    if(response.ok){
			handleCloseModal()
      notifyUpdateExam()
      getExamInfo(null, sessionModule)
    }else{
      toast.error(response.data.errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
    setLoading(false)
  }

  const getExamInfo = async(e, data) => {
    setLoading(true)
    let response = await new CoursesAPI().getExamInformation(data)
    setLoading(false)
    if(response.ok){
      setExamInfo(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all exam")
    }
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

  const notifyUpdateExam = () => 
  toast.success('Successfully updated the exam!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

	return (
		<div>
			<Modal size="lg" className="modal-all" show={openEditExamModal} onHide={()=> handleCloseModal()} >
				<Modal.Header className="modal-header" closeButton>
				Edit Exam
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveEditExam}>
            <div className={showFiles ? 'mb-3' : 'd-none'}>
                <CourseFileLibrary />
              </div>
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Exam Name
										</Form.Label>
										<Form.Control 
                      defaultValue={selectedExam?.testName}
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter exam name"
                      onChange={(e) => setTestName(e.target.value)}
                    />
								</Form.Group>
                  <div>
                    <Button className='float-right my-2' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
                  </div>
								<Form.Group className="m-b-20">
										<Form.Label for="description">
												Exam Instructions
										</Form.Label>
										{/* <Form.Control 
                      defaultValue={selectedExam?.testInstructions}
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter exam instructions"
                      onChange={(e) => setTestInstructions(e.target.value)}
                    /> */}
                    <ContentField value={testInstructions}  placeholder='Enter instruction here'  onChange={value => setTestInstructions(value)} />
								</Form.Group>

								<span style={{float:"right"}}>
										<Button className="tficolorbg-button" type="submit">
												Update Exam
										</Button>
								</span>
						</Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}