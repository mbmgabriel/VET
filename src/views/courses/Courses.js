import React, { useState, useEffect, useContext } from "react";
import CoursesItem from "../../views/courses/components/CourseItem";
import CourseCreate from "../../views/courses/components/CourseCreate";
import MainContainer from '../../components/layouts/MainContainer'
import { Button, InputGroup, FormControl, CardGroup, Row, Col } from 'react-bootstrap';
import CourseEdit from "./components/CourseEdit";
import CoursesAPI from "../../api/CoursesAPI";
import { UserContext } from './../../context/UserContext'


export default function Courses() {

  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [course, setCourse] = useState([])
  const [filter, setFilter] = useState("")
  const [ictItem, setIctItem] = useState([])
  const [englishItem, setEnglishItem] = useState([])
  const [mathItem, setMathItem] = useState([])
  const [filipinoitem, setFilipinoItem] = useState([])
  const [scienceItem, setScienceItem] = useState([])
  const [aralinPanlipunanItem, setAralinPanlipunanItem] = useState([])
  const [subjectAreaName, setSubjectAreaName] = useState([])
  const [stemItem, setStemItem] = useState([])
  const [appliedItem, setAppliedItem] = useState([])
  const [coreItem, setCoreItem] = useState([])
  const [abmItem, setAbmItem] = useState([])
  const [hummsItem, setHummsItem] = useState([])
  const [roboticsItem, setRoboticsItem] = useState([])
  const [tleItem, setTleItem] = useState([])
  const [heleItem, setHeleitem] = useState([])
  const [mapehItem, setMapehItem] = useState([])
  const [cleItem, setCleItem] = useState([])
  const [godsParkItem, setGodsParkItem] = useState([])
	
	const onSearch = (text) => {
    setFilter(text)
  }

  const handleOpenModal = e => {
      e.preventDefault()
      setOpenModal(true)
  }

  const getCourses = async() => {
    setLoading(true)
    let response = await new CoursesAPI().getCourses()
    setLoading(false)
    if(response.ok){
      const sorted = response.data.sort((a, b) => a.subjectArea.subjectAreaName > b.subjectArea.subjectAreaName ? 1:-1);
      setSubjectAreaName(sorted);
      const sortedCourse = response.data.sort((a, b) => a.subjectArea.subjectAreaName > b.subjectArea.subjectAreaName ? 1:-1);
      setCourse(sortedCourse);

      const dataIct = response.data.filter((item) => item.subjectArea.subjectAreaName == 'ICT')
      setIctItem(dataIct)
      const dataEnglish = response.data.filter((item) => item.subjectArea.subjectAreaName == 'English')
      setEnglishItem(dataEnglish)
      const dataMath = response.data.filter((item) => item.subjectArea.subjectAreaName == 'Math')
      setMathItem(dataMath)
      const dataFilipino = response.data.filter((item) => item.subjectArea.subjectAreaName == 'Filipino')
      setFilipinoItem(dataFilipino)
      const dataScience = response.data.filter((item) => item.subjectArea.subjectAreaName == 'Science')
      setScienceItem(dataScience)
      const dataAralinPanlipunan = response.data.filter((item) => item.subjectArea.subjectAreaName == 'Aralin Panlipunan')
      setAralinPanlipunanItem(dataAralinPanlipunan)
      const dataStem = response.data.filter((item) => item.subjectArea.subjectAreaName == 'STEM')
      setStemItem(dataStem)
      const dataApplied = response.data.filter((item) => item.subjectArea.subjectAreaName == 'APPLIED')
      setAppliedItem(dataApplied)
      const dataCode = response.data.filter((item) => item.subjectArea.subjectAreaName == 'CORE')
      setCoreItem(dataCode)
      const dataAbm = response.data.filter((item) => item.subjectArea.subjectAreaName == 'ABM')
      setAbmItem(dataAbm)
      const dataHumms = response.data.filter((item) => item.subjectArea.subjectAreaName == 'HUMMS')
      setHummsItem(dataHumms)
      const dataRobotics = response.data.filter((item) => item.subjectArea.subjectAreaName == 'Robotics')
      setRoboticsItem(dataRobotics)
      const dataTle = response.data.filter((item) => item.subjectArea.subjectAreaName == 'TLE')
      setTleItem(dataTle)
      const dataHele = response.data.filter((item) => item.subjectArea.subjectAreaName == 'HELE')
      setHeleitem(dataHele)
      const dataMapeh = response.data.filter((item) => item.subjectArea.subjectAreaName == 'MAPEH ')
      setMapehItem(dataMapeh)
      const dataCle = response.data.filter((item) => item.subjectArea.subjectAreaName == 'CLE')
      setCleItem(dataCle)
      const dataGodsPark = response.data.filter((item) => item.subjectArea.subjectAreaName == "God's Park ")
      setGodsParkItem(dataGodsPark)
    }else{
      alert("Something went wrong while fetching all courses")
    }
  }

  useEffect(() => {
    getCourses()
  }, [])

  const handleOnclick = (subject) => {
    setSubjectAreaName(subject)
  }

  useEffect(() => {
    if (user.isStudent) return (window.location.href = "/404");
  }, []);
  
  return (
    <MainContainer loading={loading} activeHeader={'courses'}>
      <div className="page-container">
        <div className="containerpages">
          {user.isTeacher &&
            <>
          <div className="row m-b-20">
              {/* <div className="col-md-10 pages-header"><h1>Courses <Button variant="outline-warning" onClick={handleOpenModal}><i className="fa fa-plus"></i> Create Course</Button></h1></div> */}
              <div className="col-md-10 pages-header"><h1>Courses <Button variant='link' className="btn-create-class" onClick={handleOpenModal}><i className="fa fa-plus"></i> Create Course</Button></h1></div>
          </div>
            </>
          }
          {user.isSchoolAdmin &&
            <>
          <div className="row m-b-20">
              {/* <div className="col-md-10 pages-header"><h1>Courses <Button variant="outline-warning" onClick={handleOpenModal}><i className="fa fa-plus"></i> Create Course</Button></h1></div> */}
              <div className="col-md-10 pages-header"><h1>Courses List </h1></div>
          </div>
            </>
          }
          <div className="row m-b-20 m-t-30" onSearch={onSearch}>
            <div className="col-md-12">
              <InputGroup size="lg">
                <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search here for available courses" type="search" onChange={(e) => onSearch(e.target.value)} />
                <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
              </InputGroup>
            </div>
          </div>
          <div style={{textAlign:'center', paddingBottom:' 20px'}}>
             <Button onClick={() => handleOnclick(course)} className="m-r-5 color-white tficolorbg-button" size="sm">All</Button>
             <Button onClick={() => handleOnclick(ictItem)} className="m-r-5 color-white tficolorbg-button" size="sm">ICT</Button>
             <Button onClick={() => handleOnclick(englishItem)} className="m-r-5 color-white tficolorbg-button" size="sm">English</Button>
             <Button onClick={() => handleOnclick(mathItem)} className="m-r-5 color-white tficolorbg-button" size="sm">Math</Button>
             <Button onClick={() => handleOnclick(filipinoitem)} className="m-r-5 color-white tficolorbg-button" size="sm">Filipino</Button>
             <Button onClick={() => handleOnclick(scienceItem)} className="m-r-5 color-white tficolorbg-button" size="sm">Science</Button>
             <Button onClick={() => handleOnclick(aralinPanlipunanItem)} className="m-r-5 color-white tficolorbg-button" size="sm">Aralin Panlipunan</Button>
             <Button onClick={() => handleOnclick(stemItem)} className="m-r-5 color-white tficolorbg-button" size="sm">STEM</Button>
             <Button onClick={() => handleOnclick(abmItem)} className="m-r-5 color-white tficolorbg-button" size="sm">ABM</Button>
             <Button onClick={() => handleOnclick(appliedItem)} className="m-r-5 color-white tficolorbg-button" size="sm">APPLIED</Button>
             <Button onClick={() => handleOnclick(coreItem)} className="m-r-5 color-white tficolorbg-button" size="sm">CORE</Button>
             <Button onClick={() => handleOnclick(hummsItem)} className="m-r-5 color-white tficolorbg-button" size="sm">HUMMS</Button>
             <Button onClick={() => handleOnclick(roboticsItem)} className="m-r-5 color-white tficolorbg-button" size="sm">Robotics</Button>
             <Button onClick={() => handleOnclick(tleItem)} className="m-r-5 color-white tficolorbg-button" size="sm">TLE</Button>
             <Button onClick={() => handleOnclick(heleItem)} className="m-r-5 color-white tficolorbg-button" size="sm">HELE</Button>
             <Button onClick={() => handleOnclick(mapehItem)} className="m-r-5 color-white tficolorbg-button" size="sm">MAPEH</Button>
             <Button onClick={() => handleOnclick(cleItem)} className="m-r-5 color-white tficolorbg-button" size="sm">CLE</Button>
             <Button onClick={() => handleOnclick(godsParkItem)} className="m-r-5 color-white tficolorbg-button" size="sm">God's Park</Button>
           </div>
          <div className="row m-b-20 justify-content-center">
            <CoursesItem subjectAreaName={subjectAreaName} filter={filter} setFilter={setFilter} course={course} setLoading={setLoading} setOpenEditModal={setOpenEditModal} setSelectedCourse={setSelectedCourse}/>
            <CourseCreate  subjectAreaName={subjectAreaName} setSubjectAreaName={setSubjectAreaName} getCourses={getCourses} setCourse={setCourse} openModal={openModal} setOpenModal={setOpenModal} /> 
            <CourseEdit getCourses={getCourses} handleOnclick={handleOnclick} setCourse={setCourse} openEditModal={openEditModal} setOpenEditModal={setOpenEditModal} selectedCourse={selectedCourse} /> 
          </div>
        </div>
      </div>
    </MainContainer>
  )
}
