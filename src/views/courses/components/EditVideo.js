import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClassesAPI from "../../../api/ClassesAPI";

export default function EditVideos({ getVideoInfo, openEditVideoModal, setOpenEditVideoModal, selectedVideo}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [title, setTitle] = useState('')
	const [sequenceNo, setSequenceNo] = useState('')
  const [moduleId, setModuleId] = useState('')
  const [module, setModule] = useState([])
  
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = e => {
    e.preventDefault()
    setOpenEditVideoModal(false)
  }

  const getModule = async(sessionCourse) =>{
    let response = await new ClassesAPI().getModule(sessionCourse)
    if(response.ok){
        setModule(response.data)
    }else{
    }
  }

  useEffect(() => {
    getModule(sessionCourse)
  }, [])

	const saveEditVideo = async(e) => {
    e.preventDefault()
    setLoading(true)
    let response = await new CoursesAPI().editVideo(
      sessionCourse, selectedVideo?.id,
      {title, sequenceNo, moduleId}
    )
    if(response.ok){
			handleCloseModal(e)
      notifyUpdateVideo()
      getVideoInfo(sessionCourse, moduleId)
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

	useEffect(() => {
  }, [])

  useEffect(() => {
    if(selectedVideo !== null) {
			setTitle(selectedVideo?.title)
			setSequenceNo(selectedVideo?.sequenceNo)
      setModuleId(selectedVideo?.moduleId)
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

  console.log('selectedVideo:', selectedVideo)

	return (
		<div>
			<Modal size="lg" className="modal-all" show={openEditVideoModal} onHide={()=> setOpenEditVideoModal(!openEditVideoModal)} >
				<Modal.Header className="modal-header" closeButton>
				Edit Video Info
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveEditVideo}>
            <Form.Group className="mb-3">
          <Form.Label>Unit</Form.Label>
            <Form.Select defaultValue={selectedVideo?.moduleId} onChange={(e) => setModuleId(e.target.value)}>
                {module.map(item => {
                  return(<option value={item?.moduleId}>{item.moduleName}</option>)
                })}
            </Form.Select>
              </Form.Group>
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