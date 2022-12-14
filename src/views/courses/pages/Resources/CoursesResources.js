import React, {useEffect, useState, useContext} from 'react'
import {Accordion, Row, Col, InputGroup, FormControl} from 'react-bootstrap'
import FilesContent from '../../../resources/FilesContent';
import FileHeader from '../../../resources/FileHeader'
import FilesAPI from '../../../../api/FilesApi';
import CourseContent from "../../CourseContent";
import {useParams} from 'react-router';
import CourseBreadcrumbs from "../../components/CourseBreadcrumbs";
import {UserContext} from '../../../../context/UserContext';

function CoursesResources() {
  const [filesToDisplay, setFilesToDisplay] = useState([]);
  const [foldersToDisplay, setFolderToDisplay] = useState([]);
  const {id} = useParams();
  const [selectedName, setSelectedName] = useState('');
  const [breadCrumbsItemCourse, setBreadCrumbsItemCourse] = useState([])
  const [filter, setFilter] = useState('');
  const subFolderDirectory = breadCrumbsItemCourse.map(item => { return `/${item.value}`})
  const userContext = useContext(UserContext);
  const {user} = userContext.data;
  const subsType = user.subsType;

  useEffect(() => {
    handleGetTeacherResources('')
    // if(subsType != 'LMS' || subsType == 'TeacherResources'){
    //   window.location.href = "/courses"
    // }
  }, [])

  const handleRefetch = () => {
    handleGetTeacherResources(subFolderDirectory.join(''))
  }

  const handleGetTeacherResources = async(name) => {
    // setLoading(true)
    setSelectedName(name);
    let data = {
      "subFolderLocation": name
    }
    let response = await new FilesAPI().getTeacherResources(id, data)
    // setLoading(false)
    if(response.ok){
      setFilesToDisplay(response.data?.files);
      setFolderToDisplay(response.data?.folders);
    }else{
      alert("Something went wrong while fetching Course files.")
    }
  }

  const handleClickedCourseBread = () => {
    setBreadCrumbsItemCourse([]);
    handleGetTeacherResources('')
  }

  const handleClickedFolder = (name) =>{
    let temp = {
      naame: name,
      value: name
    }
    breadCrumbsItemCourse.push(temp)
    handleGetTeacherResources(`${subFolderDirectory.join('')}/${name}`);
  }

  const handleClickedBreadcrumbsItem = (value, index, type) => {
    if(type == 'Course'){
     subFolderDirectory.length = index+1
      breadCrumbsItemCourse.length = index+1;
      handleGetTeacherResources(subFolderDirectory.join(''));
    }
  }

  return (
    <CourseContent>
      <CourseBreadcrumbs title={''} clicked={() => console.log('')}/>
      <div className="row m-b-20 file-content">
        <FileHeader type='Course'  title='Teacher Resources' id={id} subFolder={subFolderDirectory.join('')}  doneUpload={()=> handleRefetch()}/>
        <div className="row m-b-20">
          <div className="col-md-12">
            <InputGroup size="lg">
              <FormControl onChange={(e) => setFilter(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search File here" type="search"/>
              <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
            </InputGroup>
          </div>
        </div>
        <p style={{fontSize: '20px'}}>
          <span onClick={()=> handleClickedCourseBread()} className={breadCrumbsItemCourse.length == 0 ? 'fix-color-bread' : 'colored-files-bread'}>Teacher Resources</span>
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
        <FilesContent filter={filter} data={filesToDisplay} folders={foldersToDisplay} subFolder={subFolderDirectory.join('')} clickedFolder={(data) => handleClickedFolder(data.name)} deleted={() => handleRefetch()} type='Course' id={id}/>
      </div>
    </CourseContent>
  )
}

export default CoursesResources
