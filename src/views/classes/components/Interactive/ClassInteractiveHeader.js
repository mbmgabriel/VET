import React from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap';

function ClassInteractiveHeader({onSearch,onRefresh}) {
  return (
		<div>
			<div className="row m-b-20" style={{paddingTop:'15px'}}>
				<div className="col-md-10 pages-header fd-row"><p className='title-header'>Interactive Exercises </p>
          <div className='mb-3'>
            <Button onClick={() => onRefresh()} className='ml-3'>
              <i className="fa fa-sync"></i>
            </Button>
          </div>
        </div>
			</div>
			<div className="row m-b-20">
				<div className="col-md-12">
					<InputGroup size="lg">
						<FormControl onChange={(e) => onSearch(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search interactive exercise here" type="search"/>
					<InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
					</InputGroup>
					</div>
				</div>
				
		</div>
  )
}

export default ClassInteractiveHeader
