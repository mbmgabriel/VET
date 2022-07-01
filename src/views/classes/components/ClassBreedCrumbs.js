import React from "react";
import {Link} from 'react-router-dom'

export default function ClassBreadcrumbs({title, clicked}) {
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
    default:
      return currentLoc
  }
}

  return (
    <div className="row font-20">
      <div className="bread-margin bread-crumbs-position">
        <span><Link className="text-decoration-none text-black" to='/classes'>Classes</Link> <i class="fas fa-chevron-right m-l-10 m-r-10"></i></span>
        <span className={title == '' ? "tfi-font-color capitalize" : 'capitalize hand'} onClick={clicked}>{handleDisplayTab()} </span>
      {title !== '' && <span className={title !== '' ? "tfi-font-color capitalize" : ''}><i class="text-black fas fa-chevron-right m-l-10 m-r-10 "></i>{title}</span>}
      </div>
    </div>
  )
}