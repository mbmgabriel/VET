import React, {useState, useContext} from 'react'
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import CreateLinks from './CreateLinks';
import { UserContext } from '../../../../context/UserContext'

function HeaderLinks({getConfe, getVideos, getLinks, onSearch}) {
const [modal, setModal] = useState(false)
const userContext = useContext(UserContext)
const {user} = userContext.data

const toggle = () =>{
    setModal(!modal)
  }
	return (
		<div>
			<div className="row m-b-20" style={{paddingTop:'15px'}}>
				<div className="col-md-10 pages-header"><p className='title-header' >Links </p>
			{(user?.teacher === null)?(
			<></>
			):(
			<>
				<p className='title-header' >	<Button className='btn-create-link' variant="link" onClick={() => setModal(true) }> <i className="fa fa-plus"></i>  Create Links  </Button></p>
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

