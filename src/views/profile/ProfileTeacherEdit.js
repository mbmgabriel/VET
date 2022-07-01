import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button, Row, Col } from 'react-bootstrap'
import moment from 'moment'
import ProfileInfoAPI from '../../api/ProfileInfoAPI'
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';

function ProfileTeacherEdit({openTeacherInfoToggle, openTeacherInfoModal, userInfo, getTeacherInfo, setOpenTeacherInfoModal}) {
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [permanentAddress, setPermanentAddress] = useState('')
  const [contactNo, setContactNo] = useState('')
  const [bday, setBday] = useState('')
  const [sex, setSex] = useState('')
  const [emailAdd, setemailAdd] = useState('')
  let employeeNo = userInfo?.employeeNo
  const { id } = useParams()
  

  const updateTeacherInfo = async(e) => {
    e.preventDefault()
    let response = await new ProfileInfoAPI().updateTeacherInfo(id, {fname, lname, permanentAddress, contactNo, bday, sex, emailAdd, employeeNo})
      if(response.ok){
        getTeacherInfo()
        openTeacherInfoToggle(e)
        successUpdate()
        setFname('')
        setLname('')
        setPermanentAddress('')
        setContactNo('')
        setBday('')
        setSex('')
        setemailAdd('')
      }else{
        toast.error('Please insert all the required fields.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      }
  }

  const closeTeacherInfoToggle = ()=>{
    setOpenTeacherInfoModal(false)
    setFname('')
    setLname('')
    setPermanentAddress('')
    setContactNo('')
    setBday('')
    setSex('')
    setemailAdd('')
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

  const successUpdate = () =>{
    toast.success('Successfully updated your profile', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

  return (
    <div><Modal  size="lg" show={openTeacherInfoModal} onHide={closeTeacherInfoToggle} aria-labelledby="example-modal-sizes-title-lg">
    <Modal.Header className='class-modal-header' closeButton>
      <Modal.Title id="example-modal-sizes-title-lg" >
        Edit Personal Information
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Form onSubmit={updateTeacherInfo} > 
    <Row>
        <Col sm={6}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
          <Form.Group className="mb-4">
            <Form.Label>First Name</Form.Label>
          <Form.Control placeholder='First Name' required defaultValue={userInfo?.fname} onChange={(e) => setFname(e.target.value)} />
            </Form.Group>
          </div>
        </Col>
        <Col sm={6}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
          <Form.Group className="mb-4">
            <Form.Label>Last Name</Form.Label>
          <Form.Control placeholder='Last Name' required defaultValue={userInfo?.lname} onChange={(e) => setLname(e.target.value)}/>
            </Form.Group>
          </div>
        </Col>
        <Col sm={6}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <Form.Group className="mb-4">
            <Form.Label>Employee Number</Form.Label>
          <Form.Control placeholder='Employee Number' required disabled defaultValue={userInfo?.employeeNo}/>
            </Form.Group>
          </div>
        </Col>
        <Col sm={6}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <Form.Group className="mb-4">
            <Form.Label>Contact Number</Form.Label>
          <Form.Control placeholder='Contact Number' type='number' required defaultValue={userInfo?.contactNo} onChange={(e) => setContactNo(e.target.value)}/>
            </Form.Group>
          </div>
        </Col>
        <Col sm={6}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <Form.Group className="mb-4">
            <Form.Label>Birthday</Form.Label>
          <Form.Control type="date" required defaultValue={moment(userInfo?.bday).format('YYYY-MM-DD')} onChange={(e) => setBday(e.target.value)}/>
            </Form.Group>
          </div>
        </Col>
        <Col sm={6}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <Form.Group className="mb-4">
            <Form.Label>Gender</Form.Label>
            <Form.Select required defaultValue={userInfo?.sex} onChange={(e) => setSex(e.target.value)}>
                <option value=''>Gender</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
              </Form.Select>
            </Form.Group>
          </div>
        </Col>
        <Col sm={7}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <Form.Group className="mb-4">
            <Form.Label>E-mail Address</Form.Label>
          <Form.Control placeholder='E-mail Address' required defaultValue={userInfo?.emailAdd} onChange={(e) => setemailAdd(e.target.value)}/>
            </Form.Group>
          </div>
        </Col>
        <Col sm={12}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <Form.Group className="mb-4">
            <Form.Label>Address</Form.Label>
          <Form.Control  placeholder='Address' required defaultValue={userInfo?.permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)}/>
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
  
  </div>
  )
}

export default ProfileTeacherEdit