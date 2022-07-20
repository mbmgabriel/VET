import React, { useState, useEffect, useContext } from "react";
import { Card, Dropdown, Row, Col, Tooltip, OverlayTrigger, Modal, Button } from 'react-bootstrap';
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.css"
import { Link } from 'react-router-dom'
import userEvent from "@testing-library/user-event";
import { UserContext } from './../../../context/UserContext'
import CoursesAPI from "../../../api/CoursesAPI";
import SchoolAPI from "../../../api/SchoolAPI";
import { ToastContainer, toast } from 'react-toastify';
import CoursesItemCard from "./CourseItemCard";

export default function CoursesItem({subjectAreaName, filter, getCourses, setFilter, course, setLoading, setOpenEditModal, setSelectedCourse}) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [openDropdown, setOpenDropdown] = useState(false)
  const [data, setData] = useState([])
  const [uploadModal, setUploadModal] = useState(false);
  const [fileToUpload, setFileToUpload] = useState({});
  const [id, setId] = useState('');
  const [contributorModal, setContributorModal] = useState(false);
  const [teachersList, setTeachersList] = useState([]);
  const [contributorsList, setContributorsList] = useState([]);
  const [courseID, setCourseID] = useState('');
  const [courseInfo, setCourseInfo] = useState({});
  const [authorId, setAuthorId] = useState('');
  const subsType = localStorage.getItem('subsType');

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

  const getTeacherList = async() => {
    console.log(fileToUpload)
    setUploadModal(false)
    let response = await new SchoolAPI().getTeachers()
    if(response.ok){
      setTeachersList(response.data)
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

  const getCourseInfo = async(id) => {
    let response = await new CoursesAPI().getCourseInformation(id)
    if(response.ok){
      setCourseInfo(response.data)
      setAuthorId(response.data.createdBy)
      console.log(response, '-=-=-')
    }else{
      alert("Something went wrong while fetching course information")
    }
  }

  const handleGetContributors = async(id) => {
    let response = await new CoursesAPI().getContributor(id)
    if(response.ok){
      setContributorsList([...response.data])
    }else{
      toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
    }
  }

  const addContributor = async(item) => {
    console.log(item)
    let data = {
      "courseId": courseID,
      "userAccountId": item.userAccountID,
    }
    let response = await new CoursesAPI().addDistributor(courseID, data)
    if(response.ok){
      toast.success('Contributor added successfully');
      handleGetContributors(courseID);
    }else{
      toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
    }
  }

  const handleClickContributor = (id) => {
    setContributorModal(!contributorModal)
    getTeacherList()
    handleGetContributors(id)
    setCourseID(id)
    getCourseInfo(id)
  }

  const handleRemoveContributor = async(data) => {
    console.log(data)
    if(data.distributorInformation.userAccountId == authorId){
      toast.error("You can't remove the author of this course.")
    }else{
      let response = await new CoursesAPI().removeContributor(courseID, data.distributorInformation.id)
      if(response.ok){
        toast.success('Contributor removed successfully');
        handleGetContributors(courseID);
      }else{
        toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
      }
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
            <Col className='font-color' >
              File Extension .jpg, .jpeg, .tiff, .bmp, .png
            </Col>
            <Col className='font-color' >
              Image must 300x300
            </Col>
            <Button onClick={() => handleUploadCover()} className="m-r-5 color-white tficolorbg-button float-right" size="sm">UPLOAD</Button>
					</Modal.Body>
			</Modal>
    )
  }

  const handleDisplayContributorMOdal = () => {
    return(
      <Modal size="lg" className="modal-all" show={contributorModal} onHide={()=> setContributorModal(false)} >
				<Modal.Header className="modal-header" closeButton>
          Contributor
				</Modal.Header>
					<Modal.Body className="modal-label b-0px">
           <Row>
              <Col md={6}>
                <div className='contributors-container'>
                  <p className="font-20">Contributor/s</p>
                  {
                    contributorsList.map((contributor, key) => {
                      return (
                        <Row className="mb-3">
                          <Col md={8}>
                            <span>{contributor.userInformation.firstname} {contributor.userInformation.lastname} </span>
                          </Col>
                          <Col>
                            <span><i onClick={() => handleRemoveContributor(contributor)} className="fa fa-minus bg-danger color-white d-flex justify-content-center align-items-center br-3" style={{width: 23, height: 23}}/></span>
                          </Col>
                        </Row>
                      )
                    })
                  }
                </div>
              </Col>
              <Col md={6}>
                <div className='contributors-container'>
                <p className="font-20">Teacher/s</p>
                {
                  teachersList.map((teacher, key) => {
                    return (
                    <Row className="mb-3">
                      <Col md={8}>
                        <span className="w-75">{teacher.fname} {teacher.lname}</span>
                      </Col>
                      <Col>
                        <span><i onClick={() => addContributor(teacher)} className="fa fa-plus tficolorbg-button color-white d-flex justify-content-center align-items-center br-3" style={{width: 23, height: 23}}/></span>
                      </Col>
                    </Row>
                      )
                  })
                }
                </div>
              </Col>
           </Row>
            {/* <Button onClick={() => handleContributorCover()} className="m-r-5 color-white tficolorbg-button float-right" size="sm">UPLOAD</Button> */}
					</Modal.Body>
			</Modal>
    )
  }

  useEffect(() => {
    localStorage.setItem('typeresource', 'course')
  });

  const handleReturnLink = (id) => {
    if(user.isTeacher && subsType == 'TeacherResources'){
      return `/courses/${id}/resources`
    }
    if(user.isTeacher){
      return `coursecontent/${id}/learn`
    }
    if(user.isSchoolAdmin){
      return `/school_courses/${id}`
    }
  }
  
  return (
    <React.Fragment>
        { subjectAreaName.filter(item =>
          item.courseName.toLowerCase().includes(filter.toLowerCase())).map
          ((item, index) => {  
        return(
          <>
          {item?.status?(<>
          {/* user.isTeacher ? `coursecontent/${item.id}/learn` : `/school_courses/${item.id}` */}
            <Link to={handleReturnLink(item.id)} onClick={() => setCourseId(item.id)} course={course} setLoading={setLoading} className="active card-title">
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
              handleClickContributor={handleClickContributor}
            />
            </Link>
          </>):(<></>)}
          </>
        )
        })  
    }
    {handleDisplayUploadMOdal()}
    {handleDisplayContributorMOdal()}
    </React.Fragment>
  )
}
