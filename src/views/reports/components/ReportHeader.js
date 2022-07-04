import React, {useState, useEffect, useContext} from 'react'
import {InputGroup, FormControl } from 'react-bootstrap';
import ExamReport from './ExamReport';
import ReportContainer from '../Reports';
import ClassesAPI from '../../../api/ClassesAPI';
import ExamReportContent from '../contents/ExamReportContent';

function ReportHeader({classesModules, setClassesModules, selectedClassId, viewTestReport, setViewTestReport, viewAssignmentReport, setViewAssignmentReport, showReportHeader, setShowReportHeader}) {
	const [filter, setFilter] = useState("")
	const [testReport, setTestReport] = useState({});
  const [display, setDisplay] = useState('accordion')
	const onSearch = (text) => {
    setFilter(text)
  }
	let testname = sessionStorage.getItem("testName")

  const getTestReport = async(e, testid, testname, classid) => {
    setDisplay('testReport')
    // setLoading(true)
    sessionStorage.setItem('testName',testname)
    sessionStorage.setItem('testid',testid)
    let sessionClass = sessionStorage.getItem("classId")
    // setViewTestReport(false)
    let response = await new ClassesAPI().getTestReport(sessionClass, testid)
    // setLoading(false)
    if(response.ok){
      setTestReport(response.data) 
      // setStartDate(response.studentTests.classTest.startDate)
    }else{
      alert(response.data.errorMessage)
    }
  }

	return (
		<ReportContainer>
		{showReportHeader === false ?
			<div>
				<div className="row m-b-20">
					<div className="col-md-10 pages-header"><h1>Grade Report - Exam</h1></div>
				</div>
				<div className="row m-b-20 m-t-30" onSearch={onSearch}>
					<div className="col-md-12">
						<InputGroup size="lg">
							<FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search..." type="search" onChange={(e) => onSearch(e.target.value)} />
							<InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
						</InputGroup>
					</div>
				</div>
			</div>
		:
			<div className="col-md-4 pages-header"><h1>{testname}</h1></div>
		}
		<ExamReport filter={filter} getTestReport={getTestReport} setFilter={setFilter} showReportHeader={showReportHeader} setShowReportHeader={setShowReportHeader} classesModules={classesModules} setClassesModules={setClassesModules} selectedClassId={selectedClassId} viewTestReport={viewTestReport} setViewTestReport={setViewTestReport}/>
    {display == 'testReport' && <ExamReportContent/>}
  </ReportContainer>
	)
}
export default ReportHeader

