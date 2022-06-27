
import React, {useContext, useState, useEffect} from 'react'
import MainContainer from '../../components/layouts/MainContainer'
import { UserContext } from '../../context/UserContext'
import { Row, Col, Button } from 'react-bootstrap'
import moment from 'moment';
import { useParams } from "react-router-dom";
import ProfileInfoAPI from '../../api/ProfileInfoAPI';
import ProfileEdit from './ProfileEdit';
import ProfileTeacherEdit from './ProfileTeacherEdit';

function Profile() {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState()
  const [openUserInfoModal, setUserInfoModal] = useState(false)
  const [openTeacherInfoModal, setOpenTeacherInfoModal] = useState(false)

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

  useEffect(() => {
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

  return (
    <MainContainer>
      <div className='page-container' >
      <div className='containerpages'>
      <div className='portfolio-profile' style={{fontSize:'180px'}}> 
          <i class="fas fa-user-circle fas-1x" ></i>
        </div>
        <div className='portfolio-name'>
         <b>{user?.role}</b> <br />
         {user?.isStudent && 
         <>
         <Button onClick={() => openUserInfoToggle()} className='btn-create-discussion' variant="link" > <b>Edit Personal Information</b>   </Button>
         </>
         }

         {user?.isTeacher &&
         <>
         <Button onClick={() => openTeacherInfoToggle()} className='btn-create-discussion' variant="link" > <b>Edit Personal Information</b>   </Button>
         </>
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
     
    </MainContainer>
  )
}

export default Profile
