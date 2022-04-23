import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import SubjectAreaAPI from "../../../api/SubjectAreaAPI";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilesAPI from '../../../api/FilesApi';
import FileHeader from './AssignmentFileHeader';
import { useParams } from 'react-router'

export default function CreateAssignment({openCreateAssignmentModal, setOpenCreateAssignmentModal, setAssignmentInfo}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [assignmentName, setAssignmentName] = useState('')
	const [instructions, setInstructions] = useState('')
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false)
  const {id} = useParams();
  const [displayFolder, setDisplayFolder] = useState([])

	const handleCloseModal = e => {
    e.preventDefault()
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

  const notifySaveAssignment = () => 
  toast.success('Assignment Saved!', {
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
    let data = {
      "subFolderLocation": ''
    }
    let response = await new FilesAPI().getCourseFiles(id, data)
    // setLoading(false)
    if(response.ok){
      console.log(response, '-----------------------')
      setDisplayFiles(response.data.files)
      setDisplayFolder(response.data.folders)
    }else{
      alert("Something went wrong while fetching class files ,,,.")
    }
  } 

	return (
		<div>
			<Modal size="lg" className="modal-all" show={openCreateAssignmentModal} onHide={()=> setOpenCreateAssignmentModal(!openCreateAssignmentModal)} >
				<Modal.Header className="modal-header" closeButton>
				Create Assignment
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
          <div className={showFiles ? 'mb-3' : 'd-none'}>
              <FileHeader type={'Course'} title='Files' id={id} subFolder={''} doneUpload={()=> handleGetCourseFiles()}/>
              {/* {
               (displayFiles || []).map( (item,ind) => {
                  return(
                    <img key={ind+item.filename} src={item.pathBase.replace('http:', 'https:')} className='p-1' alt={item.fileName} height={30} width={30}/>
                  )
                })
              } */}
              {
               (displayFiles || []).map( (item,ind) => {
                  return(
                    item.pathBase?.match(/.(jpg|jpeg|png|gif|pdf)$/i) ? 
                    <img key={ind+item.filename} src={item.pathBase.replace('http:', 'https:')} className='p-1' alt={item.name} height={30} width={30}/>
                    :
                    <i className="fas fa-sticky-note" style={{paddingRight: 5}}/>
                  )
                })
              }
              {
                (displayFolder || []).map((itm) => {
                  return(
                    <i className='fas fa-folder-open' style={{height: 30, width: 30}}/>
                  )
                })
              }
            </div>
            <div className='text-align-right'>
              <Button className='my-2' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
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
                      placeholder="Enter assignment name"
                      onChange={(e) => setAssignmentName(e.target.value)}
                    />
								</Form.Group>

								<Form.Group className="m-b-20">
										<Form.Label for="description">
												Instructions
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter assignment instructions"
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