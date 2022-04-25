import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditTask({openEditTaskModal, setOpenEditTaskModal, selectedTask, setTaskInfo}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [taskName, setTaskName] = useState('')
	const [instructions, setInstructions] = useState('')
  
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = e => {
    e.preventDefault()
    setOpenEditTaskModal(false)
  }

	const saveEditTask = async(e) => {
    e.preventDefault()
    setLoading(true)
    let response = await new CoursesAPI().editTask(
      selectedTask?.id,
      {taskName, instructions}
    )
    if(response.ok){
			handleCloseModal(e)
      notifyUpdateTask()
      getTaskInfo(null, sessionModule)
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

  const getTaskInfo = async(e, data) => {
    setLoading(true)
    let response = await new CoursesAPI().getTaskInformation(sessionModule)
    setLoading(false)
    if(response.ok){
      setTaskInfo(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all task")
    }
  }

	useEffect(() => {
  }, [])

  useEffect(() => {
    if(selectedTask !== null) {
			setTaskName(selectedTask?.taskName)
			setInstructions(selectedTask?.instructions)
		}
  }, [selectedTask])

  const notifyUpdateTask = () => 
  toast.success('Task Updated!', {
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
			<Modal size="lg" className="modal-all" show={openEditTaskModal} onHide={()=> setOpenEditTaskModal(!openEditTaskModal)} >
				<Modal.Header className="modal-header" closeButton>
				Edit Task
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveEditTask}>
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Task Name
										</Form.Label>
										<Form.Control 
                      defaultValue={selectedTask?.taskName}
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter test name"
                      onChange={(e) => setTaskName(e.target.value)}
                    />
								</Form.Group>

								<Form.Group className="m-b-20">
										<Form.Label for="description">
												Instructions
										</Form.Label>
										<Form.Control 
                      defaultValue={selectedTask?.instructions}
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter test instructions"
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