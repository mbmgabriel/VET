import React, { useState, useEffect } from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import AssignmentReport from './components/AssignmentReport';
import ClassesAPI from '../../api/ClassesAPI';
import { toast } from 'react-toastify'
import ReportContainer from './Reports';
import AssignmentReportContent from './contents/AssignmentReportContent';
import ReportBreedCrumbs from './components/ReportsBreadCrumbs';
import AssignmentAnalysis from './contents/AssignmentAnalysis';

function AssignmentReportPage() {

  const [filter, setFilter] = useState("")
  const [assignmentReport, setAssignmentReport] = useState([])
  const [display, setDisplay] = useState('accordion')
  const [classesModules, setClassesModules] = useState([])
  const [currentClassId, setCurrentClassId] = useState()
  const [assignmentName, setAssignmentName] = useState('')
  const [assignmentAnalysis, setAssignmentAnalysis] = useState([])
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

  const getClassModules = async (id) => {
    let response = await new ClassesAPI().getClassModules(id)
    if (response.ok) {
      setClassesModules(response.data)
      console.log(response.data)
    } else {
      toast.error("Something went wrong while fetching all class modules.")
    }
  }

  const getAssignmentReport = async (e, assignmentid, assignmentname) => {
    setDisplay('assignmentReport');
    setAssignmentName(assignmentname);
    sessionStorage.setItem('assignmentName', assignmentname)
    sessionStorage.setItem('assignmentId', assignmentid)
    let response = await new ClassesAPI().getAssignmentReport(paramsId, assignmentid)
    if (response.ok) {
      setAssignmentReport(response.data)
      console.log(response.data)
    } else {
      toast.error(response.data.errorMessage)
    }
  }

  const handleClickBreedFirstItem = () => {
    setDisplay('accordion');
    setStudentName('')
    setAssignmentName('');
  }

  const handleClickSecondItem = () => {
    setDisplay('assignmentReport');
    setStudentName('')
  }

  const handleGetAssignmentAnalysis = async (e, studentid, classid, assignmentId, lname, fname) => {
    // console.log(selectedClassId)
    setDisplay('analysis');
    sessionStorage.setItem('analysis', 'true')
    sessionStorage.setItem('studentid', studentid)
    setStudentName(`${lname}, ${fname}`)
    let response = await new ClassesAPI().getAssignmentAnalysis(studentid, paramsId, assignmentId)
    if (response.ok) {
      setAssignmentAnalysis(response.data)
      console.log(response.data)

    } else {
      toast.error(response.data.errorMessage)
    }
  }

  return (
    <ReportContainer>
      <ReportBreedCrumbs title={assignmentName ? assignmentName : ''} secondItem={studentName ? studentName : ''} clicked={() => handleClickBreedFirstItem()} clickedSecondItem={() => handleClickSecondItem()} />
      {display == 'accordion' ? <div>
        <div className="col-md-10 pages-header fd-row mr-3"><p className='title-header m-0'>Grade Report - Assignment </p>
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
        <div className="col-md-10 pages-header fd-row mr-3"><p className='title-header m-0'>{assignmentName}</p>
          {
            display == 'assignmentReport' && <div>
              <Button
                onClick={(e) => {
                  let assignmentId = sessionStorage.getItem('assignmentId');
                  let assignmentName = sessionStorage.getItem('assignmentName');
                  display == 'assignmentReport' && getAssignmentReport(e, assignmentId, assignmentName);
                }}
                className='ml-3'
              >
                <i className="fa fa-sync"></i>
              </Button>
            </div>
          }
        </div>
      }
      {display == 'accordion' && <AssignmentReport filter={filter} setFilter={setFilter} getAssignmentReport={getAssignmentReport} classesModules={classesModules} setClassesModules={setClassesModules} />}
      {display == 'assignmentReport' && <AssignmentReportContent setAssignmentRepor={setAssignmentReport} getAssignmentAnalysis={handleGetAssignmentAnalysis} assignmentReport={assignmentReport} />}
      {display == 'analysis' && <AssignmentAnalysis assignmentAnalysis={assignmentAnalysis} setAssignmentAnalysis={setAssignmentAnalysis} />}

    </ReportContainer>
  )
}
export default AssignmentReportPage

