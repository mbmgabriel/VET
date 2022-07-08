import React from "react";
import {Link} from 'react-router-dom'

export default function ClassBreadcrumbs({title, clicked, secondItem, clickedSecondItem}) {
const bread = sessionStorage.getItem('breadname')
const currentLoc = window.location.pathname.split('/')[2];

const handleDisplayTab = () => {
  switch (currentLoc) {
    case 'exam':
      return 'Exam'
    case 'assignment':
      return 'Assignment'
    case 'interactives':
      return 'Interactive Exercises'
    default:
      return currentLoc
  }
}

  return (
    <div className="row font-20">
      <div className="bread-margin bread-crumbs-position">
        <span><span className="text-decoration-none text-black" to=''>Reports</span> <i class="fas fa-chevron-right m-l-10 m-r-10"></i></span>
        <span className={title == '' ? "tfi-font-color capitalize" : 'capitalize hand'} onClick={clicked}>{handleDisplayTab()} </span>
      {title !== '' && <span className={secondItem !== '' ? 'hand capitalize' : "tfi-font-color capitalize"} onClick={clickedSecondItem}><i class="text-black fas fa-chevron-right m-l-10 m-r-10 "></i>{title}</span>}
      {secondItem !== '' && <span className={secondItem !== 'hand capitalize' ? "tfi-font-color capitalize" : ''}><i class="text-black fas fa-chevron-right m-l-10 m-r-10 "></i>{secondItem}</span>}
      </div>
    </div>
  )
}