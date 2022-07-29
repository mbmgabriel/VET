import React, { useState,useEffect, useContext } from 'react'
import { Card, Dropdown, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ClassesAPI from '../../../../api/ClassesAPI';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';
import { UserContext } from '../../../../context/UserContext'

function ClassCard({item, setOpenCoverPhotoModal,  setOpenEditModal, setSeletedClass, getClasses, setClassIdCoverPhoto}) {
  const [deleteNotify, setDeleteNotify] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)
  const [itemId, setItemId] = useState('');
  const userContext = useContext(UserContext);
  const {user} = userContext.data;
  const subsType = user.subsType;

  const cancelSweetAlert = () => {
    setDeleteNotify(false)
  }

  const handleDeleteNotify = (e, item) =>{
    setDeleteNotify(true)
    setItemId(item)
  }

  const handleCoverPhotoModal =(e, item) => {
    setOpenCoverPhotoModal(true)
    setClassIdCoverPhoto(item)
  }

  const handleOpeEditModal = (e, item) => {
    e.preventDefault()
    setSeletedClass(item)
    setOpenEditModal(true)
  }

  const deleteClasses = async (item) =>{
    let response = await new ClassesAPI().deleteClasses(item)
      if(response.ok){
          setDeleteNotify(false)
          getClasses()
          toast.success('Done!')
      }else{
        alert(response.data.errorMessage)
      }
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
  ));
  
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit
    </Tooltip>
  );

  const setCourseID = (cid) => 
  {
    localStorage.setItem("courseid", cid)
  }

  useEffect(() => {
    localStorage.setItem('typeresource', 'class')
  });

  const handleredirect = (id) => {
    if(subsType == 'LMS') return `/classescontent/${id}/feed`;
    if(subsType == 'Ebooks') return `/classes/${id}/learn`;
    if(subsType == 'Interactives') return `/classes/${id}/interactives`;
    if(subsType == 'TeacherResources' && user.isTeacher) return `/classes/${id}/resources`;
  }

  return (
    <div>
      <SweetAlert
        warning
        showCancel
        show={deleteNotify}
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title="Are you sure?"
        onConfirm={() => deleteClasses(itemId)}
        onCancel={cancelSweetAlert}
        focusCancelBtn
        >
          You will not be able to recover this imaginary file!
      </SweetAlert>
      <Card className='class-card' >
        <Link to={ handleredirect(item.classId) } onClick={() => setCourseID(item.courseId)}>
          <Card.Header className='class-header-card' style={{ backgroundImage: `url(${item.classCover})` }} >
            <Row>
              <Col sm={10}>
              </Col>
              <Col sm={2} style={{textAlign:'right'}}>
              <OverlayTrigger
                placement="right"
                delay={{ show: 10, hide: 25 }}
                overlay={renderTooltip}>
                <Dropdown isOpen={openDropdown} toggle={()=> setOpenDropdown(!openDropdown)}>
                  <Dropdown.Toggle data-toggle="dropdown" as={CustomToggle} >
                    <i className="fa fa-ellipsis-v fa-1x cursor-pointer-edit-class-card"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu >
                    <Dropdown.Item onClick={(e) => handleOpeEditModal(e, item)}>
                      Edit 
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => handleCoverPhotoModal(e, item.classId)}>
                      Upload Photo 
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(e) => handleDeleteNotify(e, item.classId)}>
                      Archive 
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                </OverlayTrigger>
              </Col>
           </Row>
          </Card.Header>
          <Card.Body>
            <OverlayTrigger
                placement="top"
                delay={{ show: 1, hide: 0 }}
                overlay={(props) => 
                  <Tooltip id="button-tooltip" {...props}>
                    {item.className}
                  </Tooltip>}
              >
                <Card.Title tag="h5">
                  {item.className?.length > 20 ? `${item.className.substring(0, 20)}...` : item.className}
                </Card.Title>
              </OverlayTrigger>
            <Card.Subtitle>
              <Col className='font-color' sm={10}>
                {item.classCode}
              </Col>
              <Col sm={10}>
                <b>
                {item.teacherName} <br /> 
                 <spam className='font-color'> {item.gradeName} </spam> <br />
                 <OverlayTrigger
                  placement="top"
                  delay={{ show: 1, hide: 0 }}
                  overlay={(props) => 
                  <Tooltip id="button-tooltip" {...props}>
                    {item.courseName}
                  </Tooltip>}
                >
                <span>
                  {item.courseName?.length > 20 ? `${item.courseName.substring(0, 20)}...` : item.courseName}
                </span>
              </OverlayTrigger>
            <Card.Subtitle></Card.Subtitle>
                </b> 
                <br /> 
                <br />
              </Col>
            </Card.Subtitle>
            <Card.Text className='font-color'>
            <Row>
            <Col sm={8}>
               Student <br />
              </Col>
              <Col ms={22} style={{fontSize:'15px', textAlign:'right',}}>
                <i className="fas fa-user"></i> {item?.classEnrolledCount}
                <br />
             </Col>
            </Row>
            </Card.Text>
          </Card.Body>
        </Link>
      </Card>
    </div> 
    )
}
export default ClassCard
