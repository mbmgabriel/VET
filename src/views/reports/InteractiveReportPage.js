import React, {useState, useEffect} from 'react'
import {InputGroup, FormControl } from 'react-bootstrap';
import InteractiveReport from './components/InteractiveReport';
import ClassesAPI from '../../api/ClassesAPI';
import { toast } from 'react-toastify'
import ReportContainer from './Reports';
import InteractiveReportContent from './contents/InteractiveReportContent';
import ReportBreedCrumbs from './components/ReportsBreadCrumbs';
// import InteractiveAnalysis from './contents/InteractiveAnalysis';

function InteractiveReportPage() {
	const [filter, setFilter] = useState("")
  const [interactiveReport, setInteractiveReport] = useState([])
  const [display, setDisplay] = useState('accordion')
  const [classesModules, setClassesModules] = useState([])
  const [currentClassId, setCurrentClassId] = useState()
  const [interactiveName, setInteractiveName] = useState('')
  const [taskAnalysis, setTaskAnalysis] = useState([])
  const [studentName, setStudentName] = useState('')

	const onSearch = (text) => {
    setFilter(text)
  }

  const pageURL = new URL(window.location.href);
  const paramsId = pageURL.searchParams.get("classId");

  useEffect(() => {
    getClassModules(paramsId)
    setCurrentClassId(paramsId)
  }, []);

  const getClassModules = async(id) => {
    let response = await new ClassesAPI().getClassModules(id)
    if(response.ok){
      setClassesModules(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all courses --")
    }
  }

  const getInteractiveReport = async(e, interactiveid, interactivename) => {
    setDisplay('interactiveReport');
    setInteractiveName(interactivename);
    sessionStorage.setItem('interactiveName',interactivename)
    let response = await new ClassesAPI().getInteractiveReport(paramsId, interactiveid, interactivename)
    if(response.ok){
      setInteractiveReport(response.data)
      console.log(response.data)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const handleClickBreedFirstItem = () => {
    setDisplay('accordion');
    setStudentName('')
    setInteractiveName('');
  }

  const handleClickSecondItem = () => {
    setDisplay('taskReport');
    setStudentName('')
  }

  const handleGetTaskAnalysis = async(e, studentid, classid, taskid, lname, fname) => {

    sessionStorage.setItem('studentid',studentid)
    setStudentName(`${lname}, ${fname}`)
    setDisplay('analysis');
      let response = await new ClassesAPI().getTaskAnalysis(studentid, currentClassId, taskid)
      if(response.ok){
        setTaskAnalysis(response.data)
        console.log(response.data)
        
      }else{
        alert(response.data.errorMessage)
      }
    }

	return (
		<ReportContainer>
      <ReportBreedCrumbs title={interactiveName ? interactiveName : ''} secondItem={studentName ? studentName : ''} clicked={()=> handleClickBreedFirstItem()} clickedSecondItem={()=>handleClickSecondItem()}/>
		  {display == 'accordion' ? <div>
        <div className="row m-b-20">
          <div className="col-md-8 pages-header"><h1>Grade Report - Interactive</h1></div>
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
      <div className="col-md-4 pages-header"><h1>{interactiveName}</h1></div>
      }
      {display == 'accordion' && <InteractiveReport filter={filter} setFilter={setFilter} getInteractiveReport={getInteractiveReport} classesModules={classesModules} setClassesModules={setClassesModules} />}
      {display == 'interactiveReport' && <InteractiveReportContent getTaskAnalysis={handleGetTaskAnalysis} interactiveReport={interactiveReport}/>}

	  </ReportContainer>
	)
}
export default InteractiveReportPage

