import React, { useState, useEffect, useContext } from "react";
import CoursesItem from "../../views/courses/components/CourseItem";
import CourseCreate from "../../views/courses/components/CourseCreate";
import MainContainer from '../../components/layouts/MainContainer'
import { Button, InputGroup, FormControl, CardGroup, Row, Col } from 'react-bootstrap';
import CourseEdit from "./components/CourseEdit";
import CoursesAPI from "../../api/CoursesAPI";
import { UserContext } from './../../context/UserContext'
import InactiveCourses from "./components/InactiveCourses";
import FullScreenLoader from '../../components/loaders/FullScreenLoader'

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
  const [inActive, setInActive] = useState([])
  const [showActive, setShowActive] = useState(false)
  const subsType = user.subsType;

	const onSearch = (text) => {
    setFilter(text)
  }

  const handleOpenModal = e => {
      e.preventDefault()
      setOpenModal(true)
  }

  const handleShowActive = ()=> {
    setShowActive(false)
  }

  const handleShowInactive = ()=>{
    setShowActive(true)
  }

  const getCourses = async() => {
    setLoading(true)
    let response = await new CoursesAPI().getCourses()
    setLoading(false)
    if(response.ok){
      const sorted = response.data.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1);
      setSubjectAreaName(sorted);
      const sortedCourse = response.data.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1);
      setCourse(sortedCourse);

      const inActive = response.data.filter((item) => item?.status == false && item?.isTechfactors == false)
      setInActive(inActive)

      const dataIct = response.data.filter((item) => item.subjectArea.id == '1')
      setIctItem(dataIct.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))

      const dataEnglish = response.data.filter((item) => item.subjectArea.id == '2')
      setEnglishItem(dataEnglish.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))

      const dataMath = response.data.filter((item) => item.subjectArea.id == '3')
      setMathItem(dataMath.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))

      const dataFilipino = response.data.filter((item) => item.subjectArea.id == '4')
      setFilipinoItem(dataFilipino.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))

      const dataScience = response.data.filter((item) => item.subjectArea.id == '5')
      setScienceItem(dataScience.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))

      const dataAralinPanlipunan = response.data.filter((item) => item.subjectArea.id == '6')
      setAralinPanlipunanItem(dataAralinPanlipunan.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))

      const dataStem = response.data.filter((item) => item.subjectArea.id == '7')
      setStemItem(dataStem.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))

      const dataApplied = response.data.filter((item) => item.subjectArea.id == '9')
      setAppliedItem(dataApplied.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))

      const dataCode = response.data.filter((item) => item.subjectArea.id == '10')
      setCoreItem(dataCode.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))

      const dataAbm = response.data.filter((item) => item.subjectArea.id == '8')
      setAbmItem(dataAbm.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))

      const dataHumms = response.data.filter((item) => item.subjectArea.id == '11')
      setHummsItem(dataHumms.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))

      const dataRobotics = response.data.filter((item) => item.subjectArea.id == '12')
      setRoboticsItem(dataRobotics.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))

      const dataTle = response.data.filter((item) => item.subjectArea.id == '14')
      setTleItem(dataTle.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))

      const dataHele = response.data.filter((item) => item.subjectArea.id == '15')
      setHeleitem(dataHele.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))

      const dataMapeh = response.data.filter((item) => item.subjectArea.id == '16 ')
      setMapehItem(dataMapeh.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))

      const dataCle = response.data.filter((item) => item.subjectArea.id == '17')
      setCleItem(dataCle.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))

      const dataGodsPark = response.data.filter((item) => item.subjectArea.id == "18")
      setGodsParkItem(dataGodsPark.sort((a,b) => a.courseName.toLowerCase() > b.courseName.toLowerCase() ? 1 : -1))
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
      {loading && <FullScreenLoader/>}
      <div className="page-container">
        <div className="containerpages">
          {user.isTeacher &&
            <>
            			<Row style={{paddingTop:'15px'}}>
        <Col className='title-header' >
        <h1>Courses {subsType == 'LMS' && <Button variant='link' className="btn-create-class" onClick={handleOpenModal}><i className="fa fa-plus"></i> Create Course</Button>}</h1>
        </Col>
        {subsType == 'LMS' && <Col style={{textAlign:'right'}} className={user.isSchoolAdmin ? 'd-none' : ''}>
          <Button onClick={() => handleShowActive()} className='btn-Enrolled'  size='lg' variant="outline-warning"><b>Active</b></Button>
          <Button onClick={() => handleShowInactive()}  className='btn-Enrolled'  size='lg' variant="outline-warning"><b>Inactive</b></Button>
        </Col>}
      </Row>
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
             <Button onClick={() => handleOnclick(course)} className="m-r-5 color-white btn-filter" size="sm">All</Button>
             <Button onClick={() => handleOnclick(aralinPanlipunanItem)} className="m-r-5 color-white btn-filter" size="sm">Aralin Panlipunan</Button>
             <Button onClick={() => handleOnclick(cleItem)} className="m-r-5 color-white btn-filter" size="sm">CLE</Button>
             <Button onClick={() => handleOnclick(englishItem)} className="m-r-5 color-white btn-filter" size="sm">English</Button>
             <Button onClick={() => handleOnclick(filipinoitem)} className="m-r-5 color-white btn-filter" size="sm">Filipino</Button>
             <Button onClick={() => handleOnclick(godsParkItem)} className="m-r-5 color-white btn-filter" size="sm">God's Park</Button>
             <Button onClick={() => handleOnclick(heleItem)} className="m-r-5 color-white btn-filter" size="sm">HELE</Button>
             <Button onClick={() => handleOnclick(ictItem)} className="m-r-5 color-white btn-filter" size="sm">ICT</Button>
             <Button onClick={() => handleOnclick(mapehItem)} className="m-r-5 color-white btn-filter" size="sm">MAPEH</Button>
             <Button onClick={() => handleOnclick(mathItem)} className="m-r-5 color-white btn-filter" size="sm">Math</Button>
             <Button onClick={() => handleOnclick(roboticsItem)} className="m-r-5 color-white btn-filter" size="sm">Robotics</Button>
             <Button onClick={() => handleOnclick(scienceItem)} className="m-r-5 color-white btn-filter" size="sm">Science</Button>
             <Button onClick={() => handleOnclick(abmItem)} className="m-r-5 color-white btn-filter" size="sm">SHS-ABM</Button>
             <Button onClick={() => handleOnclick(appliedItem)} className="m-r-5 color-white btn-filter" size="sm">SHS-APPLIED</Button>
             <Button onClick={() => handleOnclick(coreItem)} className="m-r-5 color-white btn-filter" size="sm">SHS-CORE</Button>
             <Button onClick={() => handleOnclick(hummsItem)} className="m-r-5 color-white btn-filter" size="sm">SHS-HUMMS</Button>
             <Button onClick={() => handleOnclick(stemItem)} className="m-r-5 color-white btn-filter" size="sm">SHS-STEM</Button>
             <Button onClick={() => handleOnclick(tleItem)} className="m-r-5 color-white btn-filter" size="sm">TLE</Button>
           </div>
            <CardGroup className="justify-content-center">
              <CourseCreate  subjectAreaName={subjectAreaName} setSubjectAreaName={setSubjectAreaName} getCourses={getCourses} setCourse={setCourse} openModal={openModal} setOpenModal={setOpenModal} /> 
              <CourseEdit getCourses={getCourses} handleOnclick={handleOnclick} setCourse={setCourse} openEditModal={openEditModal} setOpenEditModal={setOpenEditModal} selectedCourse={selectedCourse} /> 
              {showActive === false? 
                (<CoursesItem 
                  getCourses={getCourses} 
                  subjectAreaName={subjectAreaName} 
                  filter={filter} setFilter={setFilter} 
                  course={course} setLoading={setLoading} 
                  setOpenEditModal={setOpenEditModal} 
                  setSelectedCourse={setSelectedCourse}/>)
              :
              (<InactiveCourses 
                getCourses={getCourses} 
                subjectAreaName={subjectAreaName} 
                filter={filter} setFilter={setFilter} 
                course={course} setLoading={setLoading} 
                setOpenEditModal={setOpenEditModal} 
                setSelectedCourse={setSelectedCourse}
                inActive={inActive} />)
              }
            </CardGroup>
        </div>
      </div>
    </MainContainer>
  )
}
