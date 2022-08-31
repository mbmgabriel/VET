import React, {useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import { useParams } from "react-router";
import CoursesAPI from "../../api/CoursesAPI";
import { UserContext } from "../../context/UserContext"

function CourseSideNav({active, courseInfos}) {
  const {id} = useParams();
  const userContext = useContext(UserContext);
  const {user} = userContext.data;
  const subsType = user.subsType;
  // alert('here')
  // console.log('sample', courseInfos)

  useEffect( async() => {
    let response = await new CoursesAPI().getContributor(id)
    console.log(response, "--------------------------------");
  },[])

  return (//Ebooks, TeacherResources, Interactives, InteractivesandLearn, ContainerwithTR
    <div className="side-navigation">
      {courseInfos.courseName}
      <div className="course-subtitle">{courseInfos.authorName}</div>
      {
        subsType == 'Ebooks' && 
        <>
          <Link to={`/school_courses/${id}`} className={`side-navigation-item ${active === "Learn" ? "active" : ""}`}>Learn</Link>
        </>
      }
      {
        subsType == 'TeacherResources' &&
        <>
          <Link to={`/school_courses/${id}/resources`} className={`side-navigation-item ${active === "Resources" ? "active" : ""}`}>Teacher Resources</Link>
          <Link to={`/school_courses/${id}/interactive`} className={`side-navigation-item ${active === "Interactive" ? "active" : ""}`}>Interactive</Link>
        </>
      }
      {
        subsType == 'Interactives' &&
        <>
          <Link to={`/school_courses/${id}/interactive`} className={`side-navigation-item ${active === "Interactive" ? "active" : ""}`}>Interactive</Link>
        </>
      }
      {
        subsType == 'InteractivesandLearn' &&
        <>
          <Link to={`/school_courses/${id}`} className={`side-navigation-item ${active === "Learn" ? "active" : ""}`}>Learn</Link>
          <Link to={`/school_courses/${id}/interactive`} className={`side-navigation-item ${active === "Interactive" ? "active" : ""}`}>Interactive</Link>
        </>
      }
      {
        subsType.includes('LMS') || subsType == 'ContainerwithTR' ?
          <>
            <Link to={`/school_courses/${id}`} className={`side-navigation-item ${active === "Learn" ? "active" : ""}`}>Learn</Link>
            <Link to={`/school_courses/${id}/discussion`} className={`side-navigation-item ${active === "Discussion" ? "active" : ""}`}>Discussion</Link>
            <Link to={`/school_courses/${id}/exam`} className={`side-navigation-item ${active === "Exam" ? "active" : ""}`}>Exam</Link>
            <Link to={`/school_courses/${id}/assignment`} className={`side-navigation-item ${active === "Assignment" ? "active" : ""}`}>Assignment</Link>
            <Link to={`/school_courses/${id}/task`}  className={`side-navigation-item ${active === "Task" ? "active" : ""}`}>Task</Link>
            <Link to={`/school_courses/${id}/interactive`} className={`side-navigation-item ${active === "Interactive" ? "active" : ""}`}>Interactive</Link>
            <Link to={`/school_courses/${id}/resources`} className={`side-navigation-item ${active === "Resources" ? "active" : ""}`}>Teacher Resources</Link>
            <Link  to={`/school_courses/${id}/files`} className={`side-navigation-item ${active === "Files" ? "active" : ""}`}>Files</Link>
          </>
        :
        null
      }
  </div>
  )
}
export default CourseSideNav