import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../../context/UserContext'

export default function StudentLinks({activeHeader}) {
  const userContext = useContext(UserContext)
  const { user } = userContext.data
  const subsType = user.subsType;
  
  if(user.isStudent){
    return (
      <div className="header-links">
        {subsType == 'Ebooks' &&
          <Link to="/ebook_links">Ebooks</Link>
        }
        {subsType == 'Interactives' &&
        <>
          <Link className={activeHeader === "classes" && 'active'} to="/classes">Classes</Link>
          <Link className={activeHeader === "reports" && 'active'} to="/reports">Reports</Link>
        </>
        }
         {subsType == 'TeacherResources' &&
         <>
          <Link className={activeHeader === "courses" && 'active'} to="/courses">Courses</Link>
          {/* <Link className={activeHeader === "classes" && 'active'} to="/classes">Classes</Link>
          <Link className={activeHeader === "reports" && 'active'} to="/reports">Reports</Link> */}
         </>
        }
        {subsType == 'InteractivesandLearn' &&
         <>
          <Link className={activeHeader === "courses" && 'active'} to="/courses">Courses</Link>
         </>
        }
        {subsType.includes('LMS') || subsType == 'ContainerwithTR' ?
          <>
            <Link className={activeHeader === "dashboard" && 'active'} to="/dashboard">Dashboard</Link>
            {subsType == 'ContainerwithTR' && <Link className={activeHeader === "courses" && 'active'} to="/courses">Courses</Link>}
            <Link className={activeHeader === "classes" && 'active'} to="/classes">Classes</Link>
            <Link className={activeHeader === "reports" && 'active'} to="/reports">Reports</Link>
          </>
          :
          null
        }
      </div>
    )
  }
  return <div/>
}
