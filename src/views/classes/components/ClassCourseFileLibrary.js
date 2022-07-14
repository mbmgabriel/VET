import React, {useState, useEffect, useContext} from 'react'
import Modal from 'react-bootstrap/Modal'
import { Form, Button,  Tooltip, OverlayTrigger, Table} from 'react-bootstrap'
import { useParams } from 'react-router'
import ClassesAPI from '../../../api/ClassesAPI'
import CoursesAPI from '../../../api/CoursesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import FilesAPI from '../../../api/FilesApi';
import FileHeader from './Task/TaskFileHeader';
import { toast } from 'react-toastify';
import { UserContext } from '../../../context/UserContext';

function ClassCourseFileLibrary() {
  const [displayFiles, setDisplayFiles] = useState([]);
  const [displayFolder, setDisplayFolder] = useState([])
  const [breedCrumbsItemClass, setBreedCrumbsItemClass] = useState([])
  const subFolderDirectory = breedCrumbsItemClass.map(item => { return `/${item.value}`}) //to get sub directory based on breedcrumbs
  const [displayType, setDisplayType] = useState('');
  const [showFilesFolders, setShowFilesFolders] = useState(false);
  const [courseId, setCourseId] = useState(null)
  const {id} = useParams();
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [isContributor, setIsContributor] = useState(true);

  const getClassInfo = async() => {
    let response = await new ClassesAPI().getClassInformation(id)
    if(response.ok){
      setCourseId(response?.data?.courseId)
      getCourseInformation(response?.data?.courseId)
      console.log({response})
    }
  }

  const getCourseInformation = async(cId) => {
    let response = await new CoursesAPI().getCourseInformation(cId);
    if(response.ok){
      let TFICourse = response.data.isTechfactors;
      console.log(response.data, 'infoooooooooooooooooo', TFICourse)
      if(TFICourse){
        let contriList = await new CoursesAPI().getContributor(cId)
        console.log(contriList, "--------------------------------");
        let ifContri = contriList.data.find(i => i.userInformation?.userId == user.userId);
        console.log(ifContri, user.userId, '-=-=-=')
        setIsContributor(ifContri ? true : false);
      }
    }
  }

  useEffect(() => {
    getClassInfo()
  }, [])


  const handleGetClassFiles = async(name) => {
    let data = {
      "subFolderLocation": name
    }
    let response = await new FilesAPI().getClassFiles(id, data)
    // setLoading(false)
    if(response.ok){
      console.log(response, 'heeeeeeeere----------------')
      setDisplayFiles(response.data?.files)
      setDisplayFolder(response.data?.folders)
    }else{
      alert("Something went wrong while fetching class files.")
    }
  } 

  const handleClickType = (type) => {
    setDisplayType(type);
    setShowFilesFolders(!showFilesFolders)
    setBreedCrumbsItemClass([]);
    if(type == 'Class'){
      handleGetClassFiles('')
    }
    if(type == 'Course'){
      handleGetCourseFiles('')
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
      setDisplayFiles(response.data?.files)
      setDisplayFolder(response.data?.folders)
    }else{
      alert("Something went wrong while fetching Course files.")
    }
  }

  const handleFileBreed = () => {
    setBreedCrumbsItemClass([]);
    if(displayType == 'Class'){
      handleGetClassFiles('')
    }
    if(displayType == 'Course'){
      handleGetCourseFiles('')
    }
  }

  const handleClickedBreadcrumbsItem = (value, index, type) => {
    if(type == 'Class'){
      subFolderDirectory.length = index+1;
      breedCrumbsItemClass.length = index+1;
      handleGetClassFiles(subFolderDirectory.join(''));
    }
  }

  const clickFile = (link) => {
    navigator.clipboard.writeText(link)
    toast.success('File link copied to clipboard.')
  }

  const handleClickedFolder = (name, type) =>{
    if(type == 'Class'){
      let temp = {
        naame: name,
        value: name
      }
      breedCrumbsItemClass.push(temp)
      setBreedCrumbsItemClass(breedCrumbsItemClass);
      handleGetClassFiles(`${subFolderDirectory.join('')}/${name}`);
    }
    if(type == 'Course'){
      let temp = {
        naame: name,
        value: name
      }
      breedCrumbsItemClass.push(temp)
      setBreedCrumbsItemClass(breedCrumbsItemClass);
      handleGetCourseFiles(`${subFolderDirectory.join('')}/${name}`);
    }
  }

	return (
      <div>
        {displayType == 'Class' ?
          <FileHeader type='Class' id={id}  subFolder={`${subFolderDirectory.join('')}`}  doneUpload={()=> handleGetClassFiles(subFolderDirectory.join(''))} />
          :
          <div>
            <p className='title-header'>Files</p>
          </div>
        }
        <div>
          <span onClick={()=> handleClickType('')} className={displayType ? 'colored-class-task' : 'fix-color-bread'}>Files</span>
          {displayType && <span onClick={()=> handleFileBreed()} className={breedCrumbsItemClass.length == 0 ? 'fix-color-bread' : 'colored-class-task'}> <i class="fas fa-chevron-right m-l-10 m-r-10"></i> {displayType} Files</span>}
          {
            breedCrumbsItemClass.map((item, index) => {
              return <span onClick={() => handleClickedBreadcrumbsItem(item.value, index, 'Class')} className={breedCrumbsItemClass.length == (index+1) ? 'fix-color-bread' : 'colored-class-task'}>  <i class="fas fa-chevron-right m-l-10 m-r-10"></i> {item.naame}</span>
            })
          }
        </div>
        { showFilesFolders ?
          <>
          {
            displayFiles?.map( (item,ind) => {
              console.log(item)
                return(
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 1, hide: 0 }}
                    overlay={(props) => 
                      <Tooltip id="button-tooltip" {...props}>
                        {item.name}
                      </Tooltip>}
                  >
                  {item.pathBase?.match(/.(jpg|jpeg|png|gif|pdf)$/i) ? 
                    <img key={ind+item.name} src={item.pathBase.replace('http:', 'https:')} onClick={() => clickFile(item.pathBase)} className='p-1' alt={item.name} height={30} width={30}/>
                    :
                    <i className="fas fa-sticky-note" onClick={() => clickFile(item.pathBase)} style={{paddingRight: 5}}/>
                  }
                  </OverlayTrigger>
                )
              })
            }
            {
              displayFolder?.map((itm) => {
                return(
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 1, hide: 0 }}
                    overlay={(props) => 
                      <Tooltip id="button-tooltip" {...props}>
                        {itm.name}
                      </Tooltip>}
                  >
                    <i className='fas fa-folder-open' onClick={()=> handleClickedFolder(itm.name, displayType)} title='' style={{height: 30, width: 30}}/>
                  </OverlayTrigger>
                )
              })
            }
          </>
          :
          <Table responsive="sm">
            <thead>
              <tr>
                <th>Name</th>  {/* icon for sorting <i class="fas fa-sort-alpha-down td-file-page"></i> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} onClick={() => handleClickType('Class')} className='ellipsis w-25 task-folder'><i className="fas fa-folder" /><span> Class Files</span></td>
              </tr>
              {isContributor && <tr>
                <td colSpan={3} onClick={() => handleClickType('Course')} className='ellipsis w-25 task-folder'><i className="fas fa-folder" /><span> Course Files</span></td>
              </tr>}
            </tbody>
          </Table>
        }
      </div>
    )
}
export default ClassCourseFileLibrary

