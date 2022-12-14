import React, { useState, useEffect, useContext} from 'react'
import ClassesAPI from '../../api/ClassesAPI'
import { useParams } from 'react-router'
import AccordionConference from './components/Links/AccordionConference'
import AccordionLinks from './components/Links/AccordionLinks'
import AccordionVideos from './components/Links/AccordionVideos'
import HeaderLinks from './components/Links/HeaderLinks'
import AccordionEdit from './components/Links/AccordionEdit';
import ClassSideNavigation from './components/ClassSideNavigation';
import ClassBreadcrumbs from './components/ClassBreedCrumbs';
import FullScreenLoader from '../../components/loaders/FullScreenLoader'
import { UserContext } from '../../context/UserContext'

function ClassLinks() {
  const [openEditModal, setOpenEditModal] = useState(false)
  const [conference, setConference] = useState([])
  const [videos, setVidoes] = useState([])
  const [links, setLinks] = useState([])
  const [editLinks, setEditLinks] = useState('')
  const {id} = useParams();
  const [searchTerm, setSearchTerm] = useState('')
  const [confeDescriptionItem, setConfeDescriptoinItem] = useState('')
  const [confeUrlItem, setConfeUrlItem] = useState('')
  const [itemId, setItemId] = useState()
  const [loading, setLoading] = useState(false);
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const subsType = user.subsType;
  
  const onSearch = (text) => {
    setSearchTerm(text)
  }
  
  const getConfe = async() => {
    let typeId = '1'
    let response = await new ClassesAPI().getLink(id, typeId)
    if(response.ok){
      setConference(response.data)
    }else{
      alert("Something went wrong while fetching all Conference")
    }
  }
  
  useEffect(() => {
    getConfe()
    // if(subsType != 'LMS'){
    //   window.location.href = "/classes"
    // }
    getVideos()
    getLinks()
  }, [])

  const getVideos = async() => {
    setLoading(true)
    let typeId = '2'
    let response = await new ClassesAPI().getLink(id, typeId)
    if(response.ok){
      setLoading(false)
      setVidoes(response.data)
    }else{
      alert("Something went wrong while fetching all Conference")
    }
  }
  const getLinks = async() => {
    let typeId = '3'
    let response = await new ClassesAPI().getLink(id, typeId)
    if(response.ok){
      setLinks(response.data)
    }else{
      alert("Something went wrong while fetching all Conference")
    }
  }

  return (
   <ClassSideNavigation>
    {loading && <FullScreenLoader />}
     <ClassBreadcrumbs title='' clicked={()=> console.log('')} />
      <HeaderLinks onSearch={onSearch} getConfe={getConfe} getVideos={getVideos} getLinks={getLinks}  onRefresh={() => getVideos()}/>
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
    </ClassSideNavigation>
  )
}
export default ClassLinks