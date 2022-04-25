import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import SubjectAreaAPI from "../../../api/SubjectAreaAPI";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateDiscussion({openCreateDiscussionModal, setOpenCreateDiscussionModal, setDiscussionInfo}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [discussionName, setDiscussionName] = useState('')
	const [instructions, setInstructions] = useState('')
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = e => {
    e.preventDefault()
    setOpenCreateDiscussionModal(false)
  }

	const saveDiscussion = async(e) => {
    e.preventDefault()
    setLoading(true)
    let response = await new CoursesAPI().createDiscussion(
      sessionModule,
      {discussionName, instructions}
    )
    if(response.ok){
      notifySaveDiscussion()
			handleCloseModal(e)
      getDiscussionInfo()
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

  const getDiscussionInfo = async(e, data) => {
    setLoading(true)
    // sessionStorage.setItem('moduleid', data)
    let response = await new CoursesAPI().getDiscussionInformation(sessionModule)
    setLoading(false)
    if(response.ok){
      setDiscussionInfo(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all discussion")
    }
  }

  const notifySaveDiscussion = () => 
  toast.success('Discussion Saved!', {
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
			<Modal size="lg" className="modal-all" show={openCreateDiscussionModal} onHide={()=> setOpenCreateDiscussionModal(!openCreateDiscussionModal)} >
				<Modal.Header className="modal-header" closeButton>
				Create discussion
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveDiscussion}>
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Discussion Name
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter discussion name"
                      onChange={(e) => setDiscussionName(e.target.value)}
                    />
								</Form.Group>

								<Form.Group className="m-b-20">
										<Form.Label for="description">
												Instructions
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter discussion instructions"
                      onChange={(e) => setInstructions(e.target.value)}
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