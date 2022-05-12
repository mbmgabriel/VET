import React, { useState, useEffect, useContext } from "react";
import MainContainer from '../../components/layouts/MainContainer'
import { Row, Col, ListGroup} from 'react-bootstrap';
import { UserContext } from '../../context/UserContext';
import { Link} from 'react-router-dom';

export default function Files({children}) {
  const [loading, setLoading] = useState(false);
  const userContext = useContext(UserContext)
  const {user} = userContext.data;
  const currentLoc = window.location.pathname;
 

  useEffect(() => {
    if (user.isStudent) return (window.location.href = "/404");
  }, []);


  return (
    <MainContainer loading={loading} fluid activeHeader={'files'} style='not-scrollable'>
      <Row className="row">
        <Col className="col-md-2 file-sidenav p-2">
        <ListGroup>
            <Link className={`${currentLoc == '/files' ? "active-nav-item" : 'nav-item'} p-2`} to='/files'>
              Class
            </Link>
            <Link className={`${currentLoc == '/files/course' ? "active-nav-item" : 'nav-item'} p-2`} to='/files/course'>
              Course
            </Link>
          </ListGroup>
        </Col>
        <Col>
          {children}
        </Col>
      </Row>
    </MainContainer>
  )
}
