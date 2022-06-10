import EquationEditor from "equation-editor-react";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import FroalaEditor from "react-froala-wysiwyg";
import config from "../../config/application";

const EQUATION = "equation";
const RICH_TEXT = "rich-text";
export const EQUATION_TAG = "{{type=equation}}"

const Field = (props) => {
  const {inputType, value, placeholder, onChange} = props
  switch (inputType) {
    case EQUATION:
      return (
        <EquationEditor
          className='custom-input'
          size='lg'
          value={value.split(EQUATION_TAG)[1] || ""}
          placeholder={placeholder}
          autoCommands="pi theta sqrt sum prod alpha beta gamma rho"
          autoOperatorNames="sin cos tan"
          onChange={(text) => onChange(`${EQUATION_TAG}${text}`)}
        />
      );
    case RICH_TEXT:
      return <FroalaEditor 
      value={value}
      model={value}
      config={{
        key: config.FROALA_LICENSE,
        placeholderText: placeholder,
        charCounterCount: false
      }}
      onModelChange={onChange}/>;
    default:
      return (
        <Form.Control
          value={value}
          type='text'
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

export default function ContentField(props) {

  const setDefaultType = () => {
    if(props.value.substring(0, 2) === '<p')
      return RICH_TEXT  
    if(props.value.includes(EQUATION_TAG))
      return EQUATION
    return ""
  }

  const [inputType, setInputType] = useState(setDefaultType());
  
  
  const updateInputType = (type) => {
    switch (type) {
      case EQUATION:
        console.log({type})
        props.onChange(EQUATION_TAG);
        break;
      case RICH_TEXT:
        props.onChange("")
        break;
      default:
        props.onChange("")
        break;
    }
    
    setInputType(type)
  }

  return (
    <div className={props.className}>

    <div key={`inline-radio`} className="mb-3" >
      <Form.Check
        inline
        label="Text Editor"
        type={"radio"}
        value=""
        checked={inputType === ""}
        onChange={e => updateInputType(e.target.value)}
      />
      <Form.Check
        inline
        label="Equation Editor"
        type={"radio"}
        value="equation"
        checked={inputType === EQUATION}
        onChange={e => updateInputType(EQUATION)}
      />
      <Form.Check
        inline
        label="Rich Text Editor"
        type={"radio"}
        value="rich-text"
        checked={inputType === RICH_TEXT}
        onChange={e => updateInputType(RICH_TEXT)}
      />
    </div>

      <Field {...props} inputType={inputType}/>
    </div>
  )
}
