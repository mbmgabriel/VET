import React, {useState, useEffect} from 'react'
import {InputGroup, FormControl, Button } from 'react-bootstrap';
import TaskReport from './components/TaskReport';
import ClassesAPI from '../../api/ClassesAPI';
import { toast } from 'react-toastify'
import ReportContainer from './Reports';
import TaskReportContent from './contents/TaskReportContent';
import ReportBreedCrumbs from './components/ReportsBreadCrumbs';
import TaskAnalysis from './contents/TaskAnalysis';

function TaskReportPage() {

	const [filter, setFilter] = useState("")
  const [taskReport, setTaskReport] = useState([])
  const [display, setDisplay] = useState('accordion')
  const [classesModules, setClassesModules] = useState([])
  const [currentClassId, setCurrentClassId] = useState()
  const [taskName, setTaskName] = useState('')
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
      toast.error("Something went wrong while fetching all class modules.")
    }
  }

  const getTaskReport = async(e, taskid, taskname) => {
    // setLoading(true)
    setDisplay('taskReport');
    setTaskName(taskname)
    // setViewTaskReport(false)
    sessionStorage.setItem('taskName',taskname)
    sessionStorage.setItem('taskId',taskid)
    let response = await new ClassesAPI().getTaskReport(currentClassId, taskid, taskname)
    // setLoading(false)
    if(response.ok){
      setTaskReport(response.data)
      // console.log(response.data)
    }else{
      toast.error(response.data.errorMessage)
    }
  }
	let taskname = sessionStorage.getItem("taskName")


  const handleClickBreedFirstItem = () => {
    setDisplay('accordion');
    setStudentName('')
    setTaskName('');
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
      <ReportBreedCrumbs title={taskName ? taskName : ''} secondItem={studentName ? studentName : ''} clicked={()=> handleClickBreedFirstItem()} clickedSecondItem={()=>handleClickSecondItem()}/>
		  {display == 'accordion' ? <div>
        <div className="col-md-10 pages-header fd-row mr-3"><p className='title-header m-0'>Grade Report - Task </p>
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
              <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search..." type="search" onChange={(e) => onSearch(e.target.value)} />
              <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
            </InputGroup>
          </div>
        </div>
      </div>
      :
      <div className="col-md-10 pages-header fd-row mr-3"><p className='title-header m-0'>{taskname}</p>
        {
          display == 'taskReport' && <div>
            <Button
              onClick={(e) => {
                let taskid = sessionStorage.getItem('taskId');
                let taskname = sessionStorage.getItem('taskName');
                display == 'taskReport' && getTaskReport(e, taskid, taskname);
              }}
              className='ml-3'
            >
              <i className="fa fa-sync"></i>
            </Button>
          </div>
        }
      </div>
      }
      {display == 'accordion' && <TaskReport filter={filter} setFilter={setFilter} getTaskReport={getTaskReport} classesModules={classesModules} setClassesModules={setClassesModules} />}
      {display == 'taskReport' && <TaskReportContent setTaskReport={setTaskReport} getTaskAnalysis={handleGetTaskAnalysis} taskReport={taskReport}/>}
      {display == 'analysis' && <TaskAnalysis taskAnalysis={taskAnalysis} setTaskAnalysis={setTaskAnalysis}/>}

	  </ReportContainer>
	)
}
export default TaskReportPage

