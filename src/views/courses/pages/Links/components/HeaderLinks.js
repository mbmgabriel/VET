import React, {useState, useContext, useEffect} from 'react'
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import CreateLinks from './CreateLinks';
import { UserContext } from '../../../../../context/UserContext'
import {useParams} from 'react-router';
import CoursesAPI from '../../../../../api/CoursesAPI';

function HeaderLinks({getConfe, getVideos, getLinks, onSearch}) {
const [modal, setModal] = useState(false)
const userContext = useContext(UserContext)
const [courseInfo, setCourseInfo] = useState("");
const {user} = userContext.data
const {id} = useParams();
const [isContributor, setIsContributor] = useState(false)

const toggle = () =>{
    setModal(!modal)
  }

  useEffect( async() => {
    let response = await new CoursesAPI().getContributor(id)
    if(response.ok){
      let temp = response.data;
      let ifContri = temp.find(i => i.userInformation?.userId == user.userId);
      console.log(ifContri, user.userId)
      setIsContributor(ifContri ? true : false);
    }
  },[])

  useEffect(() => {
    getCourseInformation();
  }, [])

  const getCourseInformation = async() => {
    let response = await new CoursesAPI().getCourseInformation(id)
    if(response.ok){
      setCourseInfo(response.data)
    }else{
      alert("Something went wrong while fetching course information")
    }
  }

	return (
		<div>
			<div className="row m-b-20" style={{paddingTop:'15px'}}>
				<div className="col-md-10 pages-header"><p className='title-header' >Links </p>
			{(user?.teacher === null)?(
			<></>
			):(
			<>
				<p className='title-header'>
          {isContributor && <Button className='btn-create-link' variant="link" onClick={() => setModal(true) }> <i className="fa fa-plus"></i>  Create Links  </Button>}
        </p>
			</>
			)}
				</div>
			</div>
			<div className="row m-b-20">
				<div className="col-md-12">
					<InputGroup size="lg">
						<FormControl onChange={(e) => onSearch(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search Links here" type="search"/>
						<InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
					</InputGroup>
				</div>
			</div>
			<CreateLinks getConfe={getConfe} getVideos={getVideos} getLinks={getLinks} toggle={toggle} modal={modal} />
		</div>
	)
}
export default HeaderLinks

