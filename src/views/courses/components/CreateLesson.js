import React, { useState, useEffect } from "react";
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'
import CoursesAPI from "../../../api/CoursesAPI";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContentFieldWithTextArea from "../../../components/content_field/ContentFieldWithTextArea";
import ContentFieldForTFICourses from "../../../components/content_field/ContentFieldForTFICourses";
import FileHeader from "../../classes/components/Task/TaskFileHeader";
import FilesAPI from "../../../api/FilesApi"
import { useParams } from "react-router";
import CourseFileLibrary from '../components/CourseFileLibrary';

export default function CreateLesson({isTFI, openCreateLessonModal, setCreateLessonModal, setLessonInfo}){

	const [loading, setLoading] = useState(false)
	const [pageName, setPageName] = useState('')
	const [sequenceNo, setSequenceNo] = useState(null)
	const [content, setContent] = useState('')
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const {id} = useParams()

  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = e => {
    setCreateLessonModal(false)
  }

  const getCourseLessons = async(e, data, modulename) => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseUnitPages(sessionCourse, sessionModule)
    setLoading(false)
    if(response.ok){
      setLessonInfo(response.data)
    }else{
      alert("Something went wrong while fetching all pages")
    }
  }

	const saveLesson = async(e) => {
    e.preventDefault()
    setIsButtonDisabled(true)
    setTimeout(()=> setIsButtonDisabled(false), 1000)
    if(sequenceNo == null){
      toast.error('Please input all the required fields.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }else{
      setLoading(true)
      let response = await new CoursesAPI().createLesson(
        sessionCourse,
        sessionStorage.getItem('moduleid'),
        {pageName, sequenceNo, content}
      )
      if(response.ok){
        handleCloseModal(e)
        notifySaveLesson()
        getCourseLessons(sessionCourse, sessionModule)
        setContent('')
        setSequenceNo(null)
        setPageName('')
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

  const notifySaveLesson = () => 
  toast.success('Successfully saved lesson!', {
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
			<Modal size="lg" className="modal-all" show={openCreateLessonModal} onHide={(e)=> handleCloseModal()} >
				<Modal.Header className="modal-header" closeButton>
				Create Lesson / Page
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveLesson}>
            <div className={showFiles ? 'mb-3' : 'd-none'}>
              <CourseFileLibrary />
            </div>
								<Form.Group className="m-b-20">
										<Form.Label for="courseName">
												Page Name
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter lesson name"
                      onChange={(e) => setPageName(e.target.value)}
                    />
								</Form.Group>
                {' '}

								<Form.Group className="m-b-20">
										<Form.Label for="description">
												Sequence Number
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="number" 
                      placeholder="Enter sequence number"
                      onChange={(e) => setSequenceNo(e.target.value)}
                    />
								</Form.Group>
                {' '}

                {/* <Form.Group className="m-b-20">
										<Form.Label for="description">
												Content
										</Form.Label>
										<Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter lesson content"
                      onChange={(e) => setContent(e.target.value)}
                    />
								</Form.Group> */}
                <div>
                  <Button className='float-right my-2 tficolorbg-button' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
                </div>
                <Form.Group className="m-b-20">
                  <Form.Label >Content</Form.Label>
                  {    
                    isTFI ?
                    <ContentFieldForTFICourses value={content}  placeholder='Enter content here'  onChange={value => setContent(value)} />
                    :                
                    <ContentFieldWithTextArea value={content}  placeholder='Enter content here'  onChange={value => setContent(value)} />
                  }                
                  </Form.Group>
                {' '}
								<span style={{float:"right"}}>
										<Button disabled={isButtonDisabled} className="tficolorbg-button" type="submit">
												Save Lesson
										</Button>
								</span>
						</Form>
				</Modal.Body>
			</Modal>
		</div>
	)
}