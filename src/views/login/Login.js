import Button from '@restart/ui/esm/Button'
import React, { useContext, useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import Auth from '../../api/Auth'
import MainContainer from '../../components/layouts/MainContainer'
import { UserContext } from '../../context/UserContext'
import qrScanner from '../../assets/images/qr.png'
export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const userContext = useContext(UserContext)
  const {refreshUser, user} = userContext.data
  const urlParams = new URLSearchParams(window.location.search);
  const message = urlParams.get('message');

  let history = useHistory()

  const login = async(e) => {
    e.preventDefault()
    setLoading(true)
    let response = await new Auth().login(
      {username, password}
    )
    if(response.ok){
      console.log(response.data)
      await window.localStorage.setItem('token', response.data.token)
      await window.localStorage.setItem('subsType', 'TeacherResources')//response.data.subscriptionType Ebooks, TeacherResources, Interactives
      await refreshUser()
    }else{
      alert(response.data.errorMessage)
    }
    setLoading(false)
  }
  
  return (
    <MainContainer headerVisible={false} loading={loading}>
      <div className="auth-container">
        <div className="login-container login-bg-image">
          <div className="mt-5">
            <Row>
              <Col/>
              <Col md={7}>
                <h1 className="title"><span className="color-blue-green">Tek</span>Teach Account Login</h1>
                <p className="subtitle">Welcome back to TekTeach! Making learning, a great experience!</p>
                <p className="subtitle text-danger">{message}</p>
                <Form onSubmit={login}>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label className="custom-label">E-mail / Username</Form.Label>
                    <Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="text" 
                      placeholder="Enter e-mail or username here"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label className="custom-label">Password</Form.Label>
                    <Form.Control 
                      className="custom-input" 
                      size="lg" 
                      type="password" 
                      placeholder="Enter password here"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <Link className="link-orange font-24 d-none" to="/forgot_password" >Forgot Password</Link>
                  <Button className="btn btn-lg btn-primary btn-auth w-100 d-block mt-5 mb-4" size="lg" variant="primary" type="submit">Log In</Button>
                </Form>
              </Col>
              <Col/>
              {/* <Col size="md" className="login-with-qr-container">
                <div className="qr-container ">
                  <img src={qrScanner} alt="qr-code"/>
                </div>
                <div className="mx-3">
                  <p className="qr-text mt-3">
                    Click on the scanner icon to activate the QR code reader.
                  </p>
                  <p className="qr-text d-none">Scan this code with the <a href="https://google.com" target="blank" className="link-orange">TekTeach mobile app</a> to log in instantly</p>
                </div>
              </Col> */}
            </Row>
          </div>
        </div>
      </div>
    </MainContainer>
  )
}
