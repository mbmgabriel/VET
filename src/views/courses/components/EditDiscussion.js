import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import CoursesAPI from "../../../api/CoursesAPI";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContentField from "../../../components/content_field/ContentField";
import FileHeader from "../../classes/components/Task/TaskFileHeader";
import FilesAPI from '../../../api/FilesApi'

export default function EditDiscussion({setDiscussionInfo, openEditDiscussionModal, setOpenEditDiscussionModal, selectedDiscussion}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [discussionName, setDiscussionName] = useState('')
	const [instructions, setInstructions] = useState('')
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
  
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = e => {
    e.preventDefault()
    setOpenEditDiscussionModal(false)
  }

	const saveEditDiscussion = async(e) => {
    e.preventDefault()
    setLoading(true)
    let response = await new CoursesAPI().editDiscussion(
      selectedDiscussion?.discussion.id,
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

  useEffect(() => {
    if(selectedDiscussion !== null) {
			setDiscussionName(selectedDiscussion?.discussion.discussionName)
			setInstructions(selectedDiscussion?.discussion.instructions)
		}
  }, [selectedDiscussion])

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
			<Modal size="lg" className="modal-all" show={openEditDiscussionModal} onHide={()=> setOpenEditDiscussionModal(!openEditDiscussionModal)} >
				<Modal.Header className="modal-header" closeButton>
				Edit Discussion
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveEditDiscussion}>
            <div className={showFiles ? 'mb-3' : 'd-none'}>
                <FileHeader type='Course' id={sessionCourse}  subFolder={''} doneUpload={()=> handleGetCourseFiles()} />
                {/* {
                 (displayFiles || []).map( (item,ind) => {
                    return(
                      <img src={item.pathBase.replace('http:', 'https:')} className='p-1' alt={item.fileName} height={30} width={30}/>
                    )
                  })
                } */}
                {
               (displayFiles || []).map( (item,ind) => {
                  return(
                    item.pathBase?.match(/.(jpg|jpeg|png|gif|pdf)$/i) ? 
                    <img key={ind+item.name} src={item.pathBase.replace('http:', 'https:')} className='p-1' alt={item.name} height={30} width={30}/>
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
												Discussion Name
										</Form.Label>
										<Form.Control 
                      defaultValue={selectedDiscussion?.discussion.discussionName}
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
												Save
										</Button>
								</span>
						</Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}