import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import {Image} from 'react-bootstrap';
import { toast } from 'react-toastify'
import ProfileDropdown from './ProfileDropdown'
import ProfileInfoAPI from '../../../api/ProfileInfoAPI';
import { UserContext } from '../../../context/UserContext'

export default function FloatingOptions() {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [profileDropdownVisibility, setProfileDropdownVisibility] = useState(false)
  const [profileImage, setprofileImage] = useState('');

  const getImage = async() =>{
    let tempId = user.isStudent ? user.student?.id : user.teacher?.id
    let response = await new ProfileInfoAPI().getProfileImage(tempId)
    if(response.ok){
      setprofileImage(response.data)
    }else{
      toast.error('Something went wrong while getting profile image.')
    }
  }

  useEffect(() => {
    console.log(user);
    getImage()
  },[])

  return (
    <div>
      <div className="floating-options">
        <Link className={`floating-option ${window.location.pathname == `/calendar` ? 'active' : ''}`} to="/calendar" >
          <div><i class="far fa-calendar"></i></div>
        </Link>
        <Link className={`floating-option ${window.location.pathname == `/notifications` ? 'active' : ''}`} to="/notifications">
          <div><i class="fas fa-bell"></i></div>
        </Link>
        <Link className={`floating-option`} to="#" onClick={e => setProfileDropdownVisibility(!profileDropdownVisibility)}>
          {profileImage ?
          <Image className='profileImage' style={{width: 64, height: 64, borderRadius: 32}} src={`${profileImage}?${new Date().getTime()}`} /> 
          :
          <div>
            <i class="fas fa-user"></i>
          </div>
          }
        </Link>
      </div>
      <ProfileDropdown visible={profileDropdownVisibility}/>
    </div>
  )
}
