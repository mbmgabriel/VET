import Button from '@restart/ui/esm/Button'
import React, { useContext, useEffect, useState } from 'react'
import { Col, Form, InputGroup, Row } from 'react-bootstrap'
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
  const [showPassword, setShowPassword] = useState(false);

  let history = useHistory()

  const login = async(e) => {
    e.preventDefault()
    setLoading(true)
    let response = await new Auth().login(
      {username, password}
    )
    if(response.ok){
      // console.log(response.data)
      await window.localStorage.setItem('token', response.data.token)
      await window.localStorage.setItem('subsType', response.data.subscriptionType)
      //response.data.subscriptionType Ebooks, TeacherResources, Interactives, InteractivesandLearn, ContainerwithTR
      await refreshUser()
    }else{
      alert(response.data.errorMessage)
    }
    setLoading(false)
  }
  
  return (
    <MainContainer fluid headerVisible={false} loading={loading}>
      <Row>
        <Col md={6} className='login-screen-left'>
          A
        </Col>
        <Col md={6} className='login-screen-right'>
          <Row>
            <Col md={3}></Col>
            <Col md={6}>
            <div>
            <h1 className="title"><span className="orange">Haru</span>Gabriel</h1>
            {/* <p className="subtitle">Welcome back to TekTeach! Making learning, a great experience!</p> */}
              <Form onSubmit={login}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label className="custom-label">E-mail / Username</Form.Label>
                  <Form.Control 
                    className="custom-input" 
                    size="md" 
                    type="text" 
                    placeholder="Enter e-mail or username here"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label className="custom-label">Password</Form.Label>
                  <InputGroup>
                    <Form.Control 
                      className="custom-input" 
                      size="md" 
                      type={showPassword ? 'text' : "password"} 
                      placeholder="Enter password here"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputGroup.Text className='custom-input border-0'><i className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={()=> setShowPassword(!showPassword)}/></InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Link className="link-orange font-24 d-none" to="/forgot_password" >Forgot Password</Link>
                <Button className="btn btn-md btn-primary btn-auth w-100 d-block mt-4 mb-4" size="md" variant="primary" type="submit">Log In</Button>
              </Form>
            </div>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* <div className="auth-container">
        <div className="login-container login-bg-image">
          <div className="mt-5">
            <Row>
              <Col/>
              <Col md={7}>
                <h1 className="title"><span className="orange">Tek</span>Teach Account Login</h1>
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
                    <InputGroup>
                      <Form.Control 
                        className="custom-input" 
                        size="lg" 
                        type={showPassword ? 'text' : "password"} 
                        placeholder="Enter password here"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <InputGroup.Text className='custom-input border-0'><i className={showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={()=> setShowPassword(!showPassword)}/></InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  <Link className="link-orange font-24 d-none" to="/forgot_password" >Forgot Password</Link>
                  <Button className="btn btn-lg btn-primary btn-auth w-100 d-block mt-5 mb-4" size="lg" variant="primary" type="submit">Log In</Button>
                </Form>
              </Col>
              <Col/>
            </Row>
          </div>
        </div>
      </div> */}
    </MainContainer>
  )
}
