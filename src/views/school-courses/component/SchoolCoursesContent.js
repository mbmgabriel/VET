import React, {useState, useEffect} from 'react'
import {Row, Col, Accordion, Button} from 'react-bootstrap'
import CoursesAPI from '../../../api/CoursesAPI'
import { useParams } from "react-router";
import CourseBreadcrumbs from '../../courses/components/CourseBreadcrumbs';


function SchoolCoursesContent({setLoading}) {
  const [modules, setModules] = useState([])
  const [moduleId, setModuleId] = useState(null)
  const [lessons, setLessons] = useState([])
  const [lessonContent, setLessonContent] = useState([])
  const [viewLesson, setViewLesson] = useState(false)
  const {id} = useParams()

  const getCourseUnit = async () =>{
    setLoading(true)
    let response = await new CoursesAPI().getCourseUnit(id)
      if(response.ok){
        setModules(response.data)
      }else{
        alert(response.data.errorMessage)
      }
      setLoading(false)
  }

  useEffect(() => {
    getCourseUnit()
  }, [])

  const getCourseUnitPages = async (e, moduleId) => {
    setLoading(true)
    let response =  await new CoursesAPI().getCourseUnitPages(id, moduleId)
    if(response.ok){
      setLessons(response.data)
      setModuleId(moduleId)
    }else{
      alert(response.data.errorMessage)
    }
    setLoading(false)
  }

  useEffect(() => {
    if(moduleId !== null){
      return(
        getCourseUnitPages() 
      )
    }  
  }, [])

  const getModuleContent = async(e, data, pagesid) => {
    setLoading(true)
    setViewLesson(true)
    let response = await new CoursesAPI().getCourseUnitPagesContent(id, data, pagesid)
    if(response.ok){
      setLessonContent(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
    setLoading(false)
  }


  return (
    <>
      {viewLesson ? 
      <>
      <Button onClick={() => setViewLesson(false) } className="m-r-5 color-white tficolorbg-button" size="sm">Back</Button><br /><br />
        {lessonContent?.pageName}<br />
        <hr></hr>
        <div style={{position:"relative"}} dangerouslySetInnerHTML={{__html: lessonContent?.content}} />
      </>:
      <>
      <div className='rounded-white-container'>
      <div className="col-md-10 pages-header"><p className='title-header'>Learn </p>
			</div>
      <Accordion>
        {modules.map((item, index) => {
          return(
            <Accordion.Item eventKey={index} onClick={(e) => getCourseUnitPages(e, item?.id)}>
            <Accordion.Header><div style={{fontSize:'20px'}}>{item.moduleName}</div></Accordion.Header>
            <Accordion.Body>
              {lessons.map(item =>{
                return(
                  <>
                    <div className='title-exam' >
                      <Row>
                        <Col onClick={(e) => getModuleContent(e, moduleId, item?.id, item?.pageName)} >
                         {item?.pageName}
                        </Col>
                      </Row>
                     
                    </div>
                  </>
                )
              })}
              
            </Accordion.Body>
          </Accordion.Item>
          )
        })}
     </Accordion>
    </div>
      </>}
    </>
  )
}

export default SchoolCoursesContent