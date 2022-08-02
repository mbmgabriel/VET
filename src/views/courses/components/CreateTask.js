import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import SubjectAreaAPI from "../../../api/SubjectAreaAPI";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilesAPI from '../../../api/FilesApi';
import FileHeader from './AssignmentFileHeader';
import { useParams } from "react-router";
import ContentField from "../../../components/content_field/ContentField";
import CourseFileLibrary from "./CourseFileLibrary";

export default function CreateTask({openCreateTaskModal, setCreateTaskModal, setTaskInfo}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [taskName, setTaskName] = useState('')
	const [instructions, setInstructions] = useState('')
  const [rate, setRate] = useState(100)
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const {id} = useParams()

  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = () => {
    setCreateTaskModal(false)
    setTaskName('')
    setInstructions('')
    setRate(100)
  }

	const saveTask = async(e) => {
    e.preventDefault()
    if(rate === '') {
      toast.error('Please input all the required fields.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }else if(rate <= 0) {
            toast.error('Rate must be greater than to 0.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    } else{
      setIsButtonDisabled(true)
      setTimeout(()=> setIsButtonDisabled(false), 1000)
      setLoading(true)
      let isShared = false
      let response = await new CoursesAPI().createTask(
        sessionModule,
        {taskName, instructions, rate, isShared:false}
      )
      if(response.ok){
        handleCloseModal()
        getTaskInfo(sessionModule)
        notifySaveTask()
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
  toast.success('Successfully saved task!', {
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
      setDisplayFiles(response.data.files)
      setDisplayFolder(response.data.folders)
    }else{
      alert("Something went wrong while fetching class files111111111111111.")
    }
  } 
	return (
		<div>
			<Modal size="lg" className="modal-all" show={openCreateTaskModal} onHide={()=> handleCloseModal()} >
				<Modal.Header className="modal-header" closeButton>
				Create Task
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveTask}>
              <div className={showFiles ? 'mb-3' : 'd-none'}>
                <CourseFileLibrary />
              </div>
              <Form.Group className="m-b-20">
                  <Form.Label for="courseName">
                      Task Name
                  </Form.Label>
                  <Form.Control 
                    className="custom-input" 
                    size="lg" 
                    type="text" 
                    placeholder="Enter Task Name"
                    onChange={(e) => setTaskName(e.target.value)}
                  />
              </Form.Group>
              <Form.Group className="m-b-20">
                  <Form.Label for="courseName">
                      Rate
                  </Form.Label>
                  <Form.Control 
                    defaultValue={rate}
                    className="custom-input" 
                    size="lg" 
                    type="number" 
                    placeholder="Enter Rate"
                    // min="0"
                    // step="1" 
                    onChange={(e) => setRate(e.target.value)}
                  />
              </Form.Group>
              <div>
                <Button className='float-right my-2' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
              </div>
              <Form.Group className="m-b-20">
                  <Form.Label for="description">
                      Instructions
                  </Form.Label>
                    <ContentField value={instructions}  placeholder='Enter instruction here'  onChange={value => setInstructions(value)} />
              </Form.Group>

								<span style={{float:"right"}}>
										<Button disabled={isButtonDisabled} className="tficolorbg-button" type="submit">
												Save Task
										</Button>
								</span>
						</Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}