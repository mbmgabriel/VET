import React, {useState, useEffect, useContext} from 'react'
import {Badge, Table, Button, Form, Card, Row, Col} from 'react-bootstrap'
import ClassesAPI from '../../../api/ClassesAPI'
import {writeFileXLSX, utils} from "xlsx";
import { toast } from 'react-toastify';
import SweetAlert from 'react-bootstrap-sweetalert';
import { UserContext } from './../../../context/UserContext'
import ExamAPI from '../../../api/ExamAPI';
import FrequencyError from './FrequencyError';
import FrequencyOferror from './FrequencyOferror';


function ExamReportContent({ selectedClassId, showReportHeader, setShowReportHeader, getExamAnalysis, testName}) {
  
  const [examAnalysis, setExamAnalysis] = useState([])
  const [showExamAnalysis, setShowExamAnalysis] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sweetError, setSweetError] = useState(false)
  const [studentId, setStudentId] = useState(false)
  const [examReport, setExamReport] = useState([])
  const [isChecked, setIschecked] = useState(false)
  const [frequencyItem, setFrequencyItem] = useState([])
  const [frequencyModal, setFrequencyModal] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const userContext = useContext(UserContext)
  const [testReport, setTestReport] = useState([])
  const {user} = userContext.data
  const [dataDownload, setDataDownload] = useState({});
  const pageURL = new URL(window.location.href);
  let sessionClass = pageURL.searchParams.get("classId")
  let sessionTestId = sessionStorage.getItem("testid")

  const handleShowAnalysis = () => {
    setShowAnalysis(true)
    getFrequencyReport()
  }

  const handleHideAnalysis =() => {
    setShowAnalysis(false)
  }

  const getFrequencyReport = async () =>{
    let response = await new ClassesAPI().getFrequencyReport(sessionClass, sessionTestId)
    if(response.ok){
      setFrequencyItem(response.data)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const handleFrequencyModal = () => {
    setFrequencyModal(true)
    getFrequencyReport()
  }

  const retakeExam = async(classid, testid, studentid) => {
    let isConsider = true
    let response = await new ClassesAPI().retakeExam
    (
      sessionClass, testid, studentId
    )
    if(response.ok){
      notifyRetakeExam()
      getTestReport(null, sessionClass, testid)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const handleGetItems = () => {
    let tempData =[]
    testReport.map((st, index) => {
      let temp= {};
      let name = `${ st.student.lname} ${ st.student.fname}`
      let score = st.studentTests[0].score
      let status = st.studentTests[0].isSubmitted ? 'Submitted' : 'Not Submitted'
      temp[`Student Name`] = name;
      temp.Grade = score;
      temp.Status = status;
      tempData.push(temp);
    })
    console.log(tempData, '-0-0-0-=0-0')
    setDataDownload(tempData);
  }

  const downloadxls = () => {
    const ws =utils.json_to_sheet(dataDownload);
    const wb =utils.book_new();
    utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate XLSX file and send to client */
    writeFileXLSX(wb, `${testName}_exam_report.xlsx`);
  };

  const getTestReport = async(e, sessionClass,testid) => {
    setLoading(true)
    // setViewTestReport(false)
    let response = await new ClassesAPI().getTestReport(sessionClass, testid)
    setLoading(false)
    if(response.ok){
      setTestReport(response.data)
      setExamReport(response.data[0].studentTests)
    }else{
      alert('response.data.errorMessage')
    }
  }

  useEffect(() => {
    handleGetItems();
  },[testReport])

  useEffect(() => {
    if(sessionTestId != null){
      getTestReport(null, sessionClass, sessionTestId)
    }
  }, [])

  const cancelSweetError = () => {
    setSweetError(false)
  }

  const confirmSweetError = (classid, testid, studentid) => {
    retakeExam(classid, testid, studentId)
    setSweetError(false)
  } 

  const notifyRetakeExam = () => 
  toast.success('Exam can now be retaken', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })

  const updateExamAnalysisTrue = async ( startDate, startTime, endDate, endTime, timeLimit) => {
    let showAnalysis = true
    let response = await new ExamAPI().updateExamAnalysis(sessionClass, sessionTestId, {showAnalysis, startDate, startTime, endDate, endTime, timeLimit})
      if(response?.ok){
        getTestReport(null, sessionClass, sessionTestId)
      }else{
        getTestReport(null, sessionClass, sessionTestId)
      }
  }

  const updateExamAnalysisFalse = async ( startDate, startTime, endDate, endTime, timeLimit) => {
    let showAnalysis = false
    let response = await new ExamAPI().updateExamAnalysis(sessionClass, sessionTestId, {showAnalysis, startDate, startTime, endDate, endTime, timeLimit})
      if(response?.ok){
        getTestReport(null, sessionClass, sessionTestId)
      }else{
        getTestReport(null, sessionClass, sessionTestId)
      }
  }

  const handleShowResult = (isChecked, startDate, startTime, endDate, endTime, timeLimit) => {
    let isTrue = isChecked
    if(isTrue === true){
      updateExamAnalysisTrue(startDate, startTime, endDate, endTime, timeLimit)
    }else{
      updateExamAnalysisFalse(startDate, startTime, endDate, endTime, timeLimit)
    }
  }

  const handleCheckBox = (e, startDate, startTime, endDate, endTime, timeLimit, checked) =>{
    handleShowResult(e.target.checked, startDate, startTime, endDate, endTime, timeLimit)
  }
  
  const showResultStudent = () => 
  toast.success('Show Result for all Student!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const disableResultStudent = () => 
  toast.info('Disable Result for all Student!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  // if(showExamAnalysis === false){
  return(
    <>
    {user.student === null ?
      <>
      <Row>
        <Col sm={4}>
        <Card>
          <Card.Body>
            <Card.Title><div className='header-analysis-card'><i class='fa fa-star' style={{marginRight:"10px", fontSize:'30px'}}></i> PERFECT</div></Card.Title>
            <Card.Text>
              <hr></hr>
              <p><b>0</b></p>
            </Card.Text> 
          </Card.Body>
        </Card>    
        </Col>
        <Col sm={4}>
        <Card>
          <Card.Body>
            <Card.Title><div className='header-analysis-card'><i class='fa fa-arrow-circle-up' style={{marginRight:"10px", fontSize:'30px'}}></i>PASSED</div></Card.Title>
            <Card.Text>
              <div>
              <hr></hr>
              <p><b>0</b></p>
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
        </Col>
        <Col sm={4}>
        <Card>
          <Card.Body>
            <Card.Title><div className='header-analysis-card'><i class='fa fa-arrow-circle-down' style={{marginRight:"10px", fontSize:'30px'}}></i>FAILED</div></Card.Title>
            <Card.Text>
              <hr></hr>
              <p><b>0</b></p>
            </Card.Text>
          </Card.Body>
        </Card>
        </Col>
      </Row> 
      <div style={{paddingTop:'20px' , paddingRight:'5px', float:'right', paddingBottom:'35px'}}>
          {/* <Button onClick={() => handleFrequencyModal()}  style={{marginTop:'15px'}} className='btn-showResult'  size='sm' variant="outline-warning"><b> Frequency of error </b></Button> */}
        <Button onClick={() => handleHideAnalysis()} className='btn-showResult'  size='lg' variant="outline-warning"><b> Score </b></Button>
        <Button onClick={() => handleShowAnalysis()} className='btn-showResult'  size='lg' variant="outline-warning"><b> Analysis </b></Button>
        <Button onClick={() => downloadxls()} className='btn-showResult'  size='lg' variant="outline-warning"><b> Export </b></Button>
      </div>
        {showAnalysis === false? (<>
          <div style={{display:'flex', paddingRight:'20px'}}>
            <div style={{float:'right', paddingTop:'35px'}}>
          {examReport[0] &&
            examReport?.map(item => {
              return(
              <Form>
                <Form.Check 
                type="switch"
                name={'showAnalysis'}
                label='Show result'
                checked={item?.classTest?.showAnalysis}
                onChange={(e) => handleCheckBox(e, item?.classTest?.startDate, item?.classTest?.startTime, item?.classTest?.endDate, item?.classTest?.endTime, item?.classTest?.timeLimit, item?.classTest?.showAnalysis)}
              />
              </Form>
              )
            })
          }
        </div>
        </div>
    <Table striped hover size="sm">
      <thead>
        <tr>
          <th>Student Name</th>
          <th>Grade</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {testReport?.map(item =>{
          return (
            item.studentTests.map(st =>{
              return (  
                <tr>
                  <td >
                    <i className="fas fa-user-circle td-icon-report-person m-r-10"></i>
                      <span style={{cursor:'pointer'}} onClick={(e) => getExamAnalysis(item.student.id, st.test.classId, st.test.id, item.student.lname, item.student.fname)} >
                      { item.student.lname} { item.student.fname}
                      {st.isSubmitted == true }
                      </span> 
                  </td>
                  <td>{st.isSubmitted === false ? <Badge bg="danger">Not Submitted</Badge>: <>{st.score}/{st.rawScore}</>}</td>
                  <td>
                    {st.isSubmitted === false ? <Badge bg="danger">Not Submitted</Badge>:<>{st.rawScore/2 <= st.score && <><Badge bg="success">PASSED</Badge></>}
                    {st.rawScore/2 > st.score && <><Badge bg="warning">FAILED</Badge></> }</>}
                  
                  </td>
                  <td>
                    {st.isSubmitted === false ? <spam></spam>: 
                    <Button style={{color:"white"}} variant="warning" size="sm" onClick={() => {setSweetError(true); setStudentId(item.student.id)}}><i class="fas fa-redo"style={{paddingRight:'10px'}} ></i>Retake</Button>
                    }
                    
                    <SweetAlert
                          warning
                          showCancel
                          show={sweetError}
                          confirmBtnText="Yes!"
                          confirmBtnBsStyle="danger"
                          title="Are you sure?"
                          onConfirm={() => confirmSweetError(st.test.classId, st.test.id, item.student.id)}
                          onCancel={cancelSweetError}
                          focusCancelBtn
                        >
                          Retake the exam?
                      </SweetAlert>
                  </td>
                  <td>

                  </td>
                </tr>
              )
            })
            )
          })
        }
      </tbody>
    </Table>
      </>):<FrequencyOferror frequencyItem={frequencyItem} />}
    </>
    :
    <div onClick={(e) => getExamAnalysis(user.student.id, sessionClass, sessionTestId, user.student.lname, user.student.fname)}>{user.student.lname}</div>
    }
    <FrequencyError frequencyItem={frequencyItem} setFrequencyModal={setFrequencyModal} frequencyModal={frequencyModal} />
    
    </>
  )
// }else{
//     return(
//       <>
//         <ExamAnalysis examAnalysis={examAnalysis} setExamAnalysis={setExamAnalysis} testReport={testReport}/>
//       </>
//     )
//   }

}
export default ExamReportContent