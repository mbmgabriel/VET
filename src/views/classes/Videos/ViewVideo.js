import React, { useState, useEffect } from "react";
import { Tab, Row, Col, Button, InputGroup, FormControl, Accordion } from 'react-bootstrap';
import ReactPlayer from 'react-player'
export default function ViewVideo({selectedVideo, setShowVideo}) {

  const [loading, setLoading] = useState(false)
  
  const modulename = sessionStorage.getItem('modulename')

  const backToTask = () => {
    setShowVideo(false)
  }

  console.log(selectedVideo)

  return (
    <React.Fragment>
      <span className="content-pane-title">
        {selectedVideo?.title}
      </span>
      <br></br>
      <span className="course-subtitle"><small>{modulename}</small></span>
      <hr></hr>
      <div dangerouslySetInnerHTML={{__html: selectedVideo.fileName}} />
      <div>
        <ReactPlayer playing={true} controls={true} url={selectedVideo.path} />
      </div>
    </React.Fragment>
  )
}
