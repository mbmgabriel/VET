import React, { useState } from "react";
import { Form, Col } from "react-bootstrap";
export default function ContentField(props) {
  const [inputType, setInputType] = useState(props.value == '' ? true : false);
  
  return (
    <div className={props.className}>
      <div key={`inline-radio`} className="mb-3" >
        <Form.Check
          inline
          label="HTML Editor"
          type="checkbox"
          // value=""
          checked={inputType}
          onClick={e => setInputType(!inputType)}
        />
      </div>
     {inputType ? <div class="form-group">
        <textarea class="form-control" placeholder="Enter content here" value={props.value} id="exampleFormControlTextarea1" rows="15" onChange={(e)=>props.onChange(e.target.value)}></textarea>
      </div> 
      :
      <Col style={{width: 'auto', height: '500px'}} className='overflow-auto'>
        <>
          <div className="dangerously-learn-content" style={{position: 'relative'}} dangerouslySetInnerHTML={{__html: props?.value}} />
        </>
      </Col>
      }
    </div>
  )
}
