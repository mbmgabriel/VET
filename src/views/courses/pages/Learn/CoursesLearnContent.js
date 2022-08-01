import React, { useState, useEffect } from "react";
import { Tab, Row, Col, Button, InputGroup, FormControl, Accordion } from 'react-bootstrap';
import CoursesAPI from "../../../../api/CoursesAPI";

export default function CoursesLearnContent({courseInfo, setCourseInfo, moduleInfo, setModuleInfo, lessonContent, setLessonContent}) {

  const [loading, setLoading] = useState(false)

  const modulename = sessionStorage.getItem('modulename')

  return (
    
    
      courseInfo.authorName === "Techfactors Inc." ?
      <>
      <span className="">
        {lessonContent.pageName}
      </span>
      <br></br>
      <span className=""><small>{modulename}</small></span>
      <hr></hr>
      <div style={{position:"relative"}} dangerouslySetInnerHTML={{__html: lessonContent.content}} />
      </>
      :
      <>
      <span className="content-pane-title">
        {lessonContent.pageName}
      </span>
      <br></br>
      <span className="course-subtitle"><small>{modulename}</small></span>
      <hr></hr>
      <div className="dangerously-learn-content" style={{position:"relative"}} dangerouslySetInnerHTML={{__html: lessonContent?.content}} />
      </>
      
  )
}
