import React, {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { toast } from 'react-toastify';
import { UserContext } from '../../../context/UserContext';
import FeedsAPI from '../../../api/FeedsAPI';
import { Col, Row} from 'react-bootstrap';

function NotifDropdown({visible}) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [events, setEvents] = useState([])

  const getEvent = async() => {
    const response = await new FeedsAPI().fetchEvents(user?.userId)
    if(response.ok){
      const events = response.data.filter((item) => moment(item.endDate).isAfter(moment(new Date())));
      const sorted = events.sort((a,b)=>{ if(moment(a.dateUpdated)>moment(b.dateUpdated)) return -1});
      setEvents(sorted);
    }else{
      toast.error("Something went wrong while fetching notifications")
    }
  }

  useEffect(() => {
    getEvent()
  }, [])

  console.log('events:', events)

  return (
     
    <div className={`profile-dropdown-container dropdown-menu shadow ${visible && 'show'}`} >
      <div className='notif-header' >
        <div style={{fontSize:'24px', color:'#BCBCBC'}} >
        <p> Notificatios </p>
        </div>
         <div style={{fontSize:'20px', color:'#EE9337', paddingLeft:'140px', paddingTop:'4px'}} >
          <Link className='notif-link' to="/notifications" >
             See All
          </Link>
         {/* <p onClick={() => alert('Ulol')} style={{cursor:'pointer'}} > See All </p> */}
         </div>
      </div>
      <div>
      <Col className='px-4' sm={12}>
          {events.slice(0,4).map((e, key) => {
            return(
              <Col key={key}>
                <Row>
                  <Col md={2} style={{color:'#EE9337', fontSize:'30px', paddingTop:'10px'}} >
                  <i class='fas fa-file-alt'></i>
                  </Col>
                  <Col md={10}>
                    <p style={{fontSize:'18px'}} ><span style={{color:'#EE9337'}} >{e.updatedBy}</span> has assigned an&nbsp;
                    <span style={{ color:'#EE9337'}} >{e.title}</span> to&nbsp;
                    <span style={{ color:'#EE9337'}} >{e.class }</span><br /> <span style={{fontSize:'16px', color:'#BCBCBC'}} >{moment(e.dateUpdated).startOf().fromNow()}</span> </p>
                  </Col>
                </Row>
              </Col>
            )
          })
        }
        </Col>
      </div>
    </div>
    
  )
}

export default NotifDropdown