import React from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router';

export default function ClassAdminSideNavigation({active}) {
  const {id} = useParams();

  return (
    <div className="side-navigation">
      <Link to={`/school_classes/${id}/feed`}className={`side-navigation-item ${active === "feed" ? "active" : ""}`}>Feed</Link>
      <Link to={`/school_classes/${id}/learn`} className={`side-navigation-item ${active === "learn" ? "active" : ""}`}>Learn</Link>
      <Link to={`/school_classes/${id}/exam`} className={`side-navigation-item ${active === "exam" ? "active" : ""}`}>Exam</Link>
      <Link to={`/school_classes/${id}/discussion`} className={`side-navigation-item ${active === "discussion" ? "active" : ""}`}>Discussion</Link>
      <Link to={`/school_classes/${id}/assignment`} className={`side-navigation-item ${active === "assignment" ? "active" : ""}`}>Assignment</Link>
      <Link to={`/school_classes/${id}/task`} className={`side-navigation-item ${active === "task" ? "active" : ""}`}>Task</Link>
      <Link to="school" className={`side-navigation-item ${active === "interactives" ? "active" : ""}`}>Class Interactives</Link>
      <Link to="school" className={`side-navigation-item ${active === "links" ? "active" : ""}`}>Links</Link>
      <Link to="school" className={`side-navigation-item ${active === "list" ? "active" : ""}`}>Class List</Link>
      <Link to="school" className={`side-navigation-item ${active === "files" ? "active" : ""}`}>Class files</Link>
    </div>
  )
}