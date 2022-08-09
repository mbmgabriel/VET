
import React, {useContext, useState, useEffect} from 'react'
import MainContainer from '../../components/layouts/MainContainer'
import { UserContext } from '../../context/UserContext'
import { Row, Col, Button, Image, Modal, Form, InputGroup } from 'react-bootstrap'
import moment from 'moment';
import { useParams } from "react-router-dom";
import ProfileInfoAPI from '../../api/ProfileInfoAPI';
import ProfileEdit from './ProfileEdit';
import ProfileTeacherEdit from './ProfileTeacherEdit';
import { toast } from 'react-toastify';

function Profile() {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState()
  const [openUserInfoModal, setUserInfoModal] = useState(false)
  const [openTeacherInfoModal, setOpenTeacherInfoModal] = useState(false);
  const [profileImage, setprofileImage] = useState('');
  const [tempProfileImage, setTempProfileImage] = useState('');
  const [uploadModal, setUploadModal] = useState(false);
  const [profileDataImage, setProfileDataImage] = useState({})
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);


  console.log('useruseruseruser:', user )
  console.log('openTeacherInfoModal:', openTeacherInfoModal )
  

  const openUserInfoToggle = () =>{
    setUserInfoModal(!openUserInfoModal)
  }
  const openTeacherInfoToggle = () =>{
    setOpenTeacherInfoModal(!openTeacherInfoModal)
  }

  const getStudentInfo = async() =>{
    let response = await new ProfileInfoAPI().getStudentInfo(id)
      if(response.ok){
        setUserInfo(response.data)
      }else{
        alert('Something went wrong while fetching Student Information')
      }
  }

  const getTeacherInfo = async() =>{
    let response = await new ProfileInfoAPI().getTeacherInfo(id)
      if(response.ok){
        setUserInfo(response.data)
      }else{
        alert('Something went wrong while fetching Teacher Information')
      }
  }
  
  const getImage = async() =>{
    let response = await new ProfileInfoAPI().getProfileImage(user.userId)
    if(response.ok){
      console.log(response.data)
      setprofileImage(response.data)
    // }else{
    //   toast.error('Something went wrong while getting profile image.')
    }
  }

  useEffect(() => {
    getImage()
    if(user?.teacher === null)
    return(
      getStudentInfo()
    )
  }, [])

  useEffect(() => {
    if(user?.student === null)
    return(
      getTeacherInfo()
    )
  }, [])

  console.log('userInfo:', userInfo)

  const handlefilesUpload = (file) => {
    if(file != ''){
        getBase64(file[0]).then(
          data => {
            setTempProfileImage(data)
            setUploadModal(true)
            let toAdd = {
              fileName: file[0].name,
              base64String: data,
            };
            setProfileDataImage(toAdd);
          }
        );
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
    
    const handleSaveProfile = async() => {
      let response = await new ProfileInfoAPI().uploadProfile(user.userId, profileDataImage)
      if(response.ok){
        setprofileImage(response.data.filePath);
        setUploadModal(false);
      }else{
        toast.error('Something went wrong while uploading profile image.')
      }
    }

    const handleModalProfile = () => {
      return(
        <Modal size="lg" className="modal-all" show={uploadModal} onHide={()=> setUploadModal(false)} >
          <Modal.Header className="modal-header" closeButton>
            Upload Profile
          </Modal.Header>
					<Modal.Body className="modal-label b-0px">
          <div className='profile-container profileImage' style={{width: 150, height: 150, borderRadius: 80, backgroundColor: '#7D7D7D'}}>
            <Image className='profileImage' style={{width: 150, height: 150, borderRadius: 80}} src={tempProfileImage} /> 
            <div style={{width: 150, height: 150, borderRadius: 70}} className="middle text" onClick={() => { document.getElementById('inputFile').click()}}>
              <i className="font-size-35 fas fa-upload"></i>
              <p className='font-15'>Change Picture</p>
            </div>
          </div> 
            <Button onClick={() => handleSaveProfile()} className="m-r-5 color-white tficolorbg-button float-right" size="sm">Save Picture</Button>
            <Button onClick={() => setUploadModal(false)} className="m-r-5 btn bg-danger float-right" size="sm">Cancel</Button>
					</Modal.Body>
			</Modal>
      )
    }

    const UpdatePassword = async() => {
      if(newPass == confirmPass){
        let data = {
          currentPassword: currentPass,
          newPassword: newPass
        }
        let response = await new ProfileInfoAPI().updatePassword(user.userId, data)
        if(response.ok){
          toast.success('Password updated successfully.')
        }else{
          toast.error(response.data.errorMessage);
        }
        handleCancel();
      }else{
        toast.error("Password didn't match.")
      }
    }

    const handleCancel = () => {
      setShowCurrentPass(false);
      setShowNewPass(false);
      setShowConfirmPass(false);
      setCurrentPass(null);
      setNewPass(null);
      setConfirmPass(null);
      setShowChangePassModal(false)
    }

  return (
    <MainContainer>
      <div className='page-container'>
      <div className='containerpages'>
      <div className='profile-container profileImage' style={{width: 150, height: 150, borderRadius: 70, backgroundColor: '#7D7D7D'}}>
        {
          profileImage ?
          <Image className='profileImage' style={{width: 150, height: 150, borderRadius: 80}} src={`${profileImage}?${new Date().getTime()}`} /> 
          :
          <i className=" fas fa-user-circle fas-1x" style={{fontSize:'150px'}}></i>
        }
          <div style={{width: 150, height: 150, borderRadius: 70}} className="middle text" onClick={() => { document.getElementById('inputFile').click()}}>
            <i className="font-size-35 fas fa-upload"></i>
            <p className='font-15'>Upload Picture</p>
            <input className='d-none' accept="image/png, image/gif, image/jpeg" id='inputFile' type='file' style={{ backgroundColor: 'inherit' }} onChange={(e) => handlefilesUpload(e.target.files)} />
          </div>
      </div>
      <div className='portfolio-name'>
        <b>{user?.role}</b> <br />
        {user?.isStudent && 
          <Button onClick={() => openUserInfoToggle()} className='btn-create-discussion' variant="link" > <b>Edit Personal Information</b>   </Button>
        }
        {user?.isTeacher &&
          <Button onClick={() => openTeacherInfoToggle()} className='btn-create-discussion' variant="link" > <b>Edit Personal Information</b>   </Button>
        }
      </div>
      <Row>
        <Col sm={7}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <p>First Name</p>
          </div>
          <div style={{fontSize:'24px', color:'#7D7D7D'}}>
            <p>{userInfo?.fname}</p>
          </div>
        </Col>
        <Col sm={4}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <p>Last Name</p>
          </div>
          <div style={{fontSize:'24px', color:'#7D7D7D'}}>
            <p>{userInfo?.lname}</p> 
          </div>
        </Col>
        <Col sm={7}>
        {user.isStudent && 
            <>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <p>Student Number</p>
          </div>
            <p>{userInfo?.studentNo}</p>
            </>
            }
          {user.isTeacher && 
            <>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <p>Employee No</p>
          </div>
          <div style={{fontSize:'24px', color:'#7D7D7D'}}>
            <p>{user?.teacher?.employeeNo}</p>
            </div>
            </>
            }
        </Col>
        <Col sm={4}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <p>Contact Number</p>
          </div>
          <div style={{fontSize:'24px', color:'#7D7D7D'}}>
            <p>{userInfo?.contactNo}</p>
          </div>
        </Col>
        <Col sm={7}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <p>Birthday</p>
          </div>
          <div style={{fontSize:'24px', color:'#7D7D7D'}}>
            <p>{moment(userInfo?.bday).format('LL')}</p>
          </div>
        </Col>
        <Col sm={4}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <p>Gender</p>
          </div>
          <div style={{fontSize:'24px', color:'#7D7D7D'}}>
            <p>{userInfo?.sex}</p>
          </div>
        </Col>
        <Col sm={6}>
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <p>E-mail Address</p>
          </div>
          <div style={{fontSize:'24px', color:'#7D7D7D'}}>
           <p>{userInfo?.emailAdd}</p>
          </div>
        </Col>
        <Col sm={10}>
          
          <div style={{fontSize:'24px', color:'#BCBCBC'}}>
            <p>Address</p>
          </div>
          <div style={{fontSize:'24px', color:'#7D7D7D'}}>
            <p>{userInfo?.permanentAddress}</p>
          </div>
        </Col>
      </Row>
      {user.isTeacher && <Col className='d-flex justify-content-end'>
        <Button className='tficolorbg-button m-4' onClick={() => setShowChangePassModal(true)}>Change Password</Button>
      </Col>}
      </div>
      </div>
      {user?.isStudent && 
      <>
      <ProfileEdit setUserInfoModal={setUserInfoModal} getStudentInfo={getStudentInfo} openUserInfoModal={openUserInfoModal} openUserInfoToggle={openUserInfoToggle} userInfo={userInfo} />
      </>}

      {user?.isTeacher && 
      <>
      <ProfileTeacherEdit setOpenTeacherInfoModal={setOpenTeacherInfoModal} getTeacherInfo={getTeacherInfo} openTeacherInfoToggle={openTeacherInfoToggle} openTeacherInfoModal={openTeacherInfoModal} userInfo={userInfo} />
      </>
      }
      {handleModalProfile()}
      <Modal size="lg" show={showChangePassModal} onHide={() => setShowChangePassModal(false)} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Change Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Form onSubmit={''}> */}
            <Form.Group className="mb-4">
              <Form.Label className='font-20'>Current Password <span className='text-danger'>*</span></Form.Label>
              <InputGroup>
                <Form.Control value={currentPass} onChange={(e)=> setCurrentPass(e.target.value)} type={showCurrentPass ? 'text' : "password"} required placeholder='Enter current password here..'/>
                <InputGroup.Text><i className={showCurrentPass ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={()=> setShowCurrentPass(!showCurrentPass)}/></InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className='font-20'>New Password <span className='text-danger'>*</span></Form.Label>
              <InputGroup>
                <Form.Control value={newPass} onChange={(e)=> setNewPass(e.target.value)} type={showNewPass ? 'text' : "password"} required placeholder='Enter new password here..'/>
                <InputGroup.Text><i className={showNewPass ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={()=> setShowNewPass(!showNewPass)}/></InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className='font-20'>Confirm New Password <span className='text-danger'>*</span></Form.Label>
              <InputGroup>
                <Form.Control value={confirmPass} onChange={(e)=> setConfirmPass(e.target.value)} type={showConfirmPass ? 'text' : "password"} required placeholder='Enter confirm new password here..'/>
                <InputGroup.Text><i className={showConfirmPass ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={()=> setShowConfirmPass(!showConfirmPass)}/></InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Button size="lg" variant="outline-warning" className='btn-danger color-white float-right ml-3' onClick={() => handleCancel()}>Cancel</Button>
            <Button size="lg" variant="outline-warning" type='submit' onClick={()=> UpdatePassword()} className='tficolorbg-button color-white float-right'>Update Password</Button>
          {/* </Form> */}
        </Modal.Body>
      </Modal>
    </MainContainer>
  )
}

export default Profile
