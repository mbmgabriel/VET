import React, { useState } from "react";
import {Col} from 'react-bootstrap'
import FilesContent from '../FilesContent';
import FileHeader from '../FileHeader'
export default function Files(props) {
  const [show, setShow] = useState(false)

  return (
    <>
      <div  style={{color:'#EE9337', fontSize:'25px'}}>
        <div className='inline-flex'>
          <div style={{paddingLeft:'20px'}}>
            <i class="fas fa-folder"></i> 
          </div>
          <div style={{paddingLeft:'15px'}}>
          <p className="mb-0"  onClick={()=> props.clicked()}>{props.name} </p>
          </div>
        </div>
      </div>
      {/* {
        props.show && <div className="row m-b-20 file-content m-4">
          <FileHeader type={props.type} id={props.id} doneUpload={()=> props.refetch()}/>
          <FilesContent data={props.data} type={props.type} id={props.id} deleted={()=> props.refetch() }/>
        </div>
      } */}

    </>

  )
}
