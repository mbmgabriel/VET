import React, {useState, useEffect, useContext} from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import SubjectAreaAPI from "../../../api/SubjectAreaAPI";
import { UserContext } from './../../../context/UserContext'
import { toast } from 'react-toastify';
import AnnouncementAPI from '../../../api/AnnouncementAPI';
import ContentRichText from '../../../components/content_field/ContentRichText';
import AdminFileLibrary from '../../school-profile/components/AdminFileLibrary';

export default function CreateAnnouncement({getMyAnnouncement, setOpenCreateAnnouncementModal, openCreateAnnouncementModal}){

	const [loading, setLoading] = useState(false)
	const [typeId, setTypeId] = useState('')
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const userContext = useContext(UserContext)
	const [showFiles, setShowFiles] = useState(false);
	const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const {user} = userContext.data

	// const handleCloseModal = e => {
  //   e.preventDefault()
  //   setOpenCreateAnnouncementModal(false)
  // }


	const saveAnnouncement = async(e) => {
    e.preventDefault()
		setIsButtonDisabled(true)
    setTimeout(()=> setIsButtonDisabled(false), 1000)
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
			
			// let isTechFactors = user.role !== "Teacher" && true
			let response = await new AnnouncementAPI().createAnnouncementForClasses(typeId, 
				{title, content}
			)
			if(response.ok){
			successSave()
			closeModal()
			getMyAnnouncement()
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
		toast.success('Successfully created announcement', {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			});
	}

	const closeModal = ()=>{
		setOpenCreateAnnouncementModal(false)
		setContent('')
		setTitle('')
		setTypeId('')
		setShowFiles(false)
	} 

	return (
		<div>
			<Modal size="lg" className="modal-all" show={openCreateAnnouncementModal} onHide={()=> closeModal()} >
				<Modal.Header className="modal-header" closeButton>
				Create an Announcement 
				</Modal.Header>
					<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveAnnouncement}>
						<div className={showFiles ? 'mb-3' : 'd-none'}>
							<AdminFileLibrary />
						</div>
						<Form.Group className="m-b-20">
							<Form.Label for="subjectArea">
									Type
							</Form.Label>
							<Form.Select size="lg" onChange={(e) => setTypeId(e.target.value)}>
								<option>
									Select type...
								</option>
								<option value={1}>
									All teacher
								</option>
								<option value={2}> 
									All student
								</option>
								<option value={0}> 
									All
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
									placeholder="Enter title announcement here"
									onChange={(e) => setTitle(e.target.value)}
								/>
						</Form.Group>
						{' '}

						<Form.Group className="m-b-20">
								<Form.Label for="description">
								Content
								</Form.Label>
								<ContentRichText value={content}  placeholder='Enter Announcement here'  onChange={value => setContent(value)} />
								{/* <Form.Control 
									className="custom-input" 
									size="lg" 
									type="text" 
									as="textarea"
									rows={4}
									placeholder="Enter announcement content here"
									onChange={(e) => setContent(e.target.value)}
								/> */}
						</Form.Group>
						{' '}

						<span style={{float:"right"}}>
							<Button className='tficolorbg-button tficolorbg-button' onClick={()=> setShowFiles(!showFiles)} >File Library</Button>&nbsp;
							<Button disabled={isButtonDisabled} className="tficolorbg-button" type="submit">
									Save Announcement
							</Button>
						</span>
					</Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}