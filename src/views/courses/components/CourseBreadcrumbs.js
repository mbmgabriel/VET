import React from "react";
import {Link} from 'react-router-dom'

export default function CourseBreadcrumbs({title, clicked}) {
const bread = sessionStorage.getItem('breadname')
const currentLoc = window.location.pathname.split('/')[3];
  return (
  <div className="row font-20">
		<div className="bread-margin bread-crumbs-position">
      <span><Link className="text-decoration-none text-black" to='/courses'>Courses</Link> <i class="fas fa-chevron-right m-l-10 m-r-10"></i></span>
      <span className={title == '' ? "tfi-font-color capitalize" : 'capitalize'} onClick={clicked}>{currentLoc} </span>
     {title !== '' && <span className={title !== '' ? "tfi-font-color" : ''}><i class="text-black fas fa-chevron-right m-l-10 m-r-10"></i>{title}</span>}
		</div>
  </div>
  )
}
