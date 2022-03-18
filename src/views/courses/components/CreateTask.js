import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import SubjectAreaAPI from "../../../api/SubjectAreaAPI";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilesAPI from '../../../api/FilesApi';
import FileHeader from '../../files/FileHeader';
import { useParams } from "react-router";
export default function CreateTask({openCreateTaskModal, setCreateTaskModal, setTaskInfo}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [taskName, setTaskName] = useState('')
	const [instructions, setInstructions] = useState('')
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false)
  const {id} = useParams()
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = e => {
    e.preventDefault()
    setCreateTaskModal(false)
  }

	const saveTask = async(e) => {
    e.preventDefault()
    setLoading(true)
    let isShared = false
    let response = await new CoursesAPI().createTask(
      sessionModule,
      {taskName, instructions, isShared:false}
    )
    if(response.ok){
			handleCloseModal(e)
      getTaskInfo(sessionModule)
      notifySaveTask()
    }else{
      alert(response.data.errorMessage)
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

  const notifySaveTask = () => 
  toast.success('Task Saved!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  useEffect(() => {
    handleGetCourseFiles()
  }, [])

  const handleGetCourseFiles = async() => {
    // setLoading(true)
    let response = await new FilesAPI().getCourseFiles(id)
    // setLoading(false)
    if(response.ok){
      console.log(response, '-----------------------')
      setDisplayFiles(response.data)
    }else{
      alert("Something went wrong while fetching class files ----------.")
    }
  } 
	return (
		<div>
			<Modal size="lg" className="modal-all" show={openCreateTaskModal} onHide={()=> setCreateTaskModal(!openCreateTaskModal)} >
				<Modal.Header className="modal-header" closeButton>
				Create Task
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveTask}>
              <div className={showFiles ? 'mb-3' : 'd-none'}>
                <FileHeader type='Course' id={id} doneUpload={()=> handleGetCourseFiles()} />
                {
                  displayFiles.map( (item,ind) => {
                    return(
                      <img src={item.path_Base.replace('http:', 'https:')} className='p-1' alt={item.fileName} height={30} width={30}/>
                    )
                  })
                }
              </div>
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Task Name
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter Task name"
                      onChange={(e) => setTaskName(e.target.value)}
                    />
								</Form.Group>
                <div>
                  <Button className='float-right my-2' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
                </div>
								<Form.Group className="m-b-20">
										<Form.Label for="description">
												Instructions
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter Task instructions"
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