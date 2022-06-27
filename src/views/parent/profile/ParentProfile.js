import React from 'react'

import { useContext } from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { UserContext } from '../../../context/UserContext';
import MainContainer from '../../../components/layouts/MainContainer'

export default function ParentProfile() {

  const userContext = useContext(UserContext)
  const {user} = userContext.data  

  
  if(user.isParent){
    return (
      <MainContainer title="Profile" activeHeader={"profile"}>
        <div className="container bg-white shadow  rounded px-3 py-4 mt-5">
          <h3 className="text-center">
            Parent Profile Page
          </h3>
        </div>
      </MainContainer>
    )
  }
  return <Redirect to="/404"/>

}
