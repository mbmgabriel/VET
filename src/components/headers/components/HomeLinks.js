import React, { useContext } from 'react'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { toast } from "react-toastify";
import { UserContext } from '../../../context/UserContext';

export default function HomeLinks() {
  const userContext = useContext(UserContext)
  const {themeLogo} = userContext.data
  return (
    <div className="home-links">
       <Link className="home-link " to="/teacherdashboard">
        <div>
          {themeLogo ? <img src={themeLogo} alt="logo" className="home-link-logo"/> : <i className="fas fa-home"></i>}
        </div>
      </Link> 
      <div className="school-year-container">
        <span>S.Y.</span>
        <Dropdown>
          <Dropdown.Toggle variant="reset" id="dropdown-basic" className="school-year-dropdown">
            2021 - 2022
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#">2020 - 2021</Dropdown.Item>
            <Dropdown.Item href="#">2021 - 2022</Dropdown.Item>
            <Dropdown.Item href="#">2022 - 2023</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}
