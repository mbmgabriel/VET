import React, { useState, useEffect, useContext } from "react";
import { Card, Dropdown, Row, Col, Tooltip, OverlayTrigger, Modal, Button } from 'react-bootstrap';
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.css"
import { Link } from 'react-router-dom'
import userEvent from "@testing-library/user-event";
import { UserContext } from './../../../context/UserContext'
import CoursesAPI from "../../../api/CoursesAPI";
import { ToastContainer, toast } from 'react-toastify';
import CoursesItemCard from "./CourseItemCard";

export default function CoursesItem({subjectAreaName, filter, getCourses, setFilter, course, setLoading, setOpenEditModal, setSelectedCourse}) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [openDropdown, setOpenDropdown] = useState(false)
  const [data, setData] = useState([])
  const [uploadModal, setUploadModal] = useState(false);
  const [fileToUpload, setFileToUpload] = useState({});
  const [id, setId] = useState('')
 
  const handleOpeEditModal = (e, item) => {
    e.preventDefault()
    sessionStorage.setItem('courseid', item.id)
    setSelectedCourse(item)
    setOpenEditModal(true)
  }

  console.log(course, '================================================')

  const setCourseId = (item) => {
    sessionStorage.setItem('courseid', item)
    sessionStorage.setItem('breadname', "Learn")
  } 

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span 
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >{children}</span>
  ))

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit
    </Tooltip>
  )

  const handleClickedUploadModal = (item) => {
    setSelectedCourse(item)
    setUploadModal(true);
    console.log(item)
    setId(item.id)
  }

  const handleUploadCover = async() => {
    console.log(fileToUpload)
    setUploadModal(false)
    let response = await new CoursesAPI().uploadCover(id, fileToUpload)
    if(response.ok){
      toast.success('Cover image uploaded successfully.');
      getCourses()
    }else{
      toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
    }
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const handleSetFiles = (file) => {
    console.log(file);
    if(file != ''){
      getBase64(file).then(
        data => {
          let toAdd = {
            fileName: file.name,
            base64String: data,
          };
          setFileToUpload(toAdd);
        }
      );
    }
  }

  const handleDisplayUploadMOdal = () => {
    return(
      <Modal size="lg" className="modal-all" show={uploadModal} onHide={()=> setUploadModal(false)} >
				<Modal.Header className="modal-header" closeButton>
          Upload Cover
				</Modal.Header>
					<Modal.Body className="modal-label b-0px">
            <Col>
              <input className='' accept="image/png, image/gif, image/jpeg" type='file' style={{ backgroundColor: 'inherit' }} onChange={(e) => handleSetFiles(e.target.files[0])} />
            </Col>
            <Button onClick={() => handleUploadCover()} className="m-r-5 color-white tficolorbg-button float-right" size="sm">UPLOAD</Button>
					</Modal.Body>
			</Modal>
    )
  }
  useEffect(() => {
    localStorage.setItem('typeresource', 'course')
  });
  
  return (
    <React.Fragment>
        { subjectAreaName.filter(item =>
          item.courseName.toLowerCase().includes(filter.toLowerCase())).map
          ((item, index) => {  
        return(
          <>
          {item?.status?(<>
            <Link to={user.isTeacher ? `coursecontent/${item.id}/learn` : `/school_courses/${item.id}`} onClick={() => setCourseId(item.id)} course={course} setLoading={setLoading} className="active card-title">
              <CoursesItemCard 
              courseCover={item.courseCover}
              courseId={item.id}
              courseName={item.courseName}
              subjectAreaName={item.subjectArea.subjectAreaName}
              description={item.description}
              authorName={item.authorName}
              courseInfo={item}
              setOpenEditModal={setOpenEditModal}
              setSelectedCourse={setSelectedCourse}
              getCourses={getCourses}
              uploadModalTrigger={handleClickedUploadModal}
            />
            </Link>
          </>):(<></>)}

          </>
        )
        })  
    }
    {handleDisplayUploadMOdal()}
    </React.Fragment>
  )
}
