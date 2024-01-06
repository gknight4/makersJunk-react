import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import MenuBar from './MenuBar'
import {cl,constant,globs,wsTrans} from '../utils/utils'
// import bcrypt from 'bcrypt'

class Popup extends React.Component{
  constructor(props) {
    super(props);
//     cl(props)
    this.state={
    }
    this.loadInfo()
  }

  onChange=(type,vals)=>{
//     cl(type,vals)
    switch(type){
      case "Button":
        cl(vals)
        break
      case "email":
        break;
    }
  }

  loadInfo=async()=>{
  }


  render(){
    let st=this.state
    let pa=this.props.parms
    let buts=(
      <Form>
        <Form.Group className="mb-3">
          <Button variant="primary"
          onClick={e=>pa.onChange("Popup",{val:"OK"})}
          >OK</Button>&nbsp;

          <Button variant="primary"
          style={{display:"inline-block"}}
          onClick={e=>pa.onChange("Popup",{val:"Cancel"})}
          >Cancel</Button>
        </Form.Group>
      </Form>
    )
    return(
      <div style={{
        display:(pa.show)?"inline-block":"none",
        left:pa.center[0]-150,width:300,
        top:pa.center[1]-100,position:"absolute",
        backgroundColor:"white",borderRadius:20,border:"1px solid",
        boxShadow:"10px 10px 10px #8888",padding:20,margin:"auto"
      }}>
      <table width="100%"><tbody>
      <tr><td align="center" style={{padding:20}}>
      {pa.text}
      </td></tr>
      <tr><td align="center">
      <div>{buts}
      </div>
      </td></tr>
      </tbody></table>
      </div>
    )
  }
}

export default Popup;
