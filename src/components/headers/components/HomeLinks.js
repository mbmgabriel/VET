import React, { useContext, useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { toast } from "react-toastify";
import { UserContext } from '../../../context/UserContext';
import AcademicTermAPI from '../../../api/AcademicTermAPI';

export default function HomeLinks() {
  const userContext = useContext(UserContext)
  const {themeLogo, user} = userContext.data
  const [academicTerm, setAcademicTerm] = useState([])
  const [currentAcademicTerm, setCurrentAcademicTerm] = useState('');
  const subsType = user.subsType;

  useEffect(() => {
    let temp = localStorage.getItem('academicTerm')
    setCurrentAcademicTerm(temp)
      getAcademicTerm()
  },[])

  const getAcademicTerm = async () =>{
    let response = await new AcademicTermAPI().fetchAcademicTerm()
    if(response.ok){
      setAcademicTerm(response?.data);
      let data = response.data;
      let temp = localStorage.getItem('academicTerm')
      if(temp == null) {
        let obj = data.find(o => o.isCurrentTerm == true);
        setCurrentAcademicTerm(obj.academicTermName);
        localStorage.setItem('academicTerm', obj.academicTermName);
      }
    }else{
      toast.error("Something went wrong while fetching all Academic Term")
    }
  }

  const selectAcademicTerm = (data) => {
    localStorage.setItem('academicTerm', data);
    setCurrentAcademicTerm(data)
    let path = window.location.pathname
    if(path == '/dashboard' || path == '/classes'){
      window.location.reload();
    }
  }

  const handleRedirect = () => {
    if(subsType == 'TeacherResources' && user.isTeacher) return '/courses'
    if(subsType == 'TeacherResources' && user.isStudent) return '/classes'
    if(subsType == 'InteractivesandLearn' && user.isStudent) return '/courses'
    if(subsType.includes('LMS')) return '/dashboard';
      return '/classes';
  }

  return (
    <div className="home-links">
       <Link className="home-link " to={handleRedirect()}>
        <div>
          {themeLogo ? <img src={themeLogo} alt="logo" className="home-link-logo"/> : <i className="fas fa-home"></i>}
        </div>
      </Link> 
      <div className="school-year-container">
        <span>S.Y.</span>
          {subsType == 'Ebooks'  || subsType == 'TeacherResources' || subsType == 'Interactives' || subsType == 'InteractivesandLearn' ?
            <p className='school-year-dropdown'> {currentAcademicTerm}</p>
            :
            <Dropdown>
              <Dropdown.Toggle variant="reset" id="dropdown-basic" className="school-year-dropdown">
                {currentAcademicTerm}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {academicTerm.map((i, key) => {
                return <Dropdown.Item key={key} onClick={() => selectAcademicTerm(i.academicTermName)}>{i.academicTermName}</Dropdown.Item>})
                }
              </Dropdown.Menu>
            </Dropdown>
          }
      </div>
    </div>
  )
}
