import React from "react";
import {Link} from 'react-router-dom'

export default function ClassBreadcrumbs({title, clicked, secondItem, clickedSecond}) {
const bread = sessionStorage.getItem('breadname')
const currentLoc = window.location.pathname.split('/')[3];

const handleDisplayTab = () => {
  switch (currentLoc) {
    case 'classList':
      return 'Class List'
    case 'files':
      return 'Files'
    case 'interactives':
      return 'Interactive Exercises'
    case 'class_grading':
      return 'Class Grading'
    case 'class_meeting':
      return 'Class Meeting'
    case 'resources':
      return 'Teacher Resources'
    default:
      return currentLoc
  }
}

  return (
    <div className="row font-20">
      <div className="bread-margin bread-crumbs-position">
        <span><Link className="text-decoration-none text-black" to='/classes'>Classes</Link> <i class="fas fa-chevron-right m-l-10 m-r-10"></i></span>
        <span className={title == '' ? "tfi-font-color capitalize" : 'capitalize hand'} onClick={clicked}>{handleDisplayTab()} </span>
      {title !== '' && <span className={secondItem ? 'hand capitalize' : "tfi-font-color capitalize"} onClick={secondItem ? clickedSecond : ''}><i class="text-black fas fa-chevron-right m-l-10 m-r-10 "></i>{title}</span>}
      {secondItem && <span className={secondItem !== '' ? "tfi-font-color capitalize" : ''}><i class="text-black fas fa-chevron-right m-l-10 m-r-10 "></i>{secondItem}</span>}
      </div>
    </div>
  )
}