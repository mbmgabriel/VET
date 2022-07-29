import React, { useState, useEffect, useContext } from "react";
import MainContainer from '../../components/layouts/MainContainer'
import {Button, Row, Col, Accordion, Form, InputGroup, FormControl} from 'react-bootstrap'
import FilesContent from './FilesContent';
import FileHeader from './FileHeader'
import CoursesAPI from "../../api/CoursesAPI";
import AcademicTermAPI from '../../api/AcademicTermAPI';
import ClassesAPI from '../../api/ClassesAPI';
import FilesAPI from '../../api/FilesApi';
import { UserContext } from '../../context/UserContext';
import FileItem from './components/FileItems';
import { toast } from "react-toastify";
import { useParams } from "react-router";
import Files from "./Files";

export default function FilesClass() {
  const [loading, setLoading] = useState(false)
  const userContext = useContext(UserContext)
  const {user} = userContext.data;
  const [allClass, setAllClass] = useState([])
  const [courseFiles, setCourseFiles] = useState([]);
  const [classFiles, setClassFiles] = useState([]);
  const [openIndexCourse, setOpenIndexCourse] = useState(false)
  const [openIndexClass, setOpenIndexClass] = useState(false)
  // const {id} = useParams();
  const [selectedId, setSelectedId] = useState('')
  const [filesToDisplay, setFilesToDisplay] = useState([]);
  const [foldersToDisplay, setFolderToDisplay] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [breadCrumbsItemCourse, setBreadCrumbsItemCourse] = useState([])
  const [breadCrumbsItemClass, setBreadCrumbsItemClass] = useState([]);
  const [filter, setFilter] = useState("");
  const [classFilter, setClassFilter] = useState('');
  const [classInfo, setClassInfo] = useState({});
  const [currentAcademicTerm, setCurrentAcademicTerm] = useState('');
  
  const subFolderDirectory = breadCrumbsItemClass.map(item => { return `/${item.value}`})
  subFolderDirectory.shift();

  const getClasses = async() => {
    setLoading(true)
    let response = await new ClassesAPI().getClasses(user?.teacher?.id)
    if(response.ok){
      setLoading(false)
      setAllClass(response.data)
    }else{
      setLoading(false)
      toast.error("Something went wrong while fetching all classes")
    }
  }


  const handleRefetch = (type) => {
    if(type == 'Class'){
      handleGetClassFiles(selectedId, subFolderDirectory.join(''));
    }
  }

  useEffect(()=>{
    getClasses();
    getAcademicTerm();
  }, [])

  useEffect(() => {
    if (user.isStudent) return (window.location.href = "/404");
  }, []);

  const getAcademicTerm = async () =>{
    let response = await new AcademicTermAPI().fetchAcademicTerm()
    if(response.ok){
      let data = response.data;
      let obj = data.find(o => o.isCurrentTerm === true);
      setCurrentAcademicTerm(obj.academicTermName);
    }else{
      toast.error("Something went wrong while fetching all Academic Term")
    }
  }


  const handleGetClassFiles = async(id, name) => {
    // setLoading(true)
    let data = {
      "subFolderLocation":  name
    }
    let response = await new FilesAPI().getClassFiles(id, data)
    // setLoading(false)
    if(response.ok){
      setFilesToDisplay(response.data.files);
      setFolderToDisplay(response.data.folders)
    }else{
      toast.error("Something went wrong while fetching class files.")
    }
  }

  const handleClickedClass = (item) => {
    let temp = {
      naame: item.className,
      value: ''
    }
    breadCrumbsItemClass.push(temp)
    setSelectedId(item.classId)
    handleGetClassFiles(item.classId, '');
    setOpenIndexClass(true)
  }

  const handleClickedBreadcrumbsItem = (value, index, type) => {
    if(type == 'Class'){

      subFolderDirectory.length = index;
      breadCrumbsItemClass.length = index+1;
      handleGetClassFiles(selectedId, subFolderDirectory.join(''));
      setSelectedName(value)
    }
  }

  const handleClickedClassBread = () => {
    setOpenIndexClass(false);
    setBreadCrumbsItemClass([])
  }

  const handleClickedFolder = (id, name, type) =>{
    if(type == 'Class'){
      let temp = {
        naame: name,
        value: name
      }
      breadCrumbsItemClass.push(temp)
      handleGetClassFiles(id,`${subFolderDirectory.join('')}/${name}`);
      setSelectedName(name);
    }
  }

 
  return (
    <Files>
      <Col className='mt-5 scrollable pb-3 vh-85'>
        <div className='content-pane'>
          <Col>
            {
              openIndexClass ?
              <>
                <FileHeader type={'Class'}  title='Class Files' id={selectedId} subFolder={subFolderDirectory.join('')} doneUpload={()=> handleRefetch('Class')}/>
                <div className="col-md-12 m-b-20">
                  <InputGroup size="lg">
                    <FormControl  aria-label="Large" onChange={(e) => setFilter(e.target.value)} aria-describedby="inputGroup-sizing-sm" placeholder="Search files here" type="search"/>
                    <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
                  </InputGroup>
                </div>
                <div>
                  <span onClick={()=> handleClickedClassBread()} className={breadCrumbsItemClass.length == 0 ? 'fix-color-bread' : 'colored-files-bread'}>Class Files</span>
                  {
                    breadCrumbsItemClass.map((item, index) => {
                      return(
                        <span className={breadCrumbsItemClass.length == (index+1) ? 'fix-color-bread' : 'colored-files-bread'} onClick={() => handleClickedBreadcrumbsItem(item.value, index, 'Class')}> 
                          <i class="fas fa-chevron-right m-l-10 m-r-10"/>
                          {item.naame}
                        </span>
                      )
                    })
                  }
                </div>
                <FilesContent filter={filter} data={filesToDisplay} subFolder={subFolderDirectory.join('')} folders={foldersToDisplay} clickedFolder={(data) => handleClickedFolder(selectedId ,data.name, 'Class')}  type={'Class'} id={selectedId} deleted={()=> handleRefetch('Class') }/>
              </>
              :
              <>
                <div className="row">
                  <p className='title-header'>Class Files </p>
                </div>
                <div className="row m-b-20">
                  <div className="col-md-12">
                    <InputGroup size="lg">
                      <FormControl onChange={(e) => setClassFilter(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search files here" type="search"/>
                      <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
                    </InputGroup>
                  </div>
                </div>
                  <div>
                    <span  style={{color:'#7D7D7D', fontSize:'20px', paddingLeft:'15px'}}>
                      Class Files
                    </span>
                  </div>
                {
                  allClass.filter(item => item.className.toLowerCase().includes(classFilter.toLowerCase())).map((item, index) => {
                    return(
                      currentAcademicTerm == item.termName && <div key={item.className} className="colored-class">
                        <div className='inline-flex'>
                          <div style={{paddingLeft:'20px'}}>
                            <i class="fas fa-folder"></i> 
                          </div>
                          <div style={{paddingLeft:'15px'}}>
                          <p className="mb-0" onClick={() => handleClickedClass(item)}>{item.className} </p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </>
            }
          </Col>
        </div>
      </Col>
    </Files>
  )
}
