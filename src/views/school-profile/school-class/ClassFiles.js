import React, {useState, useEffect} from 'react'
import {  Col, Row, Card, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router';
import MainContainer from '../../../components/layouts/MainContainer'
import ClassAdminSideNavigation from './components/ClassAdminSideNavigation'
import FilesContent from '../../files/FilesContent';
import FileHeader from '../../files/FileHeader'
import FilesAPI from '../../../api/FilesApi';

export default function SchoolAdminFiles() {
  const {id} = useParams();
  const [filesToDisplay, setFilesToDisplay] = useState([]);

  useEffect(() => {
    handleGetClassFiles()
  }, [])

  const handleRefetch = () => {
    handleGetClassFiles()
  }

  const handleGetClassFiles = async() => {
    // setLoading(true)
    let response = await new FilesAPI().getClassFiles(id)
    // setLoading(false)
    if(response.ok){
      setFilesToDisplay(response.data)
    }else{
      alert("Something went wrong while fetching class files ---.")
    }
  }

  return (
    <MainContainer title="School" activeHeader={"classes"}>
      <Row className="mt-4">
        <Col sm={3}>
          <ClassAdminSideNavigation active="files"/>
        </Col>
        <Col sm={9}>
          <div className="row m-b-20 file-content">
            <FileHeader type='Class' id={id} doneUpload={()=> handleRefetch()}/>
            <FilesContent data={filesToDisplay} type='Class' id={id} deleted={()=> handleRefetch()} />
          </div>
        </Col>
      </Row>
    </MainContainer>
  )
}
