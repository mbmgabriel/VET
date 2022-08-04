import React, { useState, useEffect, useContext } from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import ExamReport from './components/ExamReport';
import ReportContainer from './Reports';
import ClassesAPI from '../../api/ClassesAPI';
import ExamReportContent from './contents/ExamReportContent';
import ExamAnalysis from './contents/ExamAnalysis';
import ReportBreedCrumbs from './components/ReportsBreadCrumbs'
import { toast } from 'react-toastify';
import FullScreenLoader from '../../components/loaders/FullScreenLoader';
function ReportHeader() {
  const [filter, setFilter] = useState("")
  const [testReport, setTestReport] = useState({});
  const [display, setDisplay] = useState('accordion')
  const [classesModules, setClassesModules] = useState([])
  const [currentClassId, setCurrentClassId] = useState()
  const [testName, setTestName] = useState('')
  const [examAnalysis, setExamAnalysis] = useState([])
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(false);

  const onSearch = (text) => {
    setFilter(text)
  }
  let testname = sessionStorage.getItem("testName")
  const pageURL = new URL(window.location.href);
  const paramsId = pageURL.searchParams.get("classId");

  useEffect(() => {
    getClassModules(paramsId)
    setCurrentClassId(paramsId)
  }, []);

  const getClassModules = async (selectedClassId) => {
    setLoading(true);
    console.log(selectedClassId)
    let response = await new ClassesAPI().getClassModules(selectedClassId)
    if (response.ok) {
      setClassesModules(response.data)
      setLoading(false);
    } else {
      toast.error("Something went wrong while fetching class modules.")
    }
  }

  const getTestReport = async (testid, testname, classid) => {
    setDisplay('testReport')
    setLoading(true)
    sessionStorage.setItem('testName', testname)
    sessionStorage.setItem('testid', testid)
    let response = await new ClassesAPI().getTestReport(currentClassId, testid)
    setLoading(false)
    if (response.ok) {
      setTestReport(response.data)
      setLoading(false)
    } else {
      setLoading(false)
      toast.error(response.data?.ErrorMessage)
    }
  }

  const handlegetTestReport = (item) => {
    console.log(item, '--------')
    setTestName(item.test.testName)
    getTestReport(item.test.id, item.test.testName, item.test.classId)
  }

  const handleGetExamAnalysis = async (studentid, sessionClass, testid, lname, fname) => {
    console.log({studentid})
    // console.log(item)
    // const getExamAnalysis = async(e, studentid, classid, testid) => {
    setDisplay('analysis')
    // setShowExamAnalysis(true)
    setStudentName(`${lname}, ${fname}`)
    let response = await new ClassesAPI().getExamAnalysis(studentid, sessionClass, testid)
    if (response.ok) {
      setExamAnalysis(response.data)

    } else {
      // toast.error(response.data.errorMessage, {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
    }
  }

  const handleClickBreedFirstItem = () => {
    setDisplay('accordion');
    setStudentName('')
    setTestName('');
  }

  const handleClickSecondItem = () => {
    setDisplay('testReport');
    setStudentName('')
  }

  return (
    <ReportContainer>
      {loading && <FullScreenLoader />}
      <ReportBreedCrumbs title={testName ? testName : ''} secondItem={studentName ? studentName : ''} clicked={() => handleClickBreedFirstItem()} clickedSecondItem={() => handleClickSecondItem()} />
      <div>
        <div className="row m-b-20">
          {
            display == 'accordion' ?
              <>
              <div>
                <div className="col-md-10 pages-header fd-row mr-3"><p className='title-header m-0'>Grade Report - Exam </p>
                  <div>
                    <Button onClick={() => {
                      getClassModules(paramsId);
                    }} className='ml-3'>
                      <i className="fa fa-sync"></i>
                    </Button>
                  </div>
                </div>
                <div className="row m-b-20 m-t-30" onSearch={onSearch}>
                  <div className="col-md-12">
                    <InputGroup size="lg">
                      <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search for exam name here ..." type="search" onChange={(e) => onSearch(e.target.value)} />
                      <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
                    </InputGroup>
                  </div>
                </div>
              </div>
              </>
              :
              <div className="col-md-10 pages-header fd-row mr-3"><p className='title-header m-0'>{testname}</p>
                {
                  display == 'testReport' && <div>
                    <Button
                      onClick={() => {
                        let testID = sessionStorage.getItem('testid');
                        let testName = sessionStorage.getItem('testName');
                        display == 'testReport' && getTestReport(testID, testName, currentClassId);
                      }}
                      className='ml-3'
                    >
                      <i className="fa fa-sync"></i>
                    </Button>
                  </div>
                }
              </div>
          }
				</div>
			</div>
		{display == 'accordion' && <ExamReport filter={filter} setFilter={setFilter} getTestReport={handlegetTestReport} classesModules={classesModules} selectedClassId={currentClassId}/>}
    {display == 'testReport' && <ExamReportContent testName={testname} showReportHeader={true} getExamAnalysis={handleGetExamAnalysis} setShowReportHeader={()=> console.log('')} setTestReport={()=> alert('setTestReport')} testReport={testReport}/>}
    {display == 'analysis' && <ExamAnalysis examAnalysis={examAnalysis} setExamAnalysis={setExamAnalysis} getExamAnalysis={handleGetExamAnalysis} />}
  </ReportContainer>
	)
}
export default ReportHeader

