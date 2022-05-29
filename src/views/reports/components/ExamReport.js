import React, {useState, useEffect, useContext} from 'react'
import {Accordion, Row, Col} from 'react-bootstrap'
import ExamReportContent from '../contents/ExamReportContent'
import ClassesAPI from './../../../api/ClassesAPI'

function ExamReport({filter, setfilter, classesModules, setClassesModules, selectedClassId, viewTestReport, setViewTestReport, showReportHeader, setShowReportHeader}) {

  const [testPerModule, setTestPerModule] = useState([])
  const [testReport, setTestReport] = useState([])
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState()

  const getClassTestModules = async(e, moduleId) => {
    console.log(selectedClassId)
    sessionStorage.setItem('testModuleId', moduleId)
    let sessionModuleId = sessionStorage.getItem('testModuleId')
    let response = await new ClassesAPI().getClassTestModules(selectedClassId, sessionModuleId)
    if(response.ok){
      setTestPerModule(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
  }

  const getTestReport = async(e, testid, testname, classid) => {
    setLoading(true)
    sessionStorage.setItem('testName',testname)
    sessionStorage.setItem('testid',testid)
    let sessionClass = sessionStorage.getItem("classId")
    setViewTestReport(false)
    console.log(viewTestReport)
    console.log('123')
    let response = await new ClassesAPI().getTestReport(sessionClass, testid)
    setLoading(false)
    if(response.ok){
      setTestReport(response.data) 
      // setStartDate(response.studentTests.classTest.startDate)
      console.log(response.data)
    }else{
      alert(response.data.errorMessage)
    }
  }

  console.log('testPerModule:' ,  testPerModule)

  if(viewTestReport === true){
  return (
    <div>
      <Accordion>
      {classesModules.map(item => {
        return(
          <Accordion.Item eventKey={item.id}>
          <Accordion.Header onClick={(e) => getClassTestModules(e, item.id)}><div className='unit-exam'>{item.moduleName} </div></Accordion.Header>
            <Accordion.Body>
              {/* {testPerModule.map((item, index) => {  */}
              {testPerModule.filter(item =>
                item.test.testName.toLowerCase().includes(filter.toLowerCase())).map
                ((item, index) => {
              return(
                item.classTest !== null &&
                <Row>
                  <Col sm={8}>
                    <div className='title-exam' onClick={(e) => getTestReport(e, item.test.id, item.test.testName, item.test.classId)}>
                      {item.test.testName}
                    </div>
                    {/* <div className='code-exam'>
                      EQF1
                    </div> */}
                  </Col>
                  <Col sm={9} className='instruction-exam' >
                    <p dangerouslySetInnerHTML={{__html:item.test.testInstructions }} />
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
  }else if(viewTestReport === false){
    return(
      <ExamReportContent showReportHeader={showReportHeader} setShowReportHeader={setShowReportHeader} setTestReport={setTestReport} testReport={testReport}/>
    )
  }
}
export default ExamReport
