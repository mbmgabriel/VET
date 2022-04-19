import React, {useState, useEffect} from 'react'
import {Row, Col, Accordion, Button, Table} from 'react-bootstrap'
import CoursesAPI from '../../../api/CoursesAPI'
import { useParams } from "react-router";
import moment from 'moment';

function SchoolCourseFiles({setLoading}) {
  const [modules, setModules] = useState([])
  const [moduleId, setModuleId] = useState(null)
  const [files, setFiles] = useState([])
  const {id} = useParams()
  
  const getCourseUnit = async () =>{
    setLoading(true)
    let response = await new CoursesAPI().getCourseUnit(id)
      if(response.ok){
        setModules(response.data)
      }else{
        alert(response.data.errorMessage)
      }
      setLoading(false)
  }

  useEffect(() => {
    getCourseUnit()
  }, [])

  const getFiles = async () =>{
    setLoading(true)
    let response = await new CoursesAPI().getFiles(id)
    if(response.ok){
      setFiles(response.data)
      setModuleId(id)
    }else{
      alert(response.data.errorMessage)
    }
    setLoading(false)
  }

  useEffect(() => {
    getFiles()
  }, [])

  console.log('modulesmodulesmodules:', modules)

  return (
        <div className='rounded-white-container'>
      <div className="col-md-10 pages-header"><p className='title-header'>Files </p>
			</div>
            <Table>
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Date Modified</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map(item =>{
                    return(
                      <>
                        <tr>
                          <td><a target="_blank" className='href-link'  href={item?.path_Base}><p style={{fontSize:'18px'}}>{item?.fileName}</p> </a></td>
                          <td className='ellipsis w-25' style={{fontSize:'20px'}} >{moment(item.createdDate).format('LL')}</td>
                        </tr>
                      </>
                    )
                  })}
   
              </tbody>
            </Table>
    </div>
  )
}

export default SchoolCourseFiles