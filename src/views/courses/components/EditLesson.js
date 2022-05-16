import React, { useState, useEffect } from "react";
import { Button, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'
import CoursesAPI from "../../../api/CoursesAPI";
import SubjectAreaAPI from "../../../api/SubjectAreaAPI";
import { toast } from 'react-toastify';
import ContentField from "../../../components/content_field/ContentField";
import FileHeader from "../../classes/components/Task/TaskFileHeader";
import FilesAPI from '../../../api/FilesApi'

export default function EditLesson({openEditLessonModal, setOpenEditLessonModal, selectedLesson, setLessonInfo}){

	const [loading, setLoading] = useState(false)
  const [modulePages, setModulePages] = useState([])
	const [pageName, setPageName] = useState('')
	const [sequenceNo, setSequenceNo] = useState('')
	const [content, setContent] = useState('')
  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [displayFolder, setDisplayFolder] = useState([]);
  
  let sessionCourse = sessionStorage.getItem('courseid')
  let sessionModule = sessionStorage.getItem('moduleid')


	const handleCloseModal = e => {
    e.preventDefault()
    setOpenEditLessonModal(false)
  }

	const saveEditLesson = async(e, id ) => {
    e.preventDefault()
    if(pageName === '' || content === '' || sequenceNo === ''){
      toast.error('Please fill out all fields!', {
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
      let response = await new CoursesAPI().editLesson(
        selectedLesson?.id,
        {pageName, sequenceNo, content}
      )
      if(response.ok){
        toast.success('Lesson Save!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        getCourseUnitPages()
        console.log(getCourseUnitPages())
      getCourseLessons(sessionCourse, sessionModule)
  
        handleCloseModal(e)
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

  const getCourseLessons = async(e, data, modulename) => {
    setLoading(true)
    sessionStorage.setItem('moduleid', data)
    sessionStorage.setItem('modulename', modulename)
    let response = await new CoursesAPI().getCourseUnitPages(sessionCourse, data)
    setLoading(false)
    if(response.ok){
      setLessonInfo(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all pages")
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
    if(selectedLesson !== null) {
			setPageName(selectedLesson?.pageName)
			setSequenceNo(selectedLesson?.sequenceNo)
      setContent(selectedLesson?.content)
		}
  }, [selectedLesson])

  const handleGetClassFiles = async() => {
    // setLoading(true)
    let response = await new FilesAPI().getClassFiles(sessionCourse)
    // setLoading(false)
    if(response.ok){
      setDisplayFiles(response.data.files)
      setDisplayFolder(response.data.folders)
    }else{
      alert("Something went wrong while fetching class files ;;.")
    }
  } 

	return (
		<div>
			<Modal size="xl" className="modal-all" show={openEditLessonModal} onHide={()=> setOpenEditLessonModal(!openEditLessonModal)} >
				<Modal.Header className="modal-header" closeButton>
				Edit Lesson / Page
				</Modal.Header>
				<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveEditLesson}>
            <div className={showFiles ? 'mb-3' : 'd-none'}>
            <FileHeader type='Class' id={sessionCourse}  subFolder={''}  doneUpload={()=> handleGetClassFiles()} />
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
												Page Name 1
										</Form.Label>
										<Form.Control 
											defaultValue={selectedLesson?.pageName}
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter lesson name"
                      onChange={(e) => setPageName(e.target.value)}
                    />
								</Form.Group>

								<Form.Group className="m-b-20">
										<Form.Label for="description">
												Sequence Number
										</Form.Label>
										<Form.Control 
                      defaultValue={selectedLesson?.sequenceNo}
                      className="custom-input" 
                      size="lg" 
                      type="number" 
                      placeholder="Enter sequence number"
                      onChange={(e) => setSequenceNo(e.target.value)}
                    />
								</Form.Group>

                {/* <Form.Group className="m-b-20">
                  <Form.Label for="description">
                      Content
                  </Form.Label>
                  <Form.Control 
                    defaultValue={selectedLesson?.content}
                    // value={selectedLesson?.content}
                    className="custom-input" 
                    size="lg" 
                    as="textarea"
                    placeholder="Enter lesson content"
                    rows={5}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </Form.Group> */}
                <div>
                  <Button className='float-right my-2 tficolorbg-button' onClick={()=> setShowFiles(!showFiles)}>File Library</Button>
                </div>
                <Form.Group className="m-b-20">
                  <Form.Label >Content</Form.Label>
                    <ContentField value={content}  placeholder='Enter instruction here'  onChange={value => setContent(value)} />
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