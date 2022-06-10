import React, {useContext, useEffect} from 'react'
import {UserContext} from '../../context/UserContext'
export default function Scratch() {
  const userContext = useContext(UserContext)
  console.log({userContext})
  const {notify, connectionStatus} = userContext.data
  console.log({notify, connectionStatus})
  useEffect(() => {
    if(connectionStatus == "connected"){
      console.log({notify, connectionStatus})
     notify({
      "description": "Testing", 
      "activityType": "", 
      "classId": "2144"
     })
    }
  }, [connectionStatus])
  
  return (
    <div>Scratch</div>
  )
}
