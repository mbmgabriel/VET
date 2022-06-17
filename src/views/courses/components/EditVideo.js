import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditVideos({setVideoInfo, openEditVideoModal, setOpenEditVideoModal, selectedVideo}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [title, setTitle] = useState('')
	const [sequenceNo, setSequenceNo] = useState('')
  
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = e => {
    e.preventDefault()
    setOpenEditVideoModal(false)
  }

	const saveEditVideo = async(e) => {
    e.preventDefault()
    setLoading(true)
    let response = await new CoursesAPI().editVideo(
      selectedVideo?.id,
      {title, sequenceNo}
    )
    if(response.ok){
			handleCloseModal(e)
      notifyUpdateVideo()
      getVideoInfo(null, sessionModule)
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

  const getVideoInfo = async(e, data) => {
    setLoading(true)
    let response = await new CoursesAPI().getVideoInformation(data)
    setLoading(false)
    if(response.ok){
      setVideoInfo(response.data)
    }else{
      alert("Something went wrong while fetching all discussion")
    }
  }

	useEffect(() => {
  }, [])

  useEffect(() => {
    if(selectedVideo !== null) {
			setTitle(selectedVideo?.title)
			setSequenceNo(selectedVideo?.sequenceNo)
		}
  }, [selectedVideo])

  const notifyUpdateVideo= () => 
  toast.success('Video Updated!', {
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
			<Modal size="lg" className="modal-all" show={openEditVideoModal} onHide={()=> setOpenEditVideoModal(!openEditVideoModal)} >
				<Modal.Header className="modal-header" closeButton>
				Edit Video Info
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveEditVideo}>
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Video Name
										</Form.Label>
										<Form.Control 
                      defaultValue={selectedVideo?.title}
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter video name"
                      onChange={(e) => setTitle(e.target.value)}
                    />
								</Form.Group>

								<Form.Group className="m-b-20">
										<Form.Label for="description">
												Sequence No
										</Form.Label>
										<Form.Control 
                      defaultValue={selectedVideo?.sequenceNo}
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter Sequence number"
                      onChange={(e) => setSequenceNo(e.target.value)}
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