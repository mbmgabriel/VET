import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContentField from "../../../components/content_field/ContentField";
import FileHeader from "./AssignmentFileHeader";
import FilesAPI from '../../../api/FilesApi'

export default function EditAssignment({openEditAssignmentModal, setOpenEditAssignmentModal, selectedAssignment, setAssignmentInfo}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [assignmentName, setAssignmentName] = useState('')
	const [instructions, setInstructions] = useState('')
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = e => {
    e.preventDefault()
    setOpenEditAssignmentModal(false)
  }

	const saveEditAssignment = async(e) => {
    e.preventDefault()
    setLoading(true)
    let response = await new CoursesAPI().editAssignment(
      selectedAssignment?.id,
      {assignmentName, instructions}
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

  useEffect(() => {
    if(selectedAssignment !== null) {
			setAssignmentName(selectedAssignment?.assignmentName)
			setInstructions(selectedAssignment?.instructions)
		}
  }, [selectedAssignment])

  const notifyUpdateAssignment = () => 
  toast.success('Assignment Updated!', {
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
    let response = await new FilesAPI().getCourseFiles(sessionCourse)
    // setLoading(false)
    if(response.ok){
      console.log(response, '-----------------------')
      setDisplayFiles(response.data.files)
      setDisplayFolder(response.data.folders)
    }else{
      alert("Something went wrong while fetching class files.")
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
              <FileHeader type={'Course'} title='Files' id={sessionCourse} subFolder={''} doneUpload={()=> handleGetCourseFiles()}/>
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
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Assignment Name
										</Form.Label>
										<Form.Control 
                      defaultValue={selectedAssignment?.assignmentName}
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Edit Assignment Name"
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