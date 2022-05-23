import React, {useState, useEffect, useContext} from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import SubjectAreaAPI from "../../../api/SubjectAreaAPI";
import { UserContext } from './../../../context/UserContext'
import { toast } from 'react-toastify';

export default function CreateAnnouncement({setOpenCreateAnnouncementModal, openCreateAnnouncementModal}){

	const [loading, setLoading] = useState(false)
	const [type, setType] = useState('')
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const userContext = useContext(UserContext)
  const {user} = userContext.data

	const handleCloseModal = e => {
    e.preventDefault()
    setOpenCreateAnnouncementModal(false)
  }


	const saveAnnouncement = async(e) => {
    e.preventDefault()
		if(title === ''){
			toast.error('Please insert all the required fields', {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				});
		}else{
			setLoading(true)
			let isTechFactors = user.role !== "Teacher" && true
			let response = await new CoursesAPI().createCourse(
				{title, content}
			)
			if(response.ok){
			successSave()
			handleCloseModal(e)
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
  }

	const successSave = () => {
		toast.success('Successfully created course', {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			});

	}

	return (
		<div>
			<Modal size="lg" className="modal-all" show={openCreateAnnouncementModal} onHide={()=> setOpenCreateAnnouncementModal(!setOpenCreateAnnouncementModal)} >
				<Modal.Header className="modal-header" closeButton>
				Create an Announcement 
				</Modal.Header>
					<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveAnnouncement}>
						<Form.Group className="m-b-20">
							<Form.Label for="subjectArea">
									Type
							</Form.Label>
							<Form.Select size="lg" onChange={(e) => setType(e.target.value)}>
								<option>
									Select type...
								</option>
								<option value={0}>
									Admin 
								</option>
								<option value={1}> 
									Teacher
								</option>
								<option value={2}> 
									Student
								</option>
								<option value={3}> 
									Class
								</option>
							</Form.Select>
						</Form.Group>
						{' '}
								
						<Form.Group className="m-b-20">
								<Form.Label for="courseName">
										Title
								</Form.Label>
								<Form.Control 
									className="custom-input" 
									size="lg" 
									type="text" 
									placeholder="Enter course name here"
									onChange={(e) => setTitle(e.target.value)}
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
									placeholder="Enter course description here"
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