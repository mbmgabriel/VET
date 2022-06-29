import React, {useEffect, useState} from 'react'
import ClassFilesContent from './components/ClassFileContent';
import { useParams } from 'react-router';
import ClassFileHeader from './components/ClassFileHeader'
import { InputGroup, FormControl, Table } from 'react-bootstrap';
import FilesAPI from '../../api/FilesApi';
import ClassesAPI from '../../api/ClassesAPI';
import ClassSideNavigation from './components/ClassSideNavigation';
import ClassBreadcrumbs from './components/ClassBreedCrumbs';

function ClassFiles() {
  const {id} = useParams();
  const [filesToDisplay, setFilesToDisplay] = useState([]);
  const [foldersToDisplay, setFolderToDisplay] = useState([]);
  const [breadCrumbsItemClass, setBreadCrumbsItemClass] = useState([])
  const [filter, setFilter] = useState("");
  const subFolderDirectory = breadCrumbsItemClass.map(item => { return `/${item.value}`})
  const subsType = localStorage.getItem('subsType');
  const [displayClassCourse, setDisplayClassCourse] = useState(false);
  const [displayType, setDisplayType] = useState('');
  const [courseId, setCourseId] = useState(null)

  useEffect(() => {
    getClassInfo();
    if(subsType != 'LMS'){
      window.location.href = "/classes"
    }
  }, [])

  const getClassInfo = async() => {
    // setLoading(true)
    let response = await new ClassesAPI().getClassInformation(id)
    if(response.ok){
      setCourseId(response?.data?.courseId)
      console.log({response})
    }
    // setLoading(false)
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
    let response = await new FilesAPI().getClassFiles(id, data)
    // setLoading(false)
    if(response.ok){
      setFilesToDisplay(response.data.files);
      setFolderToDisplay(response.data.folders)
    }else{
      alert("Something went wrong while fetching class files.")
    }
  }

  const handleClickedClassBread = () => {
    handleGetClassFiles('')
    setBreadCrumbsItemClass([])
  }


  const handleClickedBreadcrumbsItem = (value, index, type) => {
    if(type == 'Class'){
      subFolderDirectory.length = index+1;
      breadCrumbsItemClass.length = index+1;
      handleGetClassFiles(subFolderDirectory.join(''));
    }
  }

  const handleClickedFolder = (name, type) =>{
    if(type == 'Class'){
      let temp = {
        naame: name,
        value: name
      }
      breadCrumbsItemClass.push(temp)
      handleGetClassFiles(`${subFolderDirectory.join('')}/${name}`);
    }else{
      let temp = {
        naame: name,
        value: name
      }
      breadCrumbsItemClass.push(temp)
      handleGetCourseFiles(`${subFolderDirectory.join('')}/${name}`);
    }
  }

  const handleGetCourseFiles = async(name) => {
    // setLoading(true)
    let data = {
      "subFolderLocation": name
    }
    let response = await new FilesAPI().getCourseFiles(courseId, data)
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
    setDisplayClassCourse(true);
    if(data == 'Class'){
      handleGetClassFiles('');
    }else{
      handleGetCourseFiles('');
    }
  }

  return (
    <ClassSideNavigation>
      <ClassBreadcrumbs title={ displayClassCourse ? `${displayType} Files` : ''} clicked={() => {setDisplayClassCourse(false); setDisplayType('');}} />
      {displayClassCourse ?
        <div className="row m-b-20 file-content">
          <ClassFileHeader type={displayType}  title={`${displayType} Files`} subFolder={subFolderDirectory.join('')} id={id} doneUpload={()=> handleRefetch()}/>
          <div className="col-md-12 m-b-20">
            <InputGroup size="lg">
              <FormControl onChange={(e) => setFilter(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search Class Files Here" type="search"/>
              <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
            </InputGroup>
          </div>
          <div>
            <span onClick={()=> handleClickedClassBread()} className={breadCrumbsItemClass.length == 0 ? 'fix-color-bread' : 'colored-files-bread'}>{displayType} Files </span>
            {
              breadCrumbsItemClass.map((item, index) => {
                return <span onClick={() => handleClickedBreadcrumbsItem(item.value, index, 'Class')} className={breadCrumbsItemClass.length == (index+1) ? 'fix-color-bread' : 'colored-files-bread'}>  <i class="fas fa-chevron-right m-l-10 m-r-10"></i> {item.naame}</span>
              })
            }
          </div>
          <ClassFilesContent filter={filter} data={filesToDisplay} subFolder={subFolderDirectory.join('')} folders={foldersToDisplay} clickedFolder={(data) => handleClickedFolder(data.name, displayType)} type={displayType} id={displayType == 'Class' ? id : courseId} deleted={()=> handleRefetch()} />
        </div>
        :
        <>
          <div className="row">
            <p className='title-header'>Files </p>
          </div>
          <Table responsive="sm">
            <thead>
              <tr>
                <th>Name</th>  {/* icon for sorting <i class="fas fa-sort-alpha-down td-file-page"></i> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td onClick={() => handleClickedItem('Class')} colSpan={3} className='ellipsis w-25 colored-class'><i className="fas fa-folder" /><span className='font-size-22'> Class Files</span></td>
              </tr>
              <tr>
                <td colSpan={3} onClick={() => handleClickedItem('Course')} className='ellipsis w-25 colored-class'><i className="fas fa-folder" /><span className='font-size-22'> Course Files</span></td>
              </tr>
            </tbody>
          </Table>
        </>  
      }
    </ClassSideNavigation>
  )
}

export default ClassFiles
