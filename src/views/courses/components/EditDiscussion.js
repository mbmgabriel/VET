import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContentField from "../../../components/content_field/ContentField";
import FileHeader from "../../classes/components/Task/TaskFileHeader";
import FilesAPI from '../../../api/FilesApi'
import { useParams } from "react-router-dom";
import CourseFileLibrary from './CourseFileLibrary';

export default function EditDiscussion({setInstructions, setDiscussionName, discussionId, instructions, discussionName, setDiscussionInfo, openEditDiscussionModal, setOpenEditDiscussionModal, selectedDiscussion}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
  
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')

  const {id} = useParams()

	const handleCloseModal = e => {
    e.preventDefault()
    setOpenEditDiscussionModal(false)
  }

	const saveEditDiscussion = async(e) => {
    e.preventDefault()
    setLoading(true)
    let response = await new CoursesAPI().editDiscussion(
      discussionId,
      {discussionName, instructions}
    )
    if(response.ok){
			handleCloseModal(e)
      notifyUpdateDiscussion()
      getDiscussionInfo(null, sessionModule)
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

  const getDiscussionInfo = async(e, data) => {
    setLoading(true)
    let response = await new CoursesAPI().getDiscussionInformation(data)
    setLoading(false)
    if(response.ok){
      setDiscussionInfo(response.data)
    }else{
      alert("Something went wrong while fetching all discussion")
    }
  }

	useEffect(() => {
  }, [])

  // useEffect(() => {
  //   if(selectedDiscussion !== null) {
	// 		setDiscussionName(selectedDiscussion?.discussion.discussionName)
	// 		setInstructions(selectedDiscussion?.discussion.instructions)
	// 	}
  // }, [selectedDiscussion])

  const notifyUpdateDiscussion= () => 
  toast.success('Successfully updated discussion!', {
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
      alert("Something went wrong while fetching class files1111111.")
    }
  } 

  console.log('selectedDiscussion:', selectedDiscussion)

	return (
		<div>
			<Modal size="lg" className="modal-all" show={openEditDiscussionModal} onHide={()=> setOpenEditDiscussionModal(!openEditDiscussionModal)} >
				<Modal.Header className="modal-header" closeButton>
				Edit Discussion
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
					<Form onSubmit={saveEditDiscussion}>
            <div className={showFiles ? 'mb-3' : 'd-none'}>
              <CourseFileLibrary />
            </div>
            <Form.Group className="m-b-20">
                <Form.Label for="courseName">
                    Discussion Name
                </Form.Label>
                <Form.Control 
                  defaultValue={discussionName}
                  className="custom-input" 
                  size="lg" 
                  type="text" 
                  placeholder="Edit Discussion Name"
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
                <Button className="tficolorbg-button" type="submit">
                    Update Discussion
                </Button>
            </span>
          </Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}