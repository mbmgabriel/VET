import React, {useState, useEffect} from 'react'
import {  Col, Row, Card, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router';
import MainContainer from '../../../components/layouts/MainContainer'
import ClassAdminSideNavigation from './components/ClassAdminSideNavigation'
import ClassLearnHeader from '../../classes/components/Learn/ClassLearnHeader';
import ClassesAPI from '../../../api/ClassesAPI'
import DiscussionAPI from '../../../api/DiscussionAPI'

export default function SchoolAdminFeed() {
  const [selectedModuleId, setSelectedModuleId] = useState(null)
  const [modules, setModules] = useState([])
  const [Pages, setPages] = useState([])
  const [content, setContent] = useState([]);
  const [classInfo, setClassInfo] = useState({});
  const {id} = useParams()
  const [loading, setLoading] = useState(true);

  const getClassInfo = async() => {
    setLoading(true)
    let response = await new DiscussionAPI().getClassInfo(id)
    if(response.ok){
      console.log({response})
      getModules(response.data.classInformation?.courseId)
      setClassInfo(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
    setLoading(false)
  }

  const getModules = async(id) => {
    let response = await new ClassesAPI().getModule(id)
    if(response.ok){
      setModules(response.data)
    }else{
      alert("Something went wrong while fetching all modules")
    }
  }

  useEffect(() => {
    getClassInfo()
  }, [])

  const onModuleChange = (e) => {
    setSelectedModuleId(e.target.value)
    if(e.target.value == null || e.target.value == ""){
      setPages([])
    }else{
      getPages(e.target.value)
      
    }
  }

  const getPages = async(moduleId) => {
    let response = await new ClassesAPI().getPages(id, moduleId)
    if(response.ok){
      setPages(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all pages")
    }
  }

  const getContent = async(item) => {
    let mId = selectedModuleId
    let response = await new ClassesAPI().getContent(id, mId, item)
    if(response.ok){
      setContent(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all pages")
    }
  }

  return (
    <MainContainer title="School" activeHeader={"classes"} style='not-scrollable' loading={loading}>
      <Row className="mt-4">
        <Col sm={3}>
          <ClassAdminSideNavigation active="learn"/>
        </Col>
        <Col sm={9} className='scrollable vh-85'>
        <div style={{position:'relative'}} className='not-scrollable'>
        <Row>
          <Col className='scrollable vh-80 pb-5' style={{marginLeft:'15px'}} >
            <ClassLearnHeader content={content}  classInfo={classInfo}/>
          </Col>
          <Col md='3'>
            <Card className='calendar kb-0px'style={{backgroundColor:'white'}}>
              <Card.Header className='calendar-header' style={{backgroundColor:'white'}}>
                <div className="row calendar-title">
                  <div>
                  Table of Content
                  </div>
                </div>
                <div className="row calendar-subtitle">
                  <div>
                  <Form.Select onChange={onModuleChange} aria-label="Default select example">
                <option value="">--SELECT UNIT HERE--</option>
                {modules.map(item =>{
                    return (<option value={item?.id} > {item?.moduleName}</option>)
                  })}
                </Form.Select>
                  </div>
                </div>
              </Card.Header>
              <div >
              <Card.Body >
                <Card.Title tag="h5" className='card-title'>
                  UNIT
                </Card.Title>
                <Card.Text className='card-title' >
                <ul style={{listStyle:'none', height: '50vh'}} className='scrollable pb-5'>
                {Pages.map(item =>{
                    return (
                      <>
                        <li><Button onClick={() => getContent(item?.id)} className='btn-create-discussion' variant="link" > {item?.pageName}  </Button></li>
                      </>
                    )
                  })}
                  </ul>
                </Card.Text>
              </Card.Body>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
          {/* <SchoolProfileContent /> */}
        </Col>
      </Row>
    </MainContainer>
  )
}
