import React from 'react'
import Header from '../headers/Header'
import logo from '../../assets/images/long-logo.png'
import { VERSION_NAME, ENV, ENV_LIST } from '../../config/env'
import FullScreenLoader from '../loaders/FullScreenLoader'

export default function MainContainer({children, headerVisible = true, fluid, loading = false, activeHeader, style}) {
  const containerClass = fluid ? "container-fluid" : "container "
  const header = headerVisible ? '' : 'no-header'
  return (
    <div className="main-container">
      {headerVisible && <Header activeHeader={activeHeader}/>}

      <div className={`content ${header} ${style}`}>
        <div className={containerClass}>
          {children}
          
        </div>
        <div class="lms-footer text-dark">
          <img src={logo} alt="logo"/>
          {/* <p className="m-0">
            {ENV !== ENV_LIST.PRODUCTION ? `${ENV} BUILD` : ''}  
          </p> */}
          <p>
            Version: {VERSION_NAME}
          </p>
        </div>
      </div>
      {/* {loading && <FullScreenLoader/>} */}
    </div>
  )
}
