import React from 'react'
import { Sentry } from "react-activity";
import "react-activity/dist/library.css";
import { UserContext } from '../../context/UserContext';

export default function FullScreenLoader() {
  const userContext = React.useContext(UserContext)
  const {themeColor} = userContext.data
  return (
    <div className="full-screen-loader">
      <Sentry size={100} speed={.5} color={themeColor} />
    </div>
  )
}
