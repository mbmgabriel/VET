import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router';
import DiscussionAPI from '../../../../api/DiscussionAPI';

export default function ClassAdminSideNavigation({active}) {
  const [courseInfos, setCourseInfos] = useState([])
  const {id} = useParams();

  const getCourseInformation = async () =>{
    let response = await new DiscussionAPI().getClassInfo(id)
    if(response.ok){
      setCourseInfos(response.data.classInformation)
      console.log(response.data, '-----------')
    }
  }

  useEffect(() => {
    getCourseInformation();
  }, [])

  return (
    <div className="side-navigation">
      {courseInfos.courseName}
      <div className="course-subtitle">{courseInfos.teacherName}</div>
      <Link to={`/school_classes/${id}/feed`}className={`side-navigation-item ${active === "feed" ? "active" : ""}`}>Feed</Link>
      <Link to={`/school_classes/${id}/learn`} className={`side-navigation-item ${active === "learn" ? "active" : ""}`}>Learn</Link>
      <Link to={`/school_classes/${id}/exam`} className={`side-navigation-item ${active === "exam" ? "active" : ""}`}>Exam</Link>
      <Link to={`/school_classes/${id}/discussion`} className={`side-navigation-item ${active === "discussion" ? "active" : ""}`}>Discussion</Link>
      <Link to={`/school_classes/${id}/assignment`} className={`side-navigation-item ${active === "assignment" ? "active" : ""}`}>Assignment</Link>
      <Link to={`/school_classes/${id}/task`} className={`side-navigation-item ${active === "task" ? "active" : ""}`}>Task</Link>
      <Link to={`/school_classes/${id}/interactives`} className={`side-navigation-item ${active === "interactives" ? "active" : ""}`}>Class Interactives</Link>
      <Link to={`/school_classes/${id}/links`} className={`side-navigation-item ${active === "links" ? "active" : ""}`}>Links</Link>
      <Link to={`/school_classes/${id}/classList`} className={`side-navigation-item ${active === "list" ? "active" : ""}`}>Class List</Link>
      <Link to={`/school_classes/${id}/files`} className={`side-navigation-item ${active === "files" ? "active" : ""}`}>Class Files</Link>
    </div>
  )
}