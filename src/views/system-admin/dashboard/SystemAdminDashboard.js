import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { UserContext } from '../../../context/UserContext';
import MainContainer from '../../../components/layouts/MainContainer'
import { Col, Row, ListGroup, Form, Input, Button, Table } from 'react-bootstrap';
import {  Doughnut, Line } from 'react-chartjs-2';
import SchoolAPI from '../../../api/SchoolAPI';
import { getDataDetail } from '@microsoft/signalr/dist/esm/Utils';
import moment from 'moment'
export default function SystemAdminDashboard() {

  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [schoolCode, setSchoolCode] = useState([])
  const [schoolInfo, setSchoolInfo] = useState([])
  const [schoolData, setSchoolData] = useState([])
  const [dateTo, setDateTo] = useState("")
  const [dateFrom, setDateFrom] = useState("")

  useEffect(() => {
    if (user.isStudent) return (window.location.href = "/404");
  }, [])

  useEffect(() => {
    getSchoolCode()
  }, [])

  const getSchoolCode = async() => {
    // setLoading(true)
    let response = await new SchoolAPI().getSchoolList()
    if(response.ok){
      setSchoolCode(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
    // setLoading(false)
  }

  const getSchoolData = async(sc, df, dt) => {
    // setLoading(true)
    let response = await new SchoolAPI().getSchoolInfo(sc, df, dt)
    if(response.ok){
      setSchoolData(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
    // setLoading(false)
  }

  if(user.isSystemAdmin){
    return (
      <MainContainer title="Dashboard" activeHeader={"dashboard"}>
        <Row>
          <Col className='px-4' sm={8}>
          <h2 className="primary-color mt-5 mb-3">Analytics</h2>
            <div className='dashboard-content mb-5 mt-3'>
              <div className="dashboard-content-item rounded shadow bg-success" >
                <div className='analytics-label'>
                  <div className='analytics-icon'><i className="fas fa-user-graduate "></i></div>
                  <h5 className="color-white my-0 ml-5">Students</h5>
                </div>
                <h2 className='color-white analytics-value h2 text-align-right'>145,322</h2>
              </div>
              <div className="dashboard-content-item rounded shadow bg-warning" >
                <div className='analytics-label'>
                  <div className='analytics-icon'><i className="fas fa-chalkboard-teacher "></i></div>
                  <h5 className="color-white my-0 ml-5">Teacher</h5>
                </div>
                <h2 className='color-white analytics-value h2 text-align-right'>2,044</h2>
              </div>
              <div className="dashboard-content-item rounded shadow bg-info" >
                <div className='analytics-label'>
                  <div className='analytics-icon'><i className="fas fa-project-diagram "></i></div>
                  <h5 className="color-white my-0 ml-5">Classes</h5>
                </div>
                <h2 className='color-white analytics-value h2 text-align-right'>793</h2>
              </div>
            </div>
            <div>
              <h2 className='primary-color mb-3'>Sample Line Chart</h2>
              <div className='chart-container'>
                <Line
                  data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [{
                      label: 'My First dataset',
                      backgroundColor: 'rgb(255, 99, 132)',
                      borderColor: 'rgb(255, 99, 132)',
                      data: [0, 10, 5, 2, 20, 30, 45],
                    }]
                  }}
                />
              </div>
            </div>
          </Col>
          <Col className='px-4' sm={4}>
            <h2 className="primary-color mt-5 mb-3">Sample Doughnut chart</h2>
            <div className='chart-container'>
              <Doughnut 
                data={{labels: [
                  'Red',
                  'Blue',
                  'Yellow'
                ],
                datasets: [{
                  label: 'My First Dataset',
                  data: [300, 50, 100],
                  backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                  ],
                  hoverOffset: 4
                }]}}
              />
            </div>
          </Col>
          <Col className='px-4' sm={12}>
            <h2 className="primary-color mt-5 mb-3">Login Trail</h2>
            <div className='chart-container'>
              <Form >  
                <ListGroup.Item className="list-group-item-o">
                  <Row>
                    <Form.Select onChange={(e) => setSchoolInfo(e.target.value)}>
                    <option value="">-- Select School Here --</option>
                    {schoolCode.map(item =>{
                      return (<option value={item?.code} > {item?.code}</option>)
                    })}
                    </Form.Select>
                    <br></br>
                    Date From: <Form.Control type="date" onChange={(e) => setDateFrom(e.target.value)}/>
                    <br></br>
                    Date To: <Form.Control type="date" onChange={(e) => setDateTo(e.target.value)}/> 
                    <br></br>
                    <Button className='tficolorbg-button' onClick={(e) => getSchoolData(schoolInfo, dateFrom, dateTo)} >Generate</Button>         
                  </Row>
                </ListGroup.Item>
              </Form>
            </div>
          </Col>
          <Col className='px-4' sm={12}>
            <h2 className="primary-color mt-5 mb-3">Login Trail</h2>
            <div className='chart-container'>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Role Name</th>
                  <th>Name</th>
                  <th>Grade</th>
                  <th>No. Of Login</th>
                  <th>Last Login</th>
                </tr>
              </thead>
              <tbody>
              {schoolData.map(item =>{
                return(
                  <tr>
                    <td>{item.id}</td>
                    <td>{item.roleName}</td>
                    <td>{item?.teacherFullName}{item?.studentFullName}</td>
                    <td>{item.gradeName}</td>
                    <td>{item.numberofLogin}</td>
                    <td>{moment(item.loginDate).format("LLL")}</td>
                  </tr>
                )
              })}
              </tbody>
            </Table>
            </div>
          </Col>
        </Row>
      </MainContainer>
    )
  }
  return <Redirect to="/404"/>

}
