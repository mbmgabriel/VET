import React, {useState, useEffect} from 'react'
import ClassesAPI from '../../../../api/ClassesAPI'
import { useParams } from 'react-router'

export default function ClassLearnHeader({content}) {

  return (
    <div>
      <div className="row m-b-20" style={{marginBottom:'-20px'}}>
				<div className="col-md-10 pages-header"><p className='title-header'>
          {}
          {content?.pageName}</p>
				</div>
			</div>
      {/* <Row>
        <Col sm={1} style={{textAlign:'center', fontSize:'20px', paddingTop:'4px', color:'#7D7D7D'}}>
        <Form.Label>Unit 1</Form.Label>
        </Col>
        <Col>
        <Form.Select onChange={onModuleChange} aria-label="Default select example">
        <option value="">--SELECT UNIT--</option>
          {modules.map(item =>{
            return (<option value={item?.id} > {item?.moduleName}</option>)
          })}
        </Form.Select>
        </Col>
        <Col sm={1} style={{textAlign:'center', fontSize:'20px', paddingTop:'4px', color:'#7D7D7D'}}>
        <Form.Label>Pages</Form.Label>
        </Col>
        <Col>
        <Form.Select onChange={onShowPage} aria-label="Default select example">
        <option value=""></option>
          {Pages.map(item =>{
            return (<option value={item?.id}> {item?.pageName}</option>)
          })}
        </Form.Select>
        </Col>
      </Row> */}
      {content.content?(
        <div style={{position:'relative', paddingTop:'1px', }}>
          <div className="dangerously-learn-content" style={{position:"relative"}} dangerouslySetInnerHTML={{__html: content.content}} />
        </div>
      ):<span></span>
      }
      
    </div>
  )
}