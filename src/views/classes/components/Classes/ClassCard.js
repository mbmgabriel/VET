import React, { useState,useEffect } from 'react'
import { Card, Dropdown, Row, Col, Tooltip, OverlayTrigger, renderTooltip, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ClassesAPI from '../../../../api/ClassesAPI';
import SweetAlert from 'react-bootstrap-sweetalert';


function ClassCard({item, openCoverPhotoModal, setOpenCoverPhotoModal,  setOpenEditModal, setSeletedClass, getClasses, setClassIdCoverPhoto}) {
  const [deleteNotify, setDeleteNotify] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)
  const [itemId, setItemId] = useState('')
  const [loading, setLoading] = useState(false)
  const subsType = localStorage.getItem('subsType');

  console.log('ClassCard:', item)

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

  console.log('111111111:', item)

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
        <Link to={ subsType == "LMS" ? `/classescontent/${item.classId}/feed` : `/classes/${item.classId}/learn` } onClick={() => setCourseID(item.courseId)}>
          <Card.Header className='class-header-card' style={{ backgroundImage: `url(${item.classCover})` }} >
            <Row>
              <Col sm={10}>
               {/* {item.classCode} */}
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
              {/* <Col sm={10}>
                <b>{item.gradeName} -  {item.className} </b>
              </Col> */}
              {/* <Col sm={8}>
               {item.courseName}
              </Col>
              <Col ms={22} style={{fontSize:'15px', textAlign:'right',}}>
                <i className="fas fa-user"></i> 30
             </Col> */}
           </Row>
          </Card.Header>
          <Card.Body>
            <Card.Title>
            </Card.Title>
            <Card.Subtitle>
            {item.className} 
              <Col className='font-color' sm={10}>
                {item.classCode}
              </Col>
              <Col sm={10}>
                <b>
                {item.teacherName} <br /> 
                 <spam className='font-color'> {item.gradeName} </spam> <br />
                 {item.courseName}
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
