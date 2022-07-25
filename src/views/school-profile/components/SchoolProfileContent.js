import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import SchoolAPI from '../../../api/SchoolAPI'
import ActivityIndicator from '../../../components/loaders/ActivityIndicator'
import FullScreenLoader from '../../../components/loaders/FullScreenLoader'
import { UserContext } from '../../../context/UserContext'
import toBase64 from '../../../utils/toBase64'

export default function SchoolProfileContent() {

  const userContext = useContext(UserContext)
  const { themeColor, setThemeColor, themeLogo, setThemeLogo } = userContext.data 
  const [loading, setLoading] = useState(false)
  const [logo, setLogo] = useState(themeLogo)
  const [fileName, setFileName] = useState("")
  const [theme, setTheme] = useState(themeColor)
  const [themeChanged, setThemeChanged] = useState(false)

  const onFileChange = async (e) => {
    if(e.target.files && e.target.files.length === 0){
      toast.error("You need to select a file")
      return
    }
    const file = e.target.files[0]

    console.log({file})
    let base64Img = await toBase64(file)
    setLogo(base64Img.base64String)
    setFileName(base64Img.fileName)
    console.log({base64Img})
  }

  const saveFile = async () => {
    if(fileName === ""){
      toast.error("You need to select a file")
      return
    }
    setLoading(true)
    let response = await new SchoolAPI().updateSchoolLogo({
      "base64String": logo,
      fileName
    })
    if(response.ok){
      setFileName("")
      setThemeLogo(logo)
      toast.success("Logo saved successfully")
    }else{
      toast.error("Something went wrong while saving logo")
    }
    setLoading(false)
  }

  const saveTheme = async () => {
    setLoading(true)
    let response = await new SchoolAPI().updateSchoolTheme({
      color: theme
    })
    if(response.ok){
      setThemeChanged(false)
      toast.success("Theme saved successfully")
    }else{
      toast.error("Something went wrong while saving theme")
    }
    setLoading(false)

  }

  return (
    <div className='rounded-white-container'>
      {loading && <FullScreenLoader />}
      <h1 className='title mb-3'>School Profile</h1>
      <p className='label m-0'>Logo</p>
      <img 
        src={logo} 
        onError={() => setLogo("https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg")} 
        alt="School Logo" 
        className='school-logo'
      />
      <input type="file" className='d-block mt-2' onChange={onFileChange}/>
      <Button type="submit" className='btn px-4 mt-2 btn-primary' disabled={fileName === ""} onClick={saveFile}>Save</Button>
      <p className='label mt-5 m-0'>Theme Color: {theme}</p>
      <input type="color" className='d-block' value={theme} onChange={(e) => {
          setThemeChanged(true)
          setTheme(e.target.value)
          setThemeColor(e.target.value)
        }}
      />
      <Button type="submit" className='btn px-4 mt-2 btn-primary' disabled={!themeChanged} onClick={saveTheme}>Save</Button>
    </div>
  )
}
