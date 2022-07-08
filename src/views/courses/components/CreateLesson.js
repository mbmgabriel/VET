import React, { useState, useEffect } from "react";
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'
import CoursesAPI from "../../../api/CoursesAPI";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContentField from "../../../components/content_field/ContentField";
import FileHeader from "../../classes/components/Task/TaskFileHeader";
import FilesAPI from "../../../api/FilesApi"
import { useParams } from "react-router";

export default function CreateLesson({openCreateLessonModal, setCreateLessonModal, setLessonInfo}){

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

  console.log('courseId:', id)

	const handleCloseModal = e => {
    setCreateLessonModal(false)
  }

  const getCourseLessons = async(e, data, modulename) => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseUnitPages(sessionCourse, sessionModule)
    setLoading(false)
    if(response.ok){
      setLessonInfo(response.data)
      console.log(response.data)
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

  useEffect(() => {
    handleGetClassFiles()
    // console.log(module, '-----------')
  }, [])

  // useEffect(() =>{
  //   if(sessionCourse != null){
  //     handleGetClassFiles()
  //   }

  // }, [])

  const handleGetClassFiles = async() => {
    // setLoading(true)
    let response = await new FilesAPI().getCourseFiles(id)
    // setLoading(false)
    if(response.ok){
      setDisplayFiles(response.data.files)
      setDisplayFolder(response.data.folders)
    }else{
      alert("Something went wrong while fetching class files111111111111 ;;.")
    }
  } 

  return (
		<div>
			<Modal size="lg" className="modal-all" show={openCreateLessonModal} onHide={(e)=> handleCloseModal()} >
				<Modal.Header className="modal-header" closeButton>
				Create Lesson / Page
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveLesson}>
            <div className={showFiles ? 'mb-3' : 'd-none'}>
            <FileHeader type='Course' id={sessionCourse}  subFolder={''}  doneUpload={()=> handleGetClassFiles()} />
            {/* {
             (displayFiles || []).map( (item,ind) => {
                return(
                  <img src={item.pathBase.replace('http:', 'https:')} className='p-1' alt={item.fileName} height={30} width={30}/>
                )
              })
            } */}
             {
              (displayFiles || []).map((item,ind) => {
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
                    <ContentField value={content}  placeholder='Enter content here'  onChange={value => setContent(value)} />
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