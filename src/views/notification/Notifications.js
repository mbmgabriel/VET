import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { UserContext } from '../../context/UserContext';
import MainContainer from '../../components/layouts/MainContainer'
import { Col, Row, ListGroup, Form, Input, Button, Table } from 'react-bootstrap';
import {  Doughnut, Line } from 'react-chartjs-2';
import SchoolAPI from '../../api/SchoolAPI';
import FeedsAPI from '../../api/FeedsAPI';
import { getDataDetail } from '@microsoft/signalr/dist/esm/Utils';
import moment from 'moment'
import { toast } from 'react-toastify';

export default function Dashboard() {

  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async() => {
    setLoading(true);
    const response = await new FeedsAPI().fetchEvents(user?.userId);
    if(response.ok){
      console.log(response.data);
      setEvents(response.data);
    }else{
      toast.error("Something went wrong while fetching notifications")
    }
    setLoading(false)
  }

  const handleConvertDate = (date) => {
    let temp = moment(date).toNow(true);
    return temp;
  }

    return (
      <MainContainer loading={loading} title="" activeHeader={""}>
        <Col className='px-4' sm={12}>
        <h2 className="primary-color mt-5 mb-3">Notifications</h2>
          {events.map((e, key) => {
            return(
              <Col>
                <Row className="justify-content-around">
                  <Col md={10}>
                    <h3>{e.class}</h3>
                    <h4>{e.title}</h4>
                    <p>{e.description ? e.description : 'No description available.'}</p>
                  </Col>
                  <Col md={2}>
                    <p className='float-end'>{handleConvertDate(e.startDate)}</p>
                  </Col>
                </Row>
                <hr />
              </Col>
            )
          })
        }
        </Col>
      </MainContainer>
    )
}