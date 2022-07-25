import React, {useEffect, useState, useContext} from 'react'
import ClassFilesContent from './components/ClassFileContent';
import { useParams } from 'react-router';
import ClassFileHeader from './components/ClassFileHeader'
import { InputGroup, FormControl, Table } from 'react-bootstrap';
import FilesAPI from '../../api/FilesApi';
import ClassesAPI from '../../api/ClassesAPI';
import CoursesAPI from '../../api/CoursesAPI'
import ClassSideNavigation from './components/ClassSideNavigation';
import ClassBreadcrumbs from './components/ClassBreedCrumbs';
import { UserContext } from '../../context/UserContext';
import FilesContent from '../files/FilesContent';

function ClassFiles() {
  const {id} = useParams();
  const [filesToDisplay, setFilesToDisplay] = useState([]);
  const [foldersToDisplay, setFolderToDisplay] = useState([]);
  const [breadCrumbsItemCourse, setBreadCrumbsItemCourse] = useState([])
  const userContext = useContext(UserContext)
  const {user} = userContext.data

  const [breadCrumbsItemClass, setBreadCrumbsItemClass] = useState([])
  const [filter, setFilter] = useState("");
  const subFolderDirectory = breadCrumbsItemClass.map(item => { return `/${item.value}`})
  const subsType = user.subsType;
  const [displayClassCourse, setDisplayClassCourse] = useState(false);
  const [displayType, setDisplayType] = useState('');
  const [courseId, setCourseId] = useState(null)
  const [isContributor, setIsContributor] = useState(true);

  useEffect(() => {
    getClassInfo();
    // if(subsType != 'LMS'){
    //   window.location.href = "/classes"
    // }
  }, [])

  const getClassInfo = async() => {
    // setLoading(true)
    let response = await new ClassesAPI().getClassInformation(id)
    if(response.ok){
      setCourseId(response?.data?.courseId);
      // getCourseInformation(response?.data?.courseId);
      console.log({response})
    }
    // setLoading(false)
  }

  useEffect(() => {
    courseId && handleGetCourseFiles('');
  }, [courseId])

  const getCourseInformation = async(cId) => {
    let response = await new CoursesAPI().getCourseInformation(cId);
    if(response.ok){
      let TFICourse = response.data.isTechfactors;
      console.log(response.data, 'infoooooooooooooooooo', TFICourse);
      if(TFICourse){
        let contriList = await new CoursesAPI().getContributor(cId)
        console.log(contriList, "--------------------------------");
        let ifContri = contriList.data.find(i => i.userInformation?.userId == user.userId);
        console.log(ifContri, user.userId, '-=-=-=')
        setIsContributor(ifContri ? true : false);
      }
    }
  }

  const handleRefetch = () => {
    if(displayType == 'Class'){
      handleGetClassFiles(subFolderDirectory.join(''));
    }else{
      handleGetCourseFiles(subFolderDirectory.join(''));
    }
  }

  const handleGetClassFiles = async(name) => {
    // setLoading(true)
    let data = {
      "subFolderLocation": name
    }
    let response = await new FilesAPI().ebooksFiles(courseId, data)
    // setLoading(false)
    if(response.ok){
      setFilesToDisplay(response.data.files);
      setFolderToDisplay(response.data.folders)
    }else{
      alert("Something went wrong while fetching class files.")
    }
  }

  const handleClickedCourseBread = () => {
    setBreadCrumbsItemCourse([]);
    handleGetCourseFiles('')
  }

  const handleClickedBreadcrumbsItem = (value, index, type) => {
    subFolderDirectory.length = index+1;
    breadCrumbsItemClass.length = index+1;
    handleGetCourseFiles(subFolderDirectory.join(''));
  }

  const handleClickedFolder = (name, type) =>{
      let temp = {
        naame: name,
        value: name
      }
      breadCrumbsItemClass.push(temp)
      handleGetCourseFiles(`${subFolderDirectory.join('')}/${name}`);
  }

  const handleGetCourseFiles = async(name) => {
    // setLoading(true)
    let data = {
      "subFolderLocation": name
    }
    let response = await new FilesAPI().ebooksFiles(courseId, data)
    // setLoading(false)
    if(response.ok){
      setFilesToDisplay(response.data.files);
      setFolderToDisplay(response.data.folders);
    }else{
      alert("Something went wrong while fetching Course files.")
    }
  }

  const handleClickedItem = (data) => {
    setDisplayType(data);
    handleGetCourseFiles('');
  }

  return (
    <ClassSideNavigation>
      <ClassBreadcrumbs title='Class Files' clicked={() => {setDisplayClassCourse(false); setDisplayType('');}} />
      <div className="row m-b-20 file-content">
        <div>
          <p className='title-header'>Files</p>
        </div>
        <div className="row m-b-20">
          <div className="col-md-12">
            <InputGroup size="lg">
              <FormControl onChange={(e) => setFilter(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search File here" type="search"/>
              <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
            </InputGroup>
          </div>
        </div>
        <p style={{fontSize: '20px'}}>
          {/* <span onClick={()=> handleClickedCourseBread()} className={breadCrumbsItemCourse.length == 0 ? 'fix-color-bread' : 'colored-files-bread'}>Course Files</span> */}
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
        <FilesContent filter={filter} data={filesToDisplay} folders={foldersToDisplay} subFolder={subFolderDirectory.join('')} clickedFolder={(data) => handleClickedFolder(data.name)} deleted={() => handleRefetch()} type='Ebooks' id={id}/>
      </div>
    </ClassSideNavigation>
  )
}

export default ClassFiles
