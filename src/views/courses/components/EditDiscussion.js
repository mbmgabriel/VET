import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditDiscussion({setDiscussionInfo, openEditDiscussionModal, setOpenEditDiscussionModal, selectedDiscussion}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [discussionName, setDiscussionName] = useState('')
	const [instructions, setInstructions] = useState('')
  
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = e => {
    e.preventDefault()
    setOpenEditDiscussionModal(false)
  }

	const saveEditDiscussion = async(e) => {
    e.preventDefault()
    setLoading(true)
    let response = await new CoursesAPI().editDiscussion(
      selectedDiscussion?.discussion.id,
      {discussionName, instructions}
    )
    if(response.ok){
			handleCloseModal(e)
      notifyUpdateDiscussion()
      getDiscussionInfo(null, sessionModule)
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

  const getDiscussionInfo = async(e, data) => {
    setLoading(true)
    let response = await new CoursesAPI().getDiscussionInformation(data)
    setLoading(false)
    if(response.ok){
      setDiscussionInfo(response.data)
    }else{
      alert("Something went wrong while fetching all discussion")
    }
  }

	useEffect(() => {
  }, [])

  useEffect(() => {
    if(selectedDiscussion !== null) {
			setDiscussionName(selectedDiscussion?.discussion.discussionName)
			setInstructions(selectedDiscussion?.discussion.instructions)
		}
  }, [selectedDiscussion])

  const notifyUpdateDiscussion= () => 
  toast.success('Discussion Updated!', {
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
			<Modal size="lg" className="modal-all" show={openEditDiscussionModal} onHide={()=> setOpenEditDiscussionModal(!openEditDiscussionModal)} >
				<Modal.Header className="modal-header" closeButton>
				Edit Discussion
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveEditDiscussion}>
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Discussion Name
										</Form.Label>
										<Form.Control 
                      defaultValue={selectedDiscussion?.discussion.discussionName}
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Edit Discussion Name"
                      onChange={(e) => setDiscussionName(e.target.value)}
                    />
								</Form.Group>
								<Form.Group className="m-b-20">
										<Form.Label for="description">
												Instructions
										</Form.Label>
										<Form.Control 
                      defaultValue={selectedDiscussion?.discussion.instructions}
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Edit Discussion Instructions"
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