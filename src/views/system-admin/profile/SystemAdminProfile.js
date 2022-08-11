import React from 'react'

import { useContext } from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { UserContext } from '../../../context/UserContext';
import MainContainer from '../../../components/layouts/MainContainer'

export default function SystemAdminProfile() {

  const userContext = useContext(UserContext)
  const {user} = userContext.data  

  
  if(user.isSystemAdmin){
    return (
      <MainContainer title="Profile" fluid activeHeader={"profile"}>
        <div className="container bg-white shadow  rounded px-3 py-4 mt-5">
          <h3 className="text-center">
            System Admin Profile Page
          </h3>
        </div>
      </MainContainer>
    )
  }
  return <Redirect to="/404"/>

}
