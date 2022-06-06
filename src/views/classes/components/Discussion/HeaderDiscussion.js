import React, {useState, useContext} from 'react'
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import CreateDiscussion from './CreateDiscussion';
import { UserContext } from '../../../../context/UserContext'

function HeaderDiscussion({module, getDiscussionUnit, onSearch}) {
const [modal, setModal] = useState(false)
const userContext = useContext(UserContext)
const {user} = userContext.data

const toggle = () =>{
    setModal(!modal)
  }
	return (
		<div>
			<div className="row m-b-20" style={{paddingTop:'15px'}}>
				<div className="col-md-10 pages-header"><p className='title-header'>Discussion </p>
          {
            user.isTeacher &&
              <p><Button style={{paddingTop:'17px'}} className='btn-create-discussion' variant="link" onClick={() => setModal(true) }> <i className="fa fa-plus"></i>  Create Discussion  </Button></p>
          }
				</div>
			</div>
			<div className="row m-b-20">
				<div className="col-md-12">
					<InputGroup size="lg">
						<FormControl onChange={(e) => onSearch(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search discussion here" type="search"/>
						<InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
					</InputGroup>
				</div>
			</div>
				<CreateDiscussion setModal={setModal} getDiscussionUnit={getDiscussionUnit} module={module} toggle={toggle} modal={modal} />
		</div>
	)
}
export default HeaderDiscussion

