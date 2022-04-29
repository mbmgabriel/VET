import React, { useState, useEffect} from 'react'
import CoursesAPI from '../../../../api/CoursesAPI'
import { useParams } from 'react-router'
import AccordionConference from './components/AccordionConference'
import AccordionLinks from './components/AccordionLinks'
import AccordionVideos from './components/AccordionVideos'
import HeaderLinks from './components/HeaderLinks'
import AccordionEdit from './components/AccordionEdit';
import CourseBreadcrumbs from "../../components/CourseBreadcrumbs";
import CourseContent from "../../CourseContent";

function CourseLinks() {
  const [openEditModal, setOpenEditModal] = useState(false)
  const [conference, setConference] = useState([])
  const [videos, setVidoes] = useState([])
  const [links, setLinks] = useState(null)
  const [editLinks, setEditLinks] = useState('')
  const {id} = useParams();
  const [searchTerm, setSearchTerm] = useState('')
  const [confeDescriptionItem, setConfeDescriptoinItem] = useState('')
  const [confeUrlItem, setConfeUrlItem] = useState('')
  const [itemId, setItemId] = useState()
  const [showTask, setShowTask] = useState(false);
  const [linkName, setLinkName] = useState('')


  const onSearch = (text) => {
    setSearchTerm(text)
  }
  
  const getConfe = async() => {
    let typeId = '1'
    let response = await new CoursesAPI().getLink(id, typeId)
    if(response.ok){
      setConference(response.data)
    }else{
      alert("Something went wrong while fetching all Conference")
    }
  }

  const clickedTab = () => {
    setLinks('');
    setShowTask(false)
  }

  useEffect(() => {
    getConfe()
  }, [])

  const getVideos = async() => {
    let typeId = '2'
    let response = await new CoursesAPI().getLink(id, typeId)
    if(response.ok){
      setVidoes(response.data)
    }else{
      alert("Something went wrong while fetching all Conference")
    }
  }

  useEffect(() => {
    getVideos()
  }, [])

  const getLinks = async() => {
    let typeId = '3'
    let response = await new CoursesAPI().getLink(id, typeId)
    if(response.ok){
      console.log('haru' ,response.data)
      setLinks(response.data)
    }else{
      alert("Something went wrong while fetching all Conference")
    }
  }

  useEffect(() => {
    getLinks()
  }, [])

  return (
   <CourseContent>
     <CourseBreadcrumbs title="Links"/>
      <HeaderLinks onSearch={onSearch} getConfe={getConfe} getVideos={getVideos} getLinks={getLinks}  />
      <div style={{paddingBottom:'10px'}}>
        <AccordionConference  searchTerm={searchTerm} getConfe={getConfe} conference={conference} setOpenEditModal={setOpenEditModal}  setEditLinks={setEditLinks} />
      </div>
      <div style={{paddingBottom:'10px'}}>
        <AccordionVideos searchTerm={searchTerm} getVideos={getVideos} videos={videos} setOpenEditModal={setOpenEditModal}  setEditLinks={setEditLinks}   />
      </div>
      <div style={{paddingBottom:'10px'}}>
        <AccordionLinks searchTerm={searchTerm} getLinks={getLinks} links={links} setOpenEditModal={setOpenEditModal}  setEditLinks={setEditLinks}  />
      </div>
      <AccordionEdit   getConfe={getConfe} getVideos={getVideos} getLinks={getLinks}  editLinks={editLinks} openEditModal={openEditModal} setOpenEditModal={setOpenEditModal} />
    </CourseContent>
  )
}
export default CourseLinks