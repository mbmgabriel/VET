import React, {useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useParams } from "react-router";
import CoursesAPI from "../../api/CoursesAPI";


function CourseSideNav({active, courseInfos}) {
  const {id} = useParams()
  // alert('here')
  // console.log('sample', courseInfos)

  useEffect( async() => {
    let response = await new CoursesAPI().getContributor(id)
    console.log(response, "--------------------------------");
  },[])

  return (
    <div className="side-navigation">
      {courseInfos.courseName}
      <div className="course-subtitle">{courseInfos.authorName}</div>
    <Link to={`/school_courses/${id}`} className={`side-navigation-item ${active === "Learn" ? "active" : ""}`}>Learn</Link>
    <Link to={`/school_courses/${id}/discussion`} className={`side-navigation-item ${active === "Discussion" ? "active" : ""}`}>Discussion</Link>
    <Link to={`/school_courses/${id}/exam`} className={`side-navigation-item ${active === "Exam" ? "active" : ""}`}>Exam</Link>
    <Link to={`/school_courses/${id}/assignment`} className={`side-navigation-item ${active === "Assignment" ? "active" : ""}`}>Assignment</Link>
    <Link to={`/school_courses/${id}/task`}  className={`side-navigation-item ${active === "Task" ? "active" : ""}`}>Task</Link>
    <Link to={`/school_courses/${id}/interactive`} className={`side-navigation-item ${active === "Interactive" ? "active" : ""}`}>Interactive</Link>
    <Link  to={`/school_courses/${id}/files`} className={`side-navigation-item ${active === "Files" ? "active" : ""}`}>Files</Link>
  </div>
  )
}
export default CourseSideNav