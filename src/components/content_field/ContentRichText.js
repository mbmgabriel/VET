import EquationEditor from "equation-editor-react";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import FroalaEditor from "react-froala-wysiwyg";
import config from "../../config/application";

const EQUATION = "equation";
const RICH_TEXT = "rich-text";
export const EQUATION_TAG = "{{type=equation}}"

const CONFIG = {
  // Key represents the more button from the toolbar.
  moreText: {
    // List of buttons used in the  group.
    buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting'],

    // Alignment of the group in the toolbar.
    align: 'left',

    // By default, 3 buttons are shown in the main toolbar. The rest of them are available when using the more button.
    buttonsVisible: 3
  },


  moreParagraph: {
    buttons: ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote'],
    align: 'left',
    buttonsVisible: 3
  },

  moreRich: {
    buttons: ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR'],
    align: 'left',
    buttonsVisible: 3
  },

  moreMisc: {
    buttons: ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
    align: 'right',
    buttonsVisible: 2
  }
}

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
    default:
      return <FroalaEditor 
      value={value}
      model={value}
      config={{
        key: config.FROALA_LICENSE,
        placeholderText: placeholder,
        charCounterCount: false,
        pluginsEnabled: [
          'fullscreen',
          'codeBeautifier',
        ],
        toolbarButtons: CONFIG,
        toolbarButtonsMD: CONFIG,
        toolbarButtonsSM: CONFIG,
        toolbarButtonsXS: CONFIG,
      }}
      onModelChange={onChange}/>;
  }
}

export default function ContentRichText(props) {

  const setDefaultType = () => {
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
      {/* <Form.Check
        inline
        label="Text Editor"
        type={"radio"}
        value=""
        checked={inputType === ""}
        onChange={e => updateInputType(e.target.value)}
      /> */}
      {/* <Form.Check
        inline
        label="Rich Text Editor"
        type={"radio"}
        value="rich-text"
        checked={inputType === RICH_TEXT || inputType === ""}
        onChange={e => updateInputType("")}
      />

      <Form.Check
        inline
        label="Equation Editor"
        type={"radio"}
        value="equation"
        checked={inputType === EQUATION}
        onChange={e => updateInputType(EQUATION)}
      /> */}
    </div>

      <Field {...props} inputType={inputType}/>
    </div>
  )
}
