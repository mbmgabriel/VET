import React, { useState } from "react";
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'
import CoursesAPI from "../../../api/CoursesAPI";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateLesson({openCreateLessonModal, setCreateLessonModal, setLessonInfo}){

	const [loading, setLoading] = useState(false)
	const [pageName, setPageName] = useState('')
	const [sequenceNo, setSequenceNo] = useState('')
	const [content, setContent] = useState('')

  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = e => {
    e.preventDefault()
    setCreateLessonModal(false)
  }

  const getCourseLessons = async(e, data, modulename) => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseUnitPages(sessionCourse, sessionModule)
    setLoading(false)
    if(response.ok){
      setLessonInfo(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all pages")
    }
  }

	const saveLesson = async(e) => {
    e.preventDefault()
    setLoading(true)
    let response = await new CoursesAPI().createLesson(
      sessionCourse,
      sessionStorage.getItem('moduleid'),
      {pageName, sequenceNo, content}
    )
    if(response.ok){
			handleCloseModal(e)
      notifySaveLesson()
      getCourseLessons(sessionCourse, sessionModule)
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

  const notifySaveLesson = () => 
  toast.success('Lesson Saved!', {
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
			<Modal size="lg" className="modal-all" show={openCreateLessonModal} onHide={()=> setCreateLessonModal(!openCreateLessonModal)} >
				<Modal.Header className="modal-header" closeButton>
				Create Lesson / Page
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveLesson}>
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Page Name
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter lesson name"
                      onChange={(e) => setPageName(e.target.value)}
                    />
								</Form.Group>
                {' '}

								<Form.Group className="m-b-20">
										<Form.Label for="description">
												Sequence Number
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="number" 
                      placeholder="Enter sequence number"
                      onChange={(e) => setSequenceNo(e.target.value)}
                    />
								</Form.Group>
                {' '}

                <Form.Group className="m-b-20">
										<Form.Label for="description">
												Content
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter lesson content"
                      onChange={(e) => setContent(e.target.value)}
                    />
								</Form.Group>
                {' '}
    
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