import React, {useState, useEffect} from 'react'
import {Row, Col, Accordion, Button} from 'react-bootstrap'
import CoursesAPI from '../../../api/CoursesAPI'
import { useParams } from "react-router";

function SchoolCoursesDiscussionContent({setLoading}) {
  const [modules, setModules] = useState([])
  const [moduleId, setModuleId] = useState(null)
  const [discussioninfo, setDiscussionInfo] = useState([])
  const [viewDiscussion, setViewDiscussion] = useState(false)
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

  const getDiscussionInformation = async (e, id) =>{
    setLoading(true)
    let response = await new CoursesAPI().getDiscussionInformation(id)
    if(response.ok){
      setDiscussionInfo(response.data)
      setModuleId(id)
    }else{
      alert(response.data.errorMessage)
    }
    setLoading(false)
  }

  useEffect(() => {
    if(moduleId !== null){
      return(
        getDiscussionInformation() 
      )
    }  
  }, [])

  const handleOnclick = (discussionName, discussionIntruction, moduleName) =>{
    setViewDiscussion(true)
    setDiscussionName(discussionName)
    setdiscussionIntruction(discussionIntruction)
    setModuleName(moduleName)
  }

  console.log('discussioninfo:', discussioninfo)


  return (
    <>
    {viewDiscussion ? 
    <>
    <Button onClick={() => setViewDiscussion(false)} className="m-r-5 color-white tficolorbg-button" size="sm">Back</Button><br /><br />
      {/* {moduleName}<br /> */}
      {discussionName}<br />
      <hr></hr>
      <div style={{position:"relative"}} dangerouslySetInnerHTML={{__html: discussionIntruction}} /><br />
    </>
    :
    <>
     <div className='rounded-white-container'>
      <div className="col-md-10 pages-header"><p className='title-header'>Discussion </p>
			</div>
      <Accordion>
        {modules.map((item, index) => {
          return(
            <Accordion.Item eventKey={index} onClick={(e) => getDiscussionInformation(e, item?.id)}>
            <Accordion.Header><div style={{fontSize:'20px'}}>{item.moduleName}</div></Accordion.Header>
            <Accordion.Body>
              {discussioninfo.map(item =>{
                return(
                  <>
                    <div className='title-exam' >
                      <Row>
                        <Col onClick={() =>handleOnclick(item?.discussion?.discussionName, item?.discussion?.instructions, item?.module?.moduleName) } >
                         {item?.discussion?.discussionName}
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

export default SchoolCoursesDiscussionContent