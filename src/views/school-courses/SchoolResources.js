import React, {useContext, useEffect, useState} from 'react'
import AdminSideNavigation from '../../components/side-navigation/AdminSideNavigation'
import MainContainer from '../../components/layouts/MainContainer'
import { Col, Row } from 'react-bootstrap'
import { UserContext } from '../../context/UserContext'
import CourseSideNav from '../../components/side-navigation/CourseSideNav'
import SchoolCoursesContent from './component/SchoolCoursesContent'
import { useParams } from "react-router";
import CoursesAPI from '../../api/CoursesAPI'
import SchoolCourseResources from './component/SchoolCourseResources'
import FullScreenLoader from '../../components/loaders/FullScreenLoader'

function SchoolResources() {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const {id} = useParams()
  const [courseInfos, setCourseInfos] = useState([])
  const [loading, setLoading] = useState(true)
  
  const getCourseInformation = async () =>{
    setLoading(true)
    let response = await new CoursesAPI().getCourseInformation(id)
    if(response.ok){
      setCourseInfos(response.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    getCourseInformation();
  }, [])

  useEffect(() => {
    if (user.isStudent) return (window.location.href = "/404");
  }, []);

  return (
  <MainContainer title="Interactive" activeHeader={"courses"} style='not-scrollable' loading={loading}>
      {loading && <FullScreenLoader />}
    <Row className="mt-4 not-scrollable">
      <Col sm={3}>
        <CourseSideNav courseInfos={courseInfos} active="Resources" />
      </Col>
      <Col sm={9} className='scrollable vh-85'>
        <SchoolCourseResources />
      </Col>
    </Row>
  </MainContainer>
  )
}

export default SchoolResources