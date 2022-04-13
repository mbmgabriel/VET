import React, {useState, useEffect} from 'react'
import {  Col, Row, Card, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router';
import MainContainer from '../../../components/layouts/MainContainer'
import ClassAdminSideNavigation from './components/ClassAdminSideNavigation'
import FilesContent from '../../files/FilesContent';
import FileHeader from '../../files/FileHeader'
import FilesAPI from '../../../api/FilesApi';

export default function SchoolAdminFiles() {
  const {id} = useParams();
  const [filesToDisplay, setFilesToDisplay] = useState([]);
  const [foldersToDisplay, setFolderToDisplay] = useState([]);
  const [breadCrumbsItemClass, setBreadCrumbsItemClass] = useState([])
  const [selectedName, setSelectedName] = useState('');
  const [filter, setFilter] = useState("");
  const subFolderDirectory = breadCrumbsItemClass.map(item => { return `/${item.value}`})

  useEffect(() => {
    handleGetClassFiles('')
  }, [])

  const handleRefetch = () => {
    handleGetClassFiles(subFolderDirectory.join(''))
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
      setSelectedName(value)
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
      setSelectedName(name); //subfolder name
    }
  }

  return (
    <MainContainer title="School" activeHeader={"classes"} style='not-scrollable'>
      <Row className="mt-4">
        <Col sm={3}>
          <ClassAdminSideNavigation active="files"/>
        </Col>
        <Col sm={9} className='scrollable vh-85'>
          <div className="row m-b-20 file-content">
            <FileHeader type='Class'  title='Class Files' subFolder={subFolderDirectory.join('')} id={id} doneUpload={()=> handleRefetch()}/>
            <div className="col-md-12 m-b-20">
              <InputGroup size="lg">
                <FormControl onChange={(e) => setFilter(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search files here" type="search"/>
                <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
              </InputGroup>
            </div>
            <div>
              <span onClick={()=> handleClickedClassBread()} className={breadCrumbsItemClass.length == 0 ? 'fix-color-bread' : 'colored-files-bread'}>Class Files</span>
              {
                breadCrumbsItemClass.map((item, index) => {
                  return <span onClick={() => handleClickedBreadcrumbsItem(item.value, index, 'Class')} className={breadCrumbsItemClass.length == (index+1) ? 'fix-color-bread' : 'colored-files-bread'}>  <i class="fas fa-chevron-right m-l-10 m-r-10"></i> {item.naame}</span>
                })
              }
            </div>
            <FilesContent filter={filter} data={filesToDisplay} subFolder={subFolderDirectory.join('')} folders={foldersToDisplay} clickedFolder={(data) => handleClickedFolder(data.name, 'Class')} type='Class' id={id} deleted={()=> handleRefetch()} />
          </div>
        </Col>
      </Row>
    </MainContainer>
  )
}

// import React, {useEffect, useState} from 'react'
// import FilesContent from '../files/FilesContent';
// import { useParams } from 'react-router';
// import FileHeader from '../files/FileHeader'
// import { InputGroup, FormControl } from 'react-bootstrap';
// import FilesAPI from '../../api/FilesApi';
// import ClassSideNavigation from './components/ClassSideNavigation';
// import ClassBreadcrumbs from './components/ClassBreedCrumbs';

// function ClassFiles() {
//   const {id} = useParams();
//   const [filesToDisplay, setFilesToDisplay] = useState([]);
//   const [foldersToDisplay, setFolderToDisplay] = useState([]);
//   const [breadCrumbsItemClass, setBreadCrumbsItemClass] = useState([])
//   const [selectedName, setSelectedName] = useState('');
//   const [filter, setFilter] = useState("");
//   const subFolderDirectory = breadCrumbsItemClass.map(item => { return `/${item.value}`})

//   useEffect(() => {
//     handleGetClassFiles('')
//   }, [])

//   const handleRefetch = () => {
//     handleGetClassFiles(subFolderDirectory.join(''))
//   }

//   const handleGetClassFiles = async(name) => {
//     // setLoading(true)
//     let data = {
//       "subFolderLocation": name
//     }
//     let response = await new FilesAPI().getClassFiles(id, data)
//     // setLoading(false)
//     if(response.ok){
//       setFilesToDisplay(response.data.files);
//       setFolderToDisplay(response.data.folders)
//     }else{
//       alert("Something went wrong while fetching class files.")
//     }
//   }

//   const handleClickedClassBread = () => {
//     handleGetClassFiles('')
//     setBreadCrumbsItemClass([])
//   }


//   const handleClickedBreadcrumbsItem = (value, index, type) => {
//     if(type == 'Class'){
//       subFolderDirectory.length = index+1;
//       breadCrumbsItemClass.length = index+1;
//       handleGetClassFiles(subFolderDirectory.join(''));
//       setSelectedName(value)
//     }
//   }

//   const handleClickedFolder = (name, type) =>{
//     if(type == 'Class'){
//       let temp = {
//         naame: name,
//         value: name
//       }
//       breadCrumbsItemClass.push(temp)
//       handleGetClassFiles(`${subFolderDirectory.join('')}/${name}`);
//       setSelectedName(name); //subfolder name
//     }
//   }

//   return (
//     <ClassSideNavigation>
//       <ClassBreadcrumbs title='' clicked={() => console.log('')} />
//       <div className="row m-b-20 file-content">
//         <FileHeader type='Class'  title='Class Files' subFolder={subFolderDirectory.join('')} id={id} doneUpload={()=> handleRefetch()}/>
//         <div className="col-md-12 m-b-20">
//           <InputGroup size="lg">
//             <FormControl onChange={(e) => setFilter(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search files here" type="search"/>
//             <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
//           </InputGroup>
//         </div>
//         <div>
//           <span onClick={()=> handleClickedClassBread()} className={breadCrumbsItemClass.length == 0 ? 'fix-color-bread' : 'colored-files-bread'}>Class Files</span>
//           {
//             breadCrumbsItemClass.map((item, index) => {
//               return <span onClick={() => handleClickedBreadcrumbsItem(item.value, index, 'Class')} className={breadCrumbsItemClass.length == (index+1) ? 'fix-color-bread' : 'colored-files-bread'}>  <i class="fas fa-chevron-right m-l-10 m-r-10"></i> {item.naame}</span>
//             })
//           }
//         </div>
//         <FilesContent filter={filter} data={filesToDisplay} subFolder={subFolderDirectory.join('')} folders={foldersToDisplay} clickedFolder={(data) => handleClickedFolder(data.name, 'Class')} type='Class' id={id} deleted={()=> handleRefetch()} />
//       </div>
//     </ClassSideNavigation>
//   )
// }

// export default ClassFiles

