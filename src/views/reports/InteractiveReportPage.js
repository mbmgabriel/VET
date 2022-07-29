import React, {useState, useEffect} from 'react'
import {InputGroup, FormControl, Button } from 'react-bootstrap';
import InteractiveReport from './components/InteractiveReport';
import ClassesAPI from '../../api/ClassesAPI';
import { toast } from 'react-toastify'
import ReportContainer from './Reports';
import InteractiveReportContent from './contents/InteractiveReportContent';
import ReportBreedCrumbs from './components/ReportsBreadCrumbs';
import FullScreenLoader from '../../components/loaders/FullScreenLoader';
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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    let response = await new ClassesAPI().getClassModules(id)
    if(response.ok){
      setClassesModules(response.data)
      setLoading(false);
      console.log(response.data)
    }else{
      toast.error("Something went wrong while fetching all class modules.")
      setLoading(false);
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
      toast.error(response.data?.errorMessage)
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
        toast.error(response.data.errorMessage)
      }
    }

	return (
		<ReportContainer>
      {loading && <FullScreenLoader />}
      <ReportBreedCrumbs title={interactiveName ? interactiveName : ''} secondItem={studentName ? studentName : ''} clicked={()=> handleClickBreedFirstItem()} clickedSecondItem={()=>handleClickSecondItem()}/>
		  {display == 'accordion' ? <div>
        <div className="col-md-10 pages-header fd-row mr-3"><p className='title-header m-0'>Grade Report - Interactive </p>
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
              <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm"  placeholder="Search for interactive name here ..." type="search" onChange={(e) => onSearch(e.target.value)} />
              <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
            </InputGroup>
          </div>
        </div>
      </div>
      :
      <div className="col-md-10 pages-header fd-row mr-3"><p className='title-header m-0'>{interactiveName}</p>
    </div>
      }
      {display == 'accordion' && <InteractiveReport filter={filter} setFilter={setFilter} getInteractiveReport={getInteractiveReport} classesModules={classesModules} setClassesModules={setClassesModules} />}
      {display == 'interactiveReport' && <InteractiveReportContent interactiveName={interactiveName} getTaskAnalysis={handleGetTaskAnalysis} interactiveReport={interactiveReport}/>}

	  </ReportContainer>
	)
}
export default InteractiveReportPage

