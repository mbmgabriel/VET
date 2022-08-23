import React, {useState, useEffect, useContext} from 'react'
import MainContainer from '../../components/layouts/MainContainer'
import SideReport from './components/SideReport'
import { UserContext } from './../../context/UserContext'
import {Form,ListGroup, Row, Col} from 'react-bootstrap'
import { Link } from 'react-router-dom';
import ClassesAPI from './../../api/ClassesAPI'
import AcademicTermAPI from './../../api/AcademicTermAPI';

import FullScreenLoader from '../../components/loaders/FullScreenLoader'
import { toast } from 'react-toastify'
import { set } from 'react-hook-form'

export default function Reports({children}) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [classId, setClassId] = useState('')
  const currentLoc = window.location.pathname;
  const [loading, setLoading] = useState(false);
  const subsType = user.subsType;
  const [currentAcademicTerm, setCurrentAcademicTerm] = useState('');

  useEffect(() => {
    const pageURL = new URL(window.location.href);
    let currentClassId = pageURL.searchParams.get("classId");
    setClassId(currentClassId)
  }, []);

  useEffect(() => {
    console.log(user)
    getAcademicTerm();
    if(user.role === "Teacher"){
      getClasses()
    }
    if(user.role === "Student"){
      getClassesStudent()
    }
    if(user.role === "School Admin"){
      getSchoolAdminClasses();
    }
  }, [])

  const getClasses = async() => {
    setLoading(true);
    let response = await new ClassesAPI().getClasses(user.teacher.id)
    if(response.ok){
      setClasses(response.data)
      setLoading(false);
    }else{
      alert("Something went wrong while fetching all classes")
      setLoading(false);
    }
  }

  const getSchoolAdminClasses = async() => {
    setLoading(true)
    let response = await new ClassesAPI().getAllClass();
    setLoading(false)
    if(response.ok){
      setClasses(response.data)
    }else{
      alert("Something went wrong while fetching all Classes")
    }
    setLoading(false);
  }


  const getClassesStudent = async() => {
    setLoading(true)
    let response = await new ClassesAPI().getClassesStudent(user.student.id)
    if(response.ok){
      setClasses(response.data)
    setLoading(false);
    }else{
      alert("Something went wrong while fetching all classes")
      setLoading(false);
    }
  }

  const onShowClassModules = (e) => {
    
    sessionStorage.removeItem("taskName")
    sessionStorage.removeItem("assignmentName")
    // setShowReportHeader(false)
    setSelectedClassId(e.target.value)
    // setViewTestReport(true)
    // setViewTaskReport(true)
    // setViewInteractiveReport(true)
  }

  const addClassIdOnParams = (id) => {
    if(id == ''){
      toast.error('Please Select Class')
    }else{
      setLoading(true)
      let newURL = new URL(window.location);
      newURL.searchParams.set('classId', id);
      window.history.pushState(null, '', newURL.toString());
      setClassId(id);
      setLoading(false);
      if(window.location.pathname !== '/reports'){
        window.location.reload();
      setLoading(false);
      }
    }

  }

  const getAcademicTerm = async () =>{
    let response = await new AcademicTermAPI().fetchAcademicTerm()
    if(response.ok){
      let data = response.data;
      let obj = data.find(o => o.isCurrentTerm == true);
      setCurrentAcademicTerm(obj.academicTermName);
    }
  }

  return (
    <MainContainer activeHeader={'reports'} fluid style=''> 
      {loading && <FullScreenLoader />}
      {/* <SideReport/> */}
      <Col style={{height: 100}} />
      <Row>
        <Col className='report-sidenav' sm={3}>
          <ListGroup.Item className="list-group-item-o">
            <Form>
            <Form.Select value={classId} onChange={(e) => addClassIdOnParams(e.target.value)}>
              <option value="">-- Select Class Here --</option>
              {classes.map(item =>{
                return (currentAcademicTerm == item.termName && <option value={item?.classId} > {item?.className}</option>)
              })}
            </Form.Select>
            </Form>
          </ListGroup.Item>
          <ListGroup className="list-group-item-o" style={{paddingLeft:'15px', paddingRight: '15px'}}>
          {subsType == 'Interactives' || subsType == 'TeacherResources' ?
              <Link className={currentLoc.includes('reports/interactive') ? "active-nav-item" : 'nav-item'} to={classId ? `/reports/interactive?classId=${classId}` : '/reports'}>
                Interactive
              </Link>
          :
            <>
              <Link className={currentLoc.includes('reports/exam') ? "active-nav-item" : 'nav-item'} to={classId ? `/reports/exam?classId=${classId}` : '/reports'}>
                Exam
              </Link>
              <Link className={currentLoc.includes('reports/assignment') ? "active-nav-item" : 'nav-item'} to={classId ? `/reports/assignment?classId=${classId}` : '/reports'}>
                Assignment
              </Link>
              <Link className={currentLoc.includes('reports/task') ? "active-nav-item" : 'nav-item'} to={classId ? `/reports/task?classId=${classId}` : '/reports'}>
                Task
              </Link>
              <Link className={currentLoc.includes('reports/interactive') ? "active-nav-item" : 'nav-item'} to={classId ? `/reports/interactive?classId=${classId}` : '/reports'}>
                Interactive
              </Link>
            </>
          }
          </ListGroup>
        </Col>
        <Col sm={9} className='scrollable vh-90 pb-5 pl-20'>
          {children}
        </Col>
      </Row>
    </MainContainer>
  )
}
