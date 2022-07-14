import React, {useState, useEffect} from 'react'
import {Row, Col, Accordion, Button} from 'react-bootstrap'
import CoursesAPI from '../../../api/CoursesAPI'
import { useParams } from "react-router";

function SchoolCourseInteractive({setLoading,onRefresh}) {
  const [modules, setModules] = useState([])
  const [moduleId, setModuleId] = useState(null)
  const [interactive, setInteractive] = useState([])
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

  const getInterActive = async (e, id) =>{
    setLoading(true)
    let response = await new CoursesAPI().getInterActive(id)
    if(response.ok){
      setInteractive(response.data)
      setModuleId(id)
    }else{
      alert(response.data.errorMessage)
    }
    setLoading(false)
  }

  useEffect(() => {
    if(moduleId !== null){
      return(
        getInterActive() 
      )
    }  
  }, [])

  return (
    <div className='rounded-white-container'>
      <div className="col-md-10 pages-header fd-row">
        <p className='title-header'>Interactive </p>
        <div className='mb-3'>
          <Button onClick={() => onRefresh()} className='ml-3'>
            <i className="fa fa-sync"></i>
          </Button>
        </div>
       </div>
      <Accordion>
        {modules.map((item, index) => {
          return(
            <Accordion.Item eventKey={index} onClick={(e) => getInterActive(e, item?.id)}>
            <Accordion.Header><div style={{fontSize:'20px'}}>{item.moduleName}</div></Accordion.Header>
            <Accordion.Body>
              {interactive.map(item =>{
                return(
                  <>
                    <div className='title-exam' >
                      <Row>
                        <Col >
                        <a target="_blank" className='href-link' href={item?.path}>{item?.interactiveName}</a>
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
  )
}

export default SchoolCourseInteractive