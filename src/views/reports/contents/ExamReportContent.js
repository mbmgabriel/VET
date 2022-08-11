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
  const [sorted, setSorted] = useState([])
  const [alphabetical, setAlphabetical] = useState(true);
  const {user,themeColor} = userContext.data
  const [dataDownload, setDataDownload] = useState({});
  const pageURL = new URL(window.location.href);
  const [perfect, setPerfect] = useState(0)
  const [passed, setPassed] = useState(0)
  const [failed, setFailed] = useState(0)
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
      let score = `${st.studentTests[0].score}/${st.studentTests[0].rawScore}`
      let isSubmitted = st.studentTests[0].isSubmitted;
      let ifPassed = st.studentTests[0].rawScore/2 <= st.studentTests[0].score ? 'Passed': 'Failed';
      let status = isSubmitted ? ifPassed : 'Not Submitted'
      temp[`Student Name`] = name;
      temp.Grade = isSubmitted ? score : 'Not Submitted';
      temp.Status = status;
      tempData.push(temp);
    })
    setDataDownload(tempData);
  }

  const getPerfectScore = (data) =>{ 
    data.map(item =>{
      let rawScore = item?.studentTests[0].rawScore
      let score = item?.studentTests[0].score
      let isSubmitted = item?.studentTests[0].isSubmitted
        if(isSubmitted === true && rawScore === score){
          return setPerfect(perfect+1)
        }
    })
  }

  const getPassedScore = (data) =>{
     data.map(item =>{
      let rawScore = item?.studentTests[0].rawScore/2
      let score = item?.studentTests[0].score
      let isSubmitted = item?.studentTests[0].isSubmitted
        if(isSubmitted === true && rawScore <= score){
          return setPassed(passed+1)
        }
    })
  }

  const getFailedScore = (data) => {
    data.map(item =>{
      let rawScore = item?.studentTests[0].rawScore/2
      let score = item?.studentTests[0].score
      let isSubmitted = item?.studentTests[0].isSubmitted
        if(isSubmitted === true && rawScore > score){
          return setFailed(failed+1)
        }
    })
  }

  const downloadxls = () => {
    const ws =utils.json_to_sheet(dataDownload);
    const wb =utils.book_new();
    utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate XLSX file and send to client */
    writeFileXLSX(wb, `${testName}_exam_report.xlsx`);
  };
  
  const arrageAlphabetical = (data) => {
    let temp = data?.sort(function(a, b){
      let nameA = a.student.lname.toLocaleLowerCase();
      let nameB = b.student.lname.toLocaleLowerCase();
      if (nameA < nameB) {
          return -1;
      }
    });
    setSorted(temp)
}

const arrageNoneAlphabetical = (data) => {
  let temp = data?.sort(function(a, b){
    let nameA = a.student.lname.toLocaleLowerCase();
    let nameB = b.student.lname.toLocaleLowerCase();
    if (nameA > nameB) {
        return -1;
    }
  });
  setSorted(temp)
}

console.log("testReport:", testReport)

useEffect(()=>{
    arrageNoneAlphabetical(testReport);
    arrageAlphabetical(testReport);
    getPerfectScore(testReport)
    getPassedScore(testReport)
    getFailedScore(testReport)
}, [testReport])

const handleClickIcon = () =>{
  setAlphabetical(!alphabetical);
  if(!alphabetical){
    arrageAlphabetical(testReport);
  }
  else{
    arrageNoneAlphabetical(testReport);
  }
}

// useEffect(()=>{
//   getPerfectScore(testReport)
//   getPassedScore(testReport)
//   getFailedScore(testReport)
// }, [])


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
            <div className='header-analysis-card' ><i class='fa fa-star' style={{marginRight:"10px", fontSize:'30px'}}></i> PERFECT</div>
            <Card.Text>
              <hr></hr>
              <p><b>{perfect}</b></p>
            </Card.Text> 
          </Card.Body>
        </Card>    
        </Col>
        <Col sm={4}>
        <Card>
          <Card.Body>
              <div className='header-analysis-card' ><i class='fa fa-arrow-circle-up' style={{marginRight:"10px", fontSize:'30px'}}></i>PASSED</div>
            <Card.Text>
              <div>
              <hr></hr>
              <p><b> {passed} </b></p>
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
        </Col>
        <Col sm={4}>
        <Card>
          <Card.Body>
            <div className='header-analysis-card' ><i class='fa fa-arrow-circle-down' style={{marginRight:"10px", fontSize:'30px'}}></i>FAILED</div>
            <Card.Text>
              <hr></hr>
              <p><b> {failed} </b></p>
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
            <th><div className='class-enrolled-header'> Student Name{' '} <i onClick={() => handleClickIcon()} className={`${!alphabetical ? 'fas fa-sort-alpha-down' : 'fas fa-sort-alpha-up'} td-file-page`}></i></div></th>
              <th>Grade</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted?.map(item =>{
              return (
                item.studentTests.map(st =>{
                  return (  
                    <tr>
                      <td >
                        <i className="fas fa-user-circle td-icon-report-person m-r-10"></i>
                          <span style={{cursor:'pointer'}} onClick={(e) => {
                            getExamAnalysis(item.student.id, sessionClass, st.test.id, item.student.lname, item.student.fname);
                            sessionStorage.setItem('studentid', item.student.id)
                            }}>
                          { item.student.lname} { item.student.fname}
                          {st.isSubmitted == true }
                          </span> 
                      </td>
                      <td>{st.isSubmitted ? <>{st.score}/{st.rawScore}</> : <Badge bg="danger">Not Submitted</Badge>}</td>
                      <td>
                        {
                          st.isSubmitted ?
                          <>
                          {st.rawScore/2 <= st.score && <Badge bg="success">PASSED</Badge>}&nbsp;
                          {st.rawScore === st.score && <Badge bg="success">Perfect</Badge>}
                          {st.rawScore/2 > st.score && <Badge bg="warning">FAILED</Badge>}
                          </>
                          :
                          <Badge bg="danger">Not Submitted</Badge>
                        }
                      </td>
                      <td>
                        {
                          st.isSubmitted && 
                          <Button style={{color:"white" }} className='tficolorbg-button' variant="" size="sm" onClick={() => {setSweetError(true); setStudentId(item.student.id)}}><i class="fas fa-redo"style={{paddingRight:'10px'}} ></i>Retake</Button>
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
    <Table striped hover size="sm">
      <thead>
        <tr>
        <th><div className='class-enrolled-header'> Student Name</div></th>
          <th>Grade</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {sorted?.map(item =>{
          return (
            item.student.id == user.student.id &&
            item.studentTests.map(st =>{
              return (  
                st.classTest.showAnalysis ? 
                <tr>
                  <td >
                    <i className="fas fa-user-circle td-icon-report-person m-r-10"></i>
                      <span style={{cursor:'pointer'}}
                      // onClick={(e) => {
                      //   getExamAnalysis(item.student.id, sessionClass, st.test.id, item.student.lname, item.student.fname);
                      //   sessionStorage.setItem('studentid', item.student.id)
                      //   }}
                        >
                      { item.student.lname} { item.student.fname}
                      </span> 
                  </td>
                  <td>{st.isSubmitted ? <>{st.score}/{st.rawScore}</> : <Badge bg="danger">Not Submitted</Badge>}</td>
                  <td>
                    {
                      st.isSubmitted ?
                      <>
                      {st.rawScore/2 <= st.score && <><Badge bg="success">PASSED</Badge></>}
                      {st.rawScore/2 > st.score && <><Badge bg="warning">FAILED</Badge></> }
                      </>
                      :
                      <Badge bg="danger">Not Submitted</Badge>
                    }
                  </td>
                  <td>
                  </td>
                </tr>
                :
                <td>Nothing to display.</td>
              )
            })
            )
          })
        }
      </tbody>
    </Table>
    }
    <FrequencyError frequencyItem={frequencyItem} setFrequencyModal={setFrequencyModal} frequencyModal={frequencyModal} />
    
    </>
  )
}
export default ExamReportContent