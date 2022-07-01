import React, {useState, useEffect, useContext} from 'react'
import {Accordion, Row, Col} from 'react-bootstrap'
import InteractiveReportContent from '../contents/InteractiveReportContent'
import ClassesAPI from './../../../api/ClassesAPI'

function InteractiveReport({filter, setFilter, classesModules, setClassesModules, selectedClassId, viewInteractiveReport, setViewInteractiveReport, setShowInteractiveHeader, showInteractiveHeader}) {

  const [interactivePerModule, setInteractivePerModule] = useState([])
  const [interactiveReport, setInteractiveReport] = useState([])
  const [loading, setLoading] = useState(false)

  const getClassInteractiveModules = async(e, moduleId) => {
    console.log(selectedClassId)
    sessionStorage.setItem('interactiveModuleId', moduleId)
    let sessionModuleId = sessionStorage.getItem('interactiveModuleId')
    let response = await new ClassesAPI().getClassInteractiveModules(selectedClassId, sessionModuleId)
    if(response.ok){
      setInteractivePerModule(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
  }

  const getInteractiveReport = async(e, interactiveid, interactivename) => {
    setLoading(true)
    setViewInteractiveReport(false)
    sessionStorage.setItem('interactiveName',interactivename)
    let response = await new ClassesAPI().getInteractiveReport(selectedClassId, interactiveid, interactivename)
    setLoading(false)
    if(response.ok){
      setInteractiveReport(response.data)
      console.log(response.data)
    }else{
      alert(response.data.errorMessage)
    }
  }

  console.log('interactivePerModule:', interactivePerModule)

  if(viewInteractiveReport === true){
  return (
    <div>
      <Accordion>
      {classesModules.map(item => {
        return(
          <Accordion.Item eventKey={item.id}>
          <Accordion.Header onClick={(e) => getClassInteractiveModules(e, item.id)}><div className='unit-exam'>{item.moduleName} </div></Accordion.Header>
            <Accordion.Body>
              {interactivePerModule.filter(item =>
                item.interactive?.interactiveName.toLowerCase().includes(filter.toLowerCase())).map
                ((item, index) => {
              return(
                item.classInteractiveAssignment !== null &&
                <Row>
                  <Col sm={8}>
                    <div className='title-exam' onClick={(e) => getInteractiveReport(e, item.interactive?.id, item.interactive?.interactiveName)}>
                      {item.interactive?.interactiveName}
                    </div>
                    {/* <div className='code-exam'>
                      EQF1
                    </div> */}
                  </Col>
                  <Col sm={9} className='instruction-exam' >
                    {/* <p>{item.task.instructions}</p> */}
                    {/* <div dangerouslySetInnerHTML={{ __html: item.task.instructions }} /> */}
                  </Col>
                  {/* <Col sm={3} className='icon-exam'>
                    <i class="fas fa-eye" style={{paddingRight:'10px'}} ></i>{' '}
                    <i class="fas fa-edit"style={{paddingRight:'10px'}}></i>
                    <i class="fas fa-trash-alt" style={{paddingRight:'10px'}}></i>
                  </Col> */}
                  <hr></hr>
                </Row>
                )
              })
            }
            </Accordion.Body>
          </Accordion.Item>
          )
        })
      }
      </Accordion>
    </div>
  )
  }else{
    return(
      <InteractiveReportContent showInteractiveHeader={showInteractiveHeader} setShowInteractiveHeader={setShowInteractiveHeader} setInteractiveReport={setInteractiveReport} interactiveReport={interactiveReport}/>
    )
  }
}
export default InteractiveReport
