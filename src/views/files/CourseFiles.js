import React, { useState, useEffect, useContext } from "react";
import MainContainer from '../../components/layouts/MainContainer'
import {Button, Row, Col, Accordion, Form, InputGroup, FormControl} from 'react-bootstrap'
import FilesContent from './FilesContent';
import FileHeader from './FileHeader'
import CoursesAPI from "../../api/CoursesAPI";
import ClassesAPI from '../../api/ClassesAPI';
import FilesAPI from '../../api/FilesApi';
import { UserContext } from '../../context/UserContext';
import { useParams } from "react-router";
import Files from "./Files";

export default function FilesCourse() {
  const [loading, setLoading] = useState(false)
  const userContext = useContext(UserContext)
  const {user} = userContext.data;
  const [allCourse, setAllCourse] = useState([])
  const [openIndexCourse, setOpenIndexCourse] = useState(false)
  // const {id} = useParams();
  const [selectedId, setSelectedId] = useState('')
  const [filesToDisplay, setFilesToDisplay] = useState([]);
  const [foldersToDisplay, setFolderToDisplay] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [breadCrumbsItemCourse, setBreadCrumbsItemCourse] = useState([])
  const [filter, setFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const subFolderDirectory = breadCrumbsItemCourse.map(item => { return `/${item.value}`})
  subFolderDirectory.shift();

  const getCourses = async() => {
    setLoading(true)
    let response = await new CoursesAPI().getCourses()
    if(response.ok){
      setLoading(false)
      setAllCourse(response.data)
    }else{
      setLoading(false)
      alert("Something went wrong while fetching all courses")
    }
  }

  const handleGetCourseFiles = async(id, name) => {
    setSelectedName(name)
    // setLoading(true)
    let data = {
      "subFolderLocation": name
    }
    let response = await new FilesAPI().getCourseFiles(id, data)
    // setLoading(false)
    if(response.ok){
      setFilesToDisplay(response.data.files);
      setFolderToDisplay(response.data.folders);
    }else{
      alert("Something went wrong while fetching Course files.")
    }
  }

  const handleRefetch = (type) => {
    if(type == 'Course'){
      handleGetCourseFiles(selectedId, subFolderDirectory.join(''))
    }
  }

  useEffect(()=>{
    getCourses();
  }, [])

  useEffect(() => {
    if (user.isStudent) return (window.location.href = "/404");
  }, []);

  const handleClickedCourse = (item) => {
    let temp = {
      naame: item.courseName,
      value: ''
    }
    breadCrumbsItemCourse.push(temp)
    setSelectedId(item.id)
    handleGetCourseFiles(item.id, '');
    setOpenIndexCourse(true)
  }


  const handleClickedBreadcrumbsItem = (value, index, type) => {
    if(type == 'Course'){
      subFolderDirectory.length = index;
      breadCrumbsItemCourse.length = index+1;
      handleGetCourseFiles(selectedId, subFolderDirectory.join(''));
      setSelectedName(value)
    }
  }

  const handleClickedCourseBread = () => {
    setOpenIndexCourse(false)
    setBreadCrumbsItemCourse([])
  }

  const handleClickedFolder = (id, name, type) =>{
    if(type == 'Course'){
      let temp = {
        naame: name,
        value: name
      }
      breadCrumbsItemCourse.push(temp)
      handleGetCourseFiles(id, `${subFolderDirectory.join('')}/${name}`);
    }
  }

  return (
    <Files>
      <Col className='mt-5 scrollable pb-3 vh-85'>
        <div className='content-pane'>
          <>
          <Col>
            {
              openIndexCourse ?
              <>
                <FileHeader type={'Course'} title='Course Files' id={selectedId} subFolder={subFolderDirectory.join('')} doneUpload={()=> handleRefetch('Course')}/>
                <div className="row m-b-20">
                  <div className="col-md-12">
                    <InputGroup size="lg">
                      <FormControl  onChange={(e) => setFilter(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search File here" type="search"/>
                      <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
                    </InputGroup>
                  </div>
                </div>
                <p style={{fontSize: '20px'}}>
                  <span onClick={()=> handleClickedCourseBread()} className={breadCrumbsItemCourse.length == 0 ? 'fix-color-bread' : 'colored-files-bread'}>Course Files</span>
                  {
                    breadCrumbsItemCourse.map((item, index) => {
                      return(
                        <span onClick={() => handleClickedBreadcrumbsItem(item.value, index, 'Course')} className={breadCrumbsItemCourse.length == (index+1) ? 'fix-color-bread' : 'colored-files-bread'}>
                          <i class="fas fa-chevron-right m-l-10 m-r-10"/>
                          {item.naame}
                        </span>
                      )
                    })
                  }
                </p>
                <FilesContent filter={filter} data={filesToDisplay} folders={foldersToDisplay} subFolder={subFolderDirectory.join('')} clickedFolder={(data) => handleClickedFolder(selectedId ,data.name, 'Course')}  type={'Course'} id={selectedId} deleted={()=> handleRefetch('Course') }/>
            </>
            :
            <>
              <div className="row">
                <p className='title-header'>Course Files </p>
              </div>
              <div className="row m-b-20">
                <div className="col-md-12">
                  <InputGroup size="lg">
                    <FormControl onChange={(e) => setCourseFilter(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search files here" type="search"/>
                    <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
                  </InputGroup>
                </div>
              </div>
                <div>
                  <span  style={{color:'#7D7D7D', fontSize:'20px', paddingLeft:'15px'}}>
                    Course Files
                  </span>
              </div>
              {
                allCourse.filter(item =>
                  item.courseName.toLowerCase().includes(courseFilter.toLowerCase())).map((item, index) => {
                    console.log(item);
                  return(
                   item.status && 
                    <div className="colored-class">
                      <div className='inline-flex'>
                        <div style={{paddingLeft:'20px'}}>
                          <i class="fas fa-folder"></i> 
                        </div>
                        <div style={{paddingLeft:'15px'}}>
                        <p className="mb-0" onClick={() => handleClickedCourse(item)}>{item.courseName} </p>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </>
            }
          </Col>
          </>
        </div>
      </Col>
    </Files>
  )
}
