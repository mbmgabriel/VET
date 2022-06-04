import React, { useState, useEffect, useContext } from 'react'
import ClassEnrolled from './components/ClassList/ClassEnrolled'
import ClassWaiting from './components/ClassList/ClassWaiting'
import {Button, InputGroup, FormControl, Row, Col, Modal, Form} from 'react-bootstrap'
import ClassesAPI from '../../api/ClassesAPI';
import { toast } from "react-toastify";
import { useParams } from 'react-router';
import FullScreenLoader from '../../components/loaders/FullScreenLoader';
import ClassSideNavigation from './components/ClassSideNavigation';
import ClassBreadcrumbs from './components/ClassBreedCrumbs';
import { UserContext } from '../../context/UserContext';

function ClassList() {
  const [openClass, setOpenClass] = useState(false)
  const [waitingStudent, setWaitingStudent] = useState([])
  const [enrolledStudent, setEnrolledStudent] = useState([{}])
  const {id} = useParams()
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState({});
  const [loading, setLoading] = useState(false);
  const userContext = useContext(UserContext)
  const {user} = userContext.data

  const onSearch = (text) => {
    setSearchTerm(text)
  }

  const handleOpenClassWaiting = e =>{
		e.preventDefault()
		setOpenClass(true)

	}

  const handleOpenClassEnrolled = e =>{
    e.preventDefault()
    setOpenClass(false)
  }

  const getStudentWaiting = async() =>{
    let isAccepted = false
    let response = await new ClassesAPI().getStudentList(id, isAccepted)
    if(response.ok){
      setWaitingStudent(response.data)
    }else{
      alert("Something went wrong while fetching all Waiting Student")
    }
    
  }

  useEffect(() => {
    getStudentWaiting()
    
  }, [])



  const getStudentEnrolled = async() =>{
    let isAccepted = true
    let response = await new ClassesAPI().getStudentEnrolledList(id, isAccepted)
    if(response.ok){
      setEnrolledStudent(response.data)
    }else{
      alert("Something went wrong while fetching all Waiting Student")
    }
    
  } 

  useEffect(() => {
    getStudentEnrolled()
    
  }, [])

  const handleGetUploadedFile = (file) => {
    getBase64(file).then(
      data => {
        console.log(file.name)
        let toUpload = {
          classId: id,
          data: {"base64String": data,
          "fileName": file.name}
        };
        setFilesToUpload(toUpload)
      }
    );
  }

  const handleUploadFile = async(e) => {
    e.preventDefault();
    setShowUploadModal(false);
    setLoading(true);
    let response = await new ClassesAPI().uploadClassList(filesToUpload)
    if(response.ok){
      setLoading(false);
      getStudentEnrolled();
      toast.success("Class list was successfully uploaded.")
    }else{
      setLoading(false);
      alert("Something went wrong while uploading class list")
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

  const handleShowUploadModal = () => {
    return(
      <Modal  size="lg" show={showUploadModal} onHide={()=> setShowUploadModal(false)} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Upload Class List
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleUploadFile(e)} >  
            <Form.Group className="mb-3">
              <Form.Control type="file" accept=".xls,.xlsx," onChange={(e) => handleGetUploadedFile(e.target.files[0])} />
            </Form.Group>
            <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit'>Upload</Button>
            </Form.Group>
          </Form> 
        </Modal.Body>
      </Modal>
    )
  }

  // console.log('this is Enrolled Student', enrolledStudent)

  return (
    <ClassSideNavigation>
      <ClassBreadcrumbs title='' clicked={() => console.log('')}/>
    <Row style={{paddingTop:'15px'}}>
      <Col className='title-header' >
      <p>Class List</p> 
      </Col>
      <Col style={{textAlign:'right'}}>
        <Button className='btn-Enrolled' onClick={handleOpenClassEnrolled} size='lg' variant="outline-warning"><b>Enrolled</b></Button>
        <Button className='btn-Enrolled' onClick={handleOpenClassWaiting} size='lg' variant="outline-warning"><b>Waiting List</b></Button>
        <Button className='btn-Enrolled' onClick={() => setShowUploadModal(true)} size='lg' variant="outline-warning"><b>Upload List</b></Button>
      </Col>
    </Row>
    <div className="row m-b-20" style={{marginTop:'30px'}}>
        <div className="col-md-12">
          <InputGroup size="lg">
            <FormControl onChange={(e) => onSearch(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search Student Last Name Here" type="search"/>
            <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i>
            </InputGroup.Text>
          </InputGroup>
        </div>
      </div>
        {openClass === false?(
        <ClassEnrolled searchTerm={searchTerm} getStudentWaiting={getStudentWaiting} getStudentEnrolled={getStudentEnrolled} enrolledStudent={enrolledStudent}  />
        ):
        <ClassWaiting searchTerm={searchTerm} getStudentEnrolled={getStudentEnrolled} getStudentWaiting={getStudentWaiting} waitingStudent={waitingStudent} />}
    {handleShowUploadModal()}
    {loading && <FullScreenLoader /> }
    </ClassSideNavigation>
  )
}
export default ClassList
