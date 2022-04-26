import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UserContext } from '../../../context/UserContext'
import { useParams } from "react-router-dom";

export default function ProfileDropdown({visible}) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const { id } = useParams();

  const logout = async() => {
    await window.localStorage.clear()
    window.location.href = "/login"
  }

  return (
    <div className={`profile-dropdown-container dropdown-menu shadow ${visible && 'show'}`}>
      <div className="user-header">
        <div className="user-image-container">
          <i class="fas fa-user"></i>
        </div>
        <div className="user-name-container">
          <p className="user-name">{user?.name}</p>
          {user.isStudent && 
          <>
          <Link to={`/profile/${user?.student?.id}`}>See your profile</Link>
          </>
          }
          {user.isTeacher && 
          <>
          <Link to={`/profile/${user?.teacher?.id}`}>See your profile</Link>
          </>
          }
          
        </div>
      </div>
      <div className="profile-dropdown-links">
        <Link to="#" className="profile-dropdown-link feedback-link ">
          <div className="profile-dropdown-link-icon">
            <i class="fas fa-exclamation-circle"></i>
          </div>
          <div className="feedback-texts" onClick={() => toast.error("Feature under development")}>
            <p className="title">Give feedback</p>
            <p className="sub-title">Help us improve TekTeach LMS</p>
          </div>
        </Link>
        <a target="_blank" rel="noreferrer" href="https://support.tekteach.com/" className="profile-dropdown-link">
          <div className="profile-dropdown-link-icon">
            <i class="fas fa-question-circle"></i>
          </div>
          Help & Support
        </a>
        <Link to="#" className="profile-dropdown-link" onClick={() => toast.error("Feature under development")}>
          <div className="profile-dropdown-link-icon">
            <i class="fas fa-tv"></i>
          </div>
          Theme & Display
        </Link>
        <Link to="#" className="profile-dropdown-link" onClick={logout} >
          <div className="profile-dropdown-link-icon">
            <i class="fas fa-sign-out-alt"></i>
          </div>
          Log Out
        </Link>

      </div>
    </div>
  )
}
