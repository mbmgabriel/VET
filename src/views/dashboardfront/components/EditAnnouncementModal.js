import React, {useState, useEffect, useContext} from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import SubjectAreaAPI from "../../../api/SubjectAreaAPI";
import { UserContext } from './../../../context/UserContext'
import { toast } from 'react-toastify';
import AnnouncementAPI from '../../../api/AnnouncementAPI';

export default function EditAnnouncement({getMyAnnouncement, title, setTitle, content, setContent, announcementId, openEditAnnoncementModal, setOpenEditAnnouncementModal}){

  const editAnnouncement = async(e) => {
    e.preventDefault()
    let response = await new AnnouncementAPI().updateAnnouncement(announcementId, {title, content})
      if(response.ok){
        successEdit()
        setTitle('')
        setContent('')
        getMyAnnouncement()
        setOpenEditAnnouncementModal(false)
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
  }

  const successEdit = () => {
		toast.success('Successfully updated announcement', {
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
			<Modal size="lg" className="modal-all" show={openEditAnnoncementModal} onHide={()=> setOpenEditAnnouncementModal(!setOpenEditAnnouncementModal)} >
				<Modal.Header className="modal-header" closeButton>
				Edit an Announcement 
				</Modal.Header>
					<Modal.Body className="modal-label b-0px">
						<Form onSubmit={editAnnouncement}>
						{/* <Form.Group className="m-b-20">
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
						</Form.Group> */}
						{' '}
								
						<Form.Group className="m-b-20">
								<Form.Label for="courseName">
										Title
								</Form.Label>
								<Form.Control 
                  defaultValue={title}
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
								<Form.Control 
									className="custom-input" 
                  defaultValue={content}
									size="lg" 
									type="text" 
									as="textarea"
									rows={4}
									placeholder="Enter announcement content here"
									onChange={(e) => setContent(e.target.value)}
								/>
						</Form.Group>
						{' '}
						<span style={{float:"right"}}>
							<Button className="tficolorbg-button" type="submit">
                Update Announcement
							</Button>
						</span>
					</Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}