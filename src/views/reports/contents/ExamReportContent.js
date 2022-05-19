import React, {useState, useEffect, useContext} from 'react'
import {Badge, Table, Button, Form} from 'react-bootstrap'
import ClassesAPI from '../../../api/ClassesAPI'
import ExamAnalysis from './ExamAnalysis'
import { toast } from 'react-toastify';
import SweetAlert from 'react-bootstrap-sweetalert';
import { UserContext } from './../../../context/UserContext'
import ExamAPI from '../../../api/ExamAPI';


function ExamReportContent({ selectedClassId, testReport, setTestReport, showReportHeader, setShowReportHeader}) {
  
  const [examAnalysis, setExamAnalysis] = useState([])
  const [showExamAnalysis, setShowExamAnalysis] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sweetError, setSweetError] = useState(false)
  const [studentId, setStudentId] = useState(false)
  const [examReport, setExamReport] = useState([])
  const [isChecked, setIschecked] = useState(false)
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  let sessionClass = sessionStorage.getItem("classId")
  let sessionTestId = sessionStorage.getItem("testid")

  const getExamAnalysis = async(e, studentid, classid, testid) => {
    console.log(selectedClassId)
    sessionStorage.setItem('analysis','true')
    sessionStorage.setItem('studentid',studentid)
    sessionStorage.setItem('testid',testid)
    setShowExamAnalysis(true)
    let response = await new ClassesAPI().getExamAnalysis(studentid, sessionClass, testid)
    if(response.ok){
      setExamAnalysis(response.data)
      console.log(response.data)
      
    }else{
      alert("Something went wrong while fetching all courses")
    }
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

  const getTestReport = async(e, selectedClassId,testid) => {
    setLoading(true)
    // setViewTestReport(false)
    let response = await new ClassesAPI().getTestReport(selectedClassId, testid)
    setLoading(false)
    if(response.ok){
      setTestReport(response.data)
      setExamReport(response.data[0].studentTests)
      console.log('asdasda:', response.data)
    }else{
      alert(response.data.errorMessage)
    }
  }

  useEffect(() => {
    if(selectedClassId != null){
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

  useEffect(() => {
    setShowReportHeader(true)
  }, [])

  console.log('testReport:' ,  testReport)

  const updateExamAnalysisTrue = async ( startDate, startTime, endDate, endTime, timeLimit) => {
    let showAnalysis = true
    let response = await new ExamAPI().updateExamAnalysis(sessionClass, sessionTestId, {showAnalysis, startDate, startTime, endDate, endTime, timeLimit})
      if(response?.ok){
        alert('SSSSSSSSSSS')
      }else{
        getTestReport(null, sessionClass, sessionTestId)
        
      }
  }

  const updateExamAnalysisFalse = async ( startDate, startTime, endDate, endTime, timeLimit) => {
    let showAnalysis = false
    let response = await new ExamAPI().updateExamAnalysis(sessionClass, sessionTestId, {showAnalysis, startDate, startTime, endDate, endTime, timeLimit})
      if(response?.ok){
        alert('AAAAAAAAAAAAAAA')
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

  const handleCheckBox = (e, startDate, startTime, endDate, endTime, timeLimit) =>{
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

  if(showExamAnalysis === false){
  return(
    <>
    {user.student === null ?
    <Table striped hover size="sm">
      <thead>
        <tr>
          <th>Student Name</th>
          <th>Grade</th>
          <th>Actions</th>
          <th style={{float:'left'}}>
            {examReport[0] &&
              examReport?.map(item => {
                return(
                  <Form>
                  <Form.Check 
                  type="switch"
                  name={'showAnalysis'}
                  label='Show Result'
                  checked={item?.classTest?.showAnalysis}
                  onChange={(e) => handleCheckBox(e, item?.classTest?.startDate, item?.classTest?.startTime, item?.classTest?.endDate, item?.classTest?.endTime, item?.classTest?.timeLimit)}
                />
                </Form>
                )
              })
            }
          </th>
        </tr>
      </thead>
      <tbody>
        {testReport.map(item =>{
          return (
            item.studentTests.map(st =>{
              return (
                <tr>
                  <td >
                    <i className="fas fa-user-circle td-icon-report-person m-r-10"></i>
                      <span onClick={(e) => getExamAnalysis(e, item.student.id, st.test.classId, st.test.id)} >
                      { item.student.lname} { item.student.fname} 
                      </span> 
                  </td>
                  <td>{st.isSubmitted === false ? <Badge bg="warning">Not Submitted</Badge>: st.score}</td>
                  {/* <td>{st.score}</td> */}
                  <td>
                    {/* <Button variant="outline-warning" size="sm" onClick={(e) => retakeExam(e, st.test.classId, st.test.id, item.student.id)}><i class="fas fa-redo"style={{paddingRight:'10px'}} ></i>Retake</Button> */}
                    <Button style={{color:"white"}} variant="warning" size="sm" onClick={() => {setSweetError(true); setStudentId(item.student.id)}}><i class="fas fa-redo"style={{paddingRight:'10px'}} ></i>Retake</Button>
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
    :
    <div onClick={(e) => getExamAnalysis(e, user.student.id, sessionClass, sessionTestId)}>{user.student.lname}</div>
    }
    </>
  )}else{
    return(
    <ExamAnalysis showReportHeader={showReportHeader} setShowReportHeader={setShowReportHeader} examAnalysis={examAnalysis} setExamAnalysis={setExamAnalysis} testReport={testReport}/>
    )
  }
}
export default ExamReportContent