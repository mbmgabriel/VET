import React, { useState, useEffect } from "react";
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import SubjectAreaAPI from "../../../api/SubjectAreaAPI";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContentField from "../../../components/content_field/ContentField";
import FileHeader from "./AssignmentFileHeader";
import FilesAPI from '../../../api/FilesApi'
import { useParams } from "react-router-dom";
import CourseFileLibrary from "./CourseFileLibrary";

export default function CreateDiscussion({openCreateDiscussionModal, setOpenCreateDiscussionModal, setDiscussionInfo}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [discussionName, setDiscussionName] = useState('')
	const [instructions, setInstructions] = useState('')
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')

  const {id} = useParams()

	const handleCloseModal = () => {
    setDiscussionName('')
    setInstructions('')
    setOpenCreateDiscussionModal(false)
  }

	const saveDiscussion = async(e) => {
    e.preventDefault()
    setIsButtonDisabled(true)
    setTimeout(()=> setIsButtonDisabled(false), 1000)
    setLoading(true)
    let response = await new CoursesAPI().createDiscussion(
      sessionModule,
      {discussionName, instructions}
    )
    if(response.ok){
      notifySaveDiscussion()
			handleCloseModal()
      getDiscussionInfo()
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

  const getDiscussionInfo = async(e, data) => {
    setLoading(true)
    // sessionStorage.setItem('moduleid', data)
    let response = await new CoursesAPI().getDiscussionInformation(sessionModule)
    setLoading(false)
    if(response.ok){
      setDiscussionInfo(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all discussion")
    }
  }

  const notifySaveDiscussion = () => 
  toast.success('Successfully saved discussion!', {
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
			<Modal size="lg" className="modal-all" show={openCreateDiscussionModal} onHide={()=> handleCloseModal()} >
				<Modal.Header className="modal-header" closeButton>
				Create Discussion
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveDiscussion}>
              <div className={showFiles ? 'mb-3' : 'd-none'}>
                <CourseFileLibrary />
              </div>
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Discussion Name
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter Discussion Name"
                      onChange={(e) => setDiscussionName(e.target.value)}
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
												Save Discussion
										</Button>
								</span>
						</Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}