import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContentField from "../../../components/content_field/ContentField";
import FileHeader from "./AssignmentFileHeader";
import FilesAPI from '../../../api/FilesApi'
import { useParams } from "react-router-dom";
import CourseFileLibrary from './CourseFileLibrary';

export default function EditAssignment({setSequenceNo, sequenceNo, rate, setRate, setInstructions, setAssignmentName, assignmentId, instructions, assignmentName, openEditAssignmentModal, setOpenEditAssignmentModal, selectedAssignment, setAssignmentInfo}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
  const {id} = useParams()
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = e => {
    e.preventDefault()
    setOpenEditAssignmentModal(false)
  }

	const saveEditAssignment = async(e) => {
    e.preventDefault()
    setLoading(true)
    if(rate <= 0){
      toast.error('Rate must be greater than to 0.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }else if (sequenceNo === null || sequenceNo === '') {
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
      let response = await new CoursesAPI().editAssignment(
        assignmentId,
        {assignmentName, instructions, rate, sequenceNo}
      )
      if(response.ok){
        handleCloseModal(e)
        notifyUpdateAssignment()
        getAssignmentInfo(sessionModule)
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

  const getAssignmentInfo = async(e, data) => {
    setLoading(true)
    let response = await new CoursesAPI().getAssignmentInformation(sessionModule)
    setLoading(false)
    if(response.ok){
      setAssignmentInfo(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all assignment")
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

	useEffect(() => {
  }, [])

  // useEffect(() => {
  //   if(selectedAssignment !== null) {
	// 		setAssignmentName(selectedAssignment?.assignmentName)
	// 		setInstructions(selectedAssignment?.instructions)
	// 	}
  // }, [selectedAssignment])

  console.log('selectedAssignment:', selectedAssignment)

  const notifyUpdateAssignment = () => 
  toast.success('Successfully updated assignment!', {
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
      alert("Something went wrong while fetching class files1111111111.")
    }
  }

	return (
		<div>
			<Modal size="lg" className="modal-all" show={openEditAssignmentModal} onHide={()=> setOpenEditAssignmentModal(!openEditAssignmentModal)} >
				<Modal.Header className="modal-header" closeButton>
				Edit Assignment
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
          <Form onSubmit={saveEditAssignment}>
            <div className={showFiles ? 'mb-3' : 'd-none'}>
              <CourseFileLibrary />
            </div>
            <Form.Group className="m-b-20">
                <Form.Label for="courseName">
                    Assignment Name
                </Form.Label>
                <Form.Control 
                  defaultValue={assignmentName}
                  className="custom-input" 
                  size="lg" 
                  type="text" 
                  placeholder="Edit Assignment Name"
                  onChange={(e) => setAssignmentName(e.target.value)}
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
              <Form.Group className="m-b-20">
                  <Form.Label for="courseName">
                      Sequence no.
                  </Form.Label>
                  <Form.Control 
                    defaultValue={sequenceNo}
                    className="custom-input" 
                    size="lg" 
                    type="number" 
                    placeholder="Enter Sequence no."
                    // min="0"
                    // step="1" 
                    onChange={(e) => setSequenceNo(e.target.value)}
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
                <Button className="tficolorbg-button" type="submit">
                    Update Assignment
                </Button>
            </span>
          </Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}