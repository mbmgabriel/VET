import React, {useState, useEffect} from 'react'
import {  Col, Row, Card, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router';
import MainContainer from '../../../components/layouts/MainContainer'
import ClassAdminSideNavigation from './components/ClassAdminSideNavigation'
import ClassesAPI from '../../../api/ClassesAPI'
import AccordionConference from '../../classes/components/Links/AccordionConference'
import AccordionLinks from '../../classes/components/Links/AccordionLinks'
import AccordionVideos from '../../classes/components/Links/AccordionVideos'
import HeaderLinks from '../../classes/components/Links/HeaderLinks'
import AccordionEdit from '../../classes/components/Links/AccordionEdit';

export default function SchoolAdminLinks() {
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
  const [loading, setLoading] = useState(false)

  const onSearch = (text) => {
    setSearchTerm(text)
  }
  
  const getConfe = async() => {
    setLoading(true)
    let typeId = '1'
    let response = await new ClassesAPI().getLink(id, typeId)
    if(response.ok){
      setConference(response.data)
    }else{
      alert("Something went wrong while fetching all Conference")
    }
    setLoading(false)
  }

  useEffect(() => {
    getConfe()
  }, [])

  const getVideos = async() => {
    let typeId = '2'
    let response = await new ClassesAPI().getLink(id, typeId)
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
    let response = await new ClassesAPI().getLink(id, typeId)
    if(response.ok){
      setLinks(response.data)
    }else{
      alert("Something went wrong while fetching all Conference")
    }
  }

  useEffect(() => {
    getLinks()
  }, [])

  return (
    <MainContainer title="School" activeHeader={"classes"} style='not-scrollable' loading={loading}>
      <Row className="mt-4">
        <Col sm={3}>
          <ClassAdminSideNavigation active="links"/>
        </Col>
        <Col sm={9} className='scrollable vh-85'>
          <HeaderLinks onSearch={onSearch} getConfe={getConfe} getVideos={getVideos} getLinks={getLinks}  onRefresh={() => getConfe()}/>
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
        </Col>
      </Row>
    </MainContainer>
  )
}
