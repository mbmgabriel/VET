import React, {useState, useEffect} from 'react'
import {Row, Col, Accordion, Button} from 'react-bootstrap'
import CoursesAPI from '../../../api/CoursesAPI'
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import SchoolCourseExamItem from './SchoolCourseExamItem';
import ExamCreation from '../../exam-creation/ExamCreation';

function SchoolCourseExam({setLoading}) {
  const [modules, setModules] = useState([])
  const [moduleId, setModuleId] = useState(null)
  const [examInfo, setExamInfo] = useState([])
  const [examId, setExamId] = useState(null)
  const [viewExam, setViewExam] = useState(false)
  const [discussionName, setDiscussionName] = useState('')
  const [discussionIntruction, setdiscussionIntruction] = useState('')
  const [moduleName, setModuleName] = useState('')
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

  const getExamInfo = async (e, id) =>{
    setLoading(true)
    let response = await new CoursesAPI().getExamInformation(id)
    if(response.ok){
      setExamInfo(response.data)
      setModuleId(id)
    }else{
      alert(response.data.errorMessage)
    }
    setLoading(false)
  }

  useEffect(() => {
    if(moduleId !== null){
      return(
        getExamInfo() 
      )
    }  
  }, [])

  return (
    <>
    {viewExam ?
     <>
      <SchoolCourseExamItem examId={examId} />
    </>
    :
    <>
    <div className='rounded-white-container'>
      <div className="col-md-10 pages-header"><p className='title-header'>Exam </p>
			</div>
      <Accordion>
        {modules.map((item, index) => {
          return(
            <Accordion.Item eventKey={index} onClick={(e) => getExamInfo(e, item?.id)}>
            <Accordion.Header><div style={{fontSize:'20px'}}>{item.moduleName}</div></Accordion.Header>
            <Accordion.Body>
              {examInfo.map(item =>{
                return(
                  <>
                    <div className='title-exam' >
                      <Row>
                        <Col >
                        <Link className="lesson-header" to={`/course/${id}/exam/${item.id}`}>
                              {item?.testName} 
                            </Link>
                          
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
    </>
    }
    
    </>
  )
}

export default SchoolCourseExam