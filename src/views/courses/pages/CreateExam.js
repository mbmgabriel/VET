import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import SubjectAreaAPI from "../../../api/SubjectAreaAPI";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClassCourseFileLibrary from "../../classes/components/ClassCourseFileLibrary";
import CourseFileLibrary from "../components/CourseFileLibrary";
import ContentField from "../../../components/content_field/ContentField";

export default function CreateExam({setCourse, openCreateExamModal, setOpenCreateExamModal, setExamInfo, examInfo}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [testName, setTestName] = useState('')
	const [testInstructions, setTestInstructions] = useState('')
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [showFiles, setShowFiles] = useState(false);
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = () => {

    setOpenCreateExamModal(false)
    setTestName('')
    setTestInstructions('')
    setShowFiles(false)
  }

	const saveExam = async(e) => {
    e.preventDefault()
    setIsButtonDisabled(true)
    setTimeout(()=> setIsButtonDisabled(false), 1000)
    setLoading(true)
    let response = await new CoursesAPI().createExam(
      sessionModule,
      {testName, testInstructions}
    )
    if(response.ok){
			handleCloseModal()
      notifySaveExam()
      getExamInfo()
    }else{
      // alert(response.data.errorMessage)
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

  const getExamInfo = async(e, data) => {
    setLoading(true)
    sessionStorage.setItem('moduleid', data)
    let response = await new CoursesAPI().getExamInformation(sessionModule)
    setLoading(false)
    if(response.ok){
      setExamInfo(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching exam information")
    }
  }

  const notifySaveExam = () => 
  toast.success('Successfully created the exam', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

	useEffect(() => {
  }, [])

	return (
		<div>
			<Modal size="lg" className="modal-all" show={openCreateExamModal} onHide={()=> handleCloseModal()} >
				<Modal.Header className="modal-header" closeButton>
				Create Exam
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveExam}>
            <div className={showFiles ? 'mb-3' : 'd-none'}>
                <CourseFileLibrary />
              </div>
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Exam Name
										</Form.Label>
										<Form.Control 
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
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter exam instructions"
                      onChange={(e) => setTestInstructions(e.target.value)}
                    /> */}
                    <ContentField value={testInstructions}  placeholder='Enter instruction here'  onChange={value => setTestInstructions(value)} />
								</Form.Group>

								<span style={{float:"right"}}>
										<Button disabled={isButtonDisabled} className="tficolorbg-button" type="submit">
												Save Exam
										</Button>
								</span>
						</Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}