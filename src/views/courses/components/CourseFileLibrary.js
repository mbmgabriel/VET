import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilesAPI from '../../../api/FilesApi';
import FileHeader from './AssignmentFileHeader';
import { useParams } from 'react-router'

export default function CourseFileLibrary(){

  const [displayFiles, setDisplayFiles] = useState([]);
  const {id} = useParams();
  const [displayFolder, setDisplayFolder] = useState([])
  const [breedCrumbsItemClass, setBreedCrumbsItemClass] = useState([])
  const subFolderDirectory = breedCrumbsItemClass.map(item => { return `/${item.value}`}) //to get sub directory based on breedcrumbs

	useEffect(() => {
    handleGetCourseFiles('')
  }, [])

  const handleGetCourseFiles = async(name) => {
    // setLoading(true)
    let data = {
      "subFolderLocation": name
    }
    let response = await new FilesAPI().getCourseFiles(id, data)
    // setLoading(false)
    if(response.ok){
      setDisplayFiles(response?.data?.files)
      setDisplayFolder(response?.data?.folders)
    }else{
      alert("Something went wrong while fetching Course files.")
    }
  }

  const clickFile = (link) => {
    navigator.clipboard.writeText(link)
    toast.success('File link copied to clipboard.')
  }

  const handleClickedFolder = (name) =>{
    let temp = {
      naame: name,
      value: name
    }
    breedCrumbsItemClass.push(temp)
    setBreedCrumbsItemClass(breedCrumbsItemClass);
    handleGetCourseFiles(`${subFolderDirectory.join('')}/${name}`);
  }

  const handleClickedBreadcrumbsItem = (value, index) => {
    subFolderDirectory.length = index+1;
    breedCrumbsItemClass.length = index+1;
    handleGetCourseFiles(subFolderDirectory.join(''));
  }

	return (
    <div>
      <FileHeader type={'Course'} title='Files' id={id} subFolder={subFolderDirectory.join('')} doneUpload={()=> handleGetCourseFiles()}/>
      <div>
        <span onClick={()=> {handleGetCourseFiles(''); setBreedCrumbsItemClass([]);}} className={breedCrumbsItemClass.length != 0 ? 'colored-class-task' : 'fix-color-bread'}>Files</span>
        {
          breedCrumbsItemClass.map((item, index) => {
            return <span onClick={() => handleClickedBreadcrumbsItem(item.value, index)} className={breedCrumbsItemClass.length == (index+1) ? 'fix-color-bread' : 'colored-class-task'}>  <i class="fas fa-chevron-right m-l-10 m-r-10"></i> {item.naame}</span>
          })
        }
      </div>
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
              <img key={ind+item?.name} src={item.pathBase.replace('http:', 'https:')} onClick={() => clickFile(item.pathBase)} className='p-1' alt={item.name} height={30} width={30}/>
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
              <i className='fas fa-folder-open' onClick={()=> handleClickedFolder(itm.name)} title='' style={{height: 30, width: 30}}/>
            </OverlayTrigger>
          )
        })
      }
    </div>
	)
}