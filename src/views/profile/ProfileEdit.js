import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, Row, Col } from 'react-bootstrap'
import moment from 'moment'
import ProfileInfoAPI from '../../api/ProfileInfoAPI'
import { useParams } from "react-router-dom"
import SweetAlert from 'react-bootstrap-sweetalert'

const ProfileEdit = ({openUserInfoModal, openUserInfoToggle, userInfo, getStudentInfo}) => {
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [permanentAddress, setPermanentAddress] = useState('')
  const [contactNo, setContactNo] = useState('')
  const [bday, setBday] = useState('')
  const [sex, setSex] = useState('')
  const [emailAdd, setemailAdd] = useState('')
  const [warningModal, setWarningModal] = useState(false)
  const [errorMessag, setErrorMessag] = useState('')
  let studentNo = userInfo?.studentNo
  const { id } = useParams()
  const [editNotufy, setEditNotify] = useState(false)

  const closeNotify = () =>{
    setEditNotify(false)
  }

  const closeWarningModal = () =>{
    setWarningModal(!warningModal)
  } 
  

  const updateStudentInfo = async(e) => {
    e.preventDefault()
    let response = await new ProfileInfoAPI().updateStudentInfo(id, {fname, lname, permanentAddress, contactNo, bday, sex, emailAdd, studentNo})
      if(response.ok){
        getStudentInfo()
        openUserInfoToggle(e)
        setEditNotify(true)
      }else{
        closeWarningModal()
        setErrorMessag(response.data.errorMessag)
      }
  }


  useEffect(() => {
    if(userInfo !== null) {
      setFname(userInfo?.fname)
      setLname(userInfo?.lname)
      setPermanentAddress(userInfo?.permanentAddress)
      setContactNo(userInfo?.contactNo)
      setBday(userInfo?.bday)
      setSex(userInfo?.sex)
      setemailAdd(userInfo?.emailAdd)
    }
  }, [userInfo])

  useEffect(() => {
    if(fname === '') {
      setFname(userInfo?.fname)
    }
  }, [fname])

  useEffect(() => {
    if(lname === '') {
      setLname(userInfo?.lname)
    }
  }, [lname])

  useEffect(() => {
    if(contactNo === '') {
      setContactNo(userInfo?.contactNo)
    }
  }, [contactNo])

  useEffect(() => {
    if(emailAdd === '') {
      setemailAdd(userInfo?.emailAdd)
    }
  }, [emailAdd])

  useEffect(() => {
    if(permanentAddress === '') {
      setPermanentAddress(userInfo?.permanentAddress)
    }
  }, [permanentAddress])


  return (
    <div><Modal  size="lg" show={openUserInfoModal} onHide={openUserInfoToggle} aria-labelledby="example-modal-sizes-title-lg">
    <Modal.Header className='class-modal-header' closeButton>
      <Modal.Title id="example-modal-sizes-title-lg" >
        Edit Personal Information
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Form onSubmit={updateStudentInfo}> 
    <Row>
        <Col sm={6}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
          <Form.Group className="mb-4">
            <Form.Label>First Name</Form.Label>
          <Form.Control required  defaultValue={userInfo?.fname} onChange={(e) => setFname(e.target.value)} />
            </Form.Group>
          </div>
        </Col>
        <Col sm={6}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
          <Form.Group className="mb-4">
            <Form.Label>Last Name</Form.Label>
          <Form.Control required defaultValue={userInfo?.lname} onChange={(e) => setLname(e.target.value)}/>
            </Form.Group>
          </div>
        </Col>
        <Col sm={6}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <Form.Group className="mb-4">
            <Form.Label>Student Number</Form.Label>
          <Form.Control disabled defaultValue={userInfo?.studentNo}/>
            </Form.Group>
          </div>
        </Col>
        <Col sm={6}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <Form.Group className="mb-4">
            <Form.Label>Contact Number</Form.Label>
          <Form.Control required defaultValue={userInfo?.contactNo} onChange={(e) => setContactNo(e.target.value)}/>
            </Form.Group>
          </div>
        </Col>
        <Col sm={6}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <Form.Group className="mb-4">
            <Form.Label>Birthday</Form.Label>
          <Form.Control required type="date" defaultValue={moment(userInfo?.bday).format('YYYY-MM-DD')} onChange={(e) => setBday(e.target.value)}/>
            </Form.Group>
          </div>
        </Col>
        <Col sm={6}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <Form.Group className="mb-4">
            <Form.Label>Gender</Form.Label>
            <Form.Select defaultValue={userInfo?.sex} onChange={(e) => setSex(e.target.value)}>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
              </Form.Select>
            </Form.Group>
          </div>
        </Col>
        <Col sm={6}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <Form.Group className="mb-4">
            <Form.Label>E-mail Address</Form.Label>
          <Form.Control required defaultValue={userInfo?.emailAdd} onChange={(e) => setemailAdd(e.target.value)}/>
            </Form.Group>
          </div>
        </Col>
        <Col sm={12}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <Form.Group className="mb-4">
            <Form.Label>Address</Form.Label>
          <Form.Control required defaultValue={userInfo?.permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)}/>
            </Form.Group>
          </div>
        </Col>
      </Row>
      <Form.Group className='right-btn'>
        <Button className='tficolorbg-button' type='submit' >Save</Button>
      </Form.Group>
    </Form> 
    </Modal.Body>
  </Modal>
  <SweetAlert 
    success
    show={editNotufy} 
    title="Done!" 
    onConfirm={closeNotify}>
  </SweetAlert>
  <SweetAlert 
    warning
    show={warningModal} 
    title={errorMessag} 
    onConfirm={closeWarningModal}>
  </SweetAlert>
  </div>
  )
}

export default ProfileEdit