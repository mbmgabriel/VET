import React, { useState, useEffect } from "react";
import { Tab, Row, Col, Button, InputGroup, FormControl, Accordion } from 'react-bootstrap';
import CoursesAPI from "../../../../api/CoursesAPI";
import CourseContent from "../../CourseContent";
import CourseBreadcrumbs from "../../components/CourseBreadcrumbs";

export default function CourseLinks({moduleInfo, setModuleInfo}) {

  const [loading, setLoading] = useState(false)

  const [openCreateVideoModal, setOpenCreateVideoModal] = useState(false)
  const [openEditVideoModal, setOpenVideoModal] = useState(false)
  const [openCreateConferenceModal, setOpenCreateConferenceModal] = useState(false)
  const [openEditConferenceModal, setOpenEditConferenceModal] = useState(false)
  const [openCreateLinkModal, setOpenCreateLinkModal] = useState(false)
  const [openEditLinkModal, setOpenEditLinkModal] = useState(false)

  const [videosInfo, setVideosInfo] = useState([])
  const [conferenceInfo, setConferenceInfo] = useState([])
  const [linksInfo, setLinksInfo] = useState([])

  const courseid = sessionStorage.getItem('courseid')
  const moduleid = sessionStorage.getItem('moduleid')

  const handleOpenCreateVideoModal = () =>{
    setOpenCreateVideoModal(!openCreateVideoModal)
  }

  const getVideosInfo = async(e) => {
    setLoading(true)
    let response = await new CoursesAPI().getVideosLinks(courseid)
    setLoading(false)
    if(response.ok){
      setVideosInfo(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all task")
    }
  }

  useEffect(() => {
  }, [])

  return (
    <>
      <CourseContent>
      <span className="content-pane-title">
        Teacher Resources 
      </span>
      <div className="row m-b-20 m-t-30">
        <div className="col-md-12">
          <InputGroup size="lg">
            <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search..." type="search"/>
            <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
          </InputGroup>
        </div>
      </div>
      <Accordion defaultActiveKey="1">
        
            <>
            <Accordion.Item eventKey="1"> 
              <Accordion.Header onClick={(e) => getVideosInfo(e)}>
                <span className="unit-title">Videos <Button className="m-l-10" variant="outline-warning" onClick={handleOpenCreateVideoModal}><i className="fa fa-plus"></i> Add Videos</Button>
                </span>
              </Accordion.Header>
              <Accordion.Body>
                
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2"> 
              <Accordion.Header>
                <span className="unit-title">Conferences <Button className="m-l-10" variant="outline-warning" onClick={handleOpenCreateVideoModal}><i className="fa fa-plus"></i> Add Conferences Links</Button>
                </span>
              </Accordion.Header>
              <Accordion.Body>
                
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3"> 
              <Accordion.Header>
                <span className="unit-title">Links <Button className="m-l-10" variant="outline-warning" onClick={handleOpenCreateVideoModal}><i className="fa fa-plus"></i> Add Links</Button>
                </span>
              </Accordion.Header>
              <Accordion.Body>
                
              </Accordion.Body>
            </Accordion.Item>
            </>
         
      </Accordion>
      </CourseContent>
    </> 
  )
}
