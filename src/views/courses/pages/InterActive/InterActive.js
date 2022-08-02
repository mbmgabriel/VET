import React, { useEffect, useState } from 'react'
import { Tab, Row, Col, Button, InputGroup, FormControl, Accordion, Tooltip, OverlayTrigger } from 'react-bootstrap';
import ClassesAPI from '../../../../api/ClassesAPI';
import CourseContent from '../../CourseContent'
import {useParams} from 'react-router';
import CoursesAPI from '../../../../api/CoursesAPI';
import InterActiveHeader from './InterActiveHeader';
import CourseBreadcrumbs from '../../components/CourseBreadcrumbs';

function InterActive() {
  const [module, setModule] = useState([])
  const [moduleId, setModuleId] = useState()
  const [interActiveItems, setInterActiveItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const {id} = useParams();

  const onSearch = (item) => {
    setSearchTerm(item)
  }

  const getModule = async(id) => {
    let response = await new ClassesAPI().getModule(id);
    if(response.ok){
      setModule(response.data)
      console.log('QQQQQ:', response.data)
    }else{
      alert('error')
    }
  }

  const getIndteractive = async(id) => {
    let response = await new CoursesAPI().getInterActive(id);
    if(response.ok){
      setInterActiveItems(response.data)
      setModuleId(id)
    }else{
      alert('ERROR')
    } 
  }

  useEffect(() => {
    getModule(id)
  }, [])

  const handleRefresh = () => {
    getIndteractive(moduleId)
    getModule(id)
  }

  console.log('id:', id)
  console.log('interActiveItems:', interActiveItems)


  return (
    <CourseContent>
      <CourseBreadcrumbs />
      <InterActiveHeader onSearch={onSearch} refresh={() => handleRefresh()} />
    <Accordion defaultActiveKey="0">
      {module?.map((item, index) =>{
        return(
          <>
      <Accordion.Item eventKey={index} onClick={() => getIndteractive(item?.id)} >
        <Accordion.Header>{item.moduleName}</Accordion.Header>
        <Accordion.Body>
          {interActiveItems?.filter(item =>{
            if(searchTerm == ''){
              return item
            }else if(item?.interactiveName.toLowerCase().includes(searchTerm.toLocaleLowerCase())){
              return item
            }
          }).map(item => {
            return(
              <>
                <Row style={{margin: '10px'}}>
                  <div className='title-exam' >
                    <Col sm={8} >
                      <a target="_blank" className='class-links' href={item?.path}>{item?.interactiveName}</a>
                    </Col>
                  </div>
                  <hr></hr>
                </Row>
              </>
            )
          })}      
        </Accordion.Body>
      </Accordion.Item>
          </>
        )
      })}
    </Accordion>
    </CourseContent>
  )
}
export default InterActive