import React from 'react'
import { Sentry } from "react-activity";
import "react-activity/dist/library.css";
import { UserContext } from '../../context/UserContext';

export default function FullScreenLoader() {
  const userContext = React.useContext(UserContext)
  const {themeColor} = userContext.data

  console.log({themeColor})

  return (
    <div className="full-screen-loader">
      {/* <img src={loaderSvg} alt="loading"/> */}
      <Sentry size={100} speed={.5} color={themeColor} />
    </div>
  )
}
