import React, {useState, useEffect, useContext} from 'react'
import {Accordion, Row, Col} from 'react-bootstrap'
import ExamReportContent from '../contents/ExamReportContent'
import ClassesAPI from './../../../api/ClassesAPI'

function ExamReport({filter, classesModules, getTestReport, selectedClassId}) {

  const [testPerModule, setTestPerModule] = useState([])
  const [testReport, setTestReport] = useState([])
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState()
  const [noExam, setNoExam] = useState([])

  const getClassTestModules = async(e, moduleId) => {
    sessionStorage.setItem('testModuleId', moduleId)
    let sessionModuleId = sessionStorage.getItem('testModuleId')
    let response = await new ClassesAPI().getClassTestModules(selectedClassId, sessionModuleId)
    if(response.ok){
      setTestPerModule(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
  }

  var names = ['Mike', 'Matt', 'Nancy', 'Adam', 'Jenny', 'Nancy', 'Nancy','Nancy','Nancy','Carl']

const uniq = names
  .map((name) => {
    return {
      count: 1,
      name: name
    };
  })
  .reduce((result, b) => {
    result[b.name] = (result[b.name] || 0) + b.count;

    return result;
  }, {});

const duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);
// const studentNoSubmitted = Object.keys(notSubmitted).filter((a) => notSubmitted[a] > 1);

const notSubmitted = testReport.map(item =>{
  return(
    item.studentTests.map((st) =>{
      return{
        count : 1,
        isSubmitted : st.isSubmitted 
      }
    }).reduce((result, b) => {
      result[b.isSubmitted] = (result[b.isSubmitted] || 0) + b.count;
      return result;
    })
  )
})

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
                    <div className='title-exam' onClick={(e) => getTestReport(item)}>
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
}
export default ExamReport
