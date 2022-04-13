import React, {useContext, useEffect, useState} from 'react'
import AdminSideNavigation from '../../components/side-navigation/AdminSideNavigation'
import MainContainer from '../../components/layouts/MainContainer'
import { Col, Row } from 'react-bootstrap'
import { UserContext } from '../../context/UserContext'
import CourseSideNav from '../../components/side-navigation/CourseSideNav'
import SchoolCoursesContent from './component/SchoolCoursesContent'
import { useParams } from "react-router";
import CoursesAPI from '../../api/CoursesAPI'
import SchoolCoursesDiscussionContent from './component/SchoolCoursesDiscussionContent'

function SchoolDiscussion() {
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
    <MainContainer title="Courses" activeHeader={"courses"} loading={loading}>
    <Row className="mt-4">
      <Col sm={3}>
        <CourseSideNav courseInfos={courseInfos} active="Discussion" />
      </Col>
      <Col sm={9}>
        <SchoolCoursesDiscussionContent setLoading={setLoading} />
      </Col>
    </Row>
  </MainContainer>
  )
}

export default SchoolDiscussion