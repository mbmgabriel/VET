import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import SchoolAPI from '../../api/SchoolAPI'
import { UserContext } from '../../context/UserContext'
import CoursesAPI from '../../api/CoursesAPI'
import AnnouncementAPI from '../../api/AnnouncementAPI'
import Moment from 'moment'
import CreateAnnouncement from './components/CreateAnnouncementModal'

export default function AnnouncementDashboard() {

  const userContext = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [announcement, setAnnouncement] = useState([])
	const [openCreateAnnouncementModal, setOpenCreateAnnouncementModal] = useState(false)
  const {user} = userContext.data
  let studentId = user?.student?.id

  const getAnnouncement = async() => {
    setLoading(true)
    let response = await new AnnouncementAPI().getAllAnnouncement()
    setLoading(false)
    if(response.ok){
      setAnnouncement(response.data)
    }else{
      alert("Something went wrong while fetching all getcourses")
    }
    setLoading(false)
  }

	const handleOpenModal = e => {
		e.preventDefault()
		setOpenCreateAnnouncementModal(true)
	}

  useEffect(() => {
    if(user?.student === null)
      return(
        getAnnouncement()
      )
   
  }, [])

  return (
    <React.Fragment>
    <div className='dash-side-panel'>
      <Row>
        <Col sm={11}> 
          <div className='dash-title-header'>Announcements</div>
        </Col> 
				<Col sm={1}> 
					<Button variant='link' className="btn-create-class" onClick={handleOpenModal}><i className='fa fa-plus'></i></Button>
          <CreateAnnouncement openCreateAnnouncementModal={openCreateAnnouncementModal} setOpenCreateAnnouncementModal={setOpenCreateAnnouncementModal}/>
        </Col> 
      </Row>
      {announcement.length?
        announcement.map(item => {
          return(
            <React.Fragment>
              <span className='dash-title'>{item?.title}</span><br></br>
              <span className='dash-date'><small>{item?.announcedBy} . {Moment(item?.createdDate).format('LL')}</small></span><br></br>
              <span className='dash-content'>{item?.content}</span><br></br>
              <hr></hr>
            </React.Fragment>
          )
        })
        :
        <span>No Announcement Found</span>
      }
      
    </div>
    </React.Fragment>
  )
}