import React, { useState, useEffect } from "react";
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import SubjectAreaAPI from "../../../api/SubjectAreaAPI";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilesAPI from '../../../api/FilesApi';
import FileHeader from './AssignmentFileHeader';
import { useParams } from 'react-router'
import ContentField from "../../../components/content_field/ContentField";
import CourseFileLibrary from "./CourseFileLibrary";

export default function CreateAssignment({openCreateAssignmentModal, setOpenCreateAssignmentModal, setAssignmentInfo}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [assignmentName, setAssignmentName] = useState('')
	const [instructions, setInstructions] = useState('')
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const {id} = useParams();
  const [displayFolder, setDisplayFolder] = useState([])
  const [breedCrumbsItemClass, setBreedCrumbsItemClass] = useState([])
  const subFolderDirectory = breedCrumbsItemClass.map(item => { return `/${item.value}`}) //to get sub directory based on breedcrumbs

	const handleCloseModal = e => {
    setAssignmentName('')
    setInstructions('')
    setOpenCreateAssignmentModal(false)
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

	const saveAssignmennt = async(e) => {
    e.preventDefault()
    setIsButtonDisabled(true)
    setTimeout(()=> setIsButtonDisabled(false), 1000)
    setLoading(true)
    let response = await new CoursesAPI().createAssignment(
      sessionModule,
      {assignmentName, instructions}
    )
    if(response.ok){
			handleCloseModal(e)
      getAssignmentInfo(sessionModule)
      notifySaveAssignment()
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

  const notifySaveAssignment = () => 
  toast.success('Successfully saved assignment!', {
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
			<Modal size="lg" className="modal-all" show={openCreateAssignmentModal} onHide={()=> handleCloseModal()} >
				<Modal.Header className="modal-header" closeButton>
				Create Assignment
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
          <div className={showFiles ? 'mb-3' : 'd-none'}>
            <CourseFileLibrary />
          </div>
						<Form onSubmit={saveAssignmennt}>
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Assignment Name
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter Assignment Name"
                      onChange={(e) => setAssignmentName(e.target.value)}
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
												Save Assignment
										</Button>
								</span>
						</Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}