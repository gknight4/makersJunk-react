import React from 'react';
import {Link} from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Alert from 'react-bootstrap/Alert';
import MenuBar from './MenuBar'
import {cl,constant,openWebSocket,getTime,getTimeMs,checkCRC,
  msecsToDisplayDate,initUsersWs,sendUsersWs,wsTrans} from '../utils/utils'

class CreateAccount extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      name:"Gene Knight",
      email:"GeneKnight4@GMail.com",
      password:"fremont",
      msgText:"",
    }
    this.loadInfo()
  }

  loadInfo=async()=>{
    let res=await initUsersWs()
    let url=window.location.href
    let parts=url.split("?")
    if(parts.length>1){
      cl("got query")
      let parts2=parts[1].split("=")
      this.setState({reset:parts2[1]})
//       cl(reset)
//       let resp=await wsTrans("users",{uri:"/o/createaccount",method:"update",body:reset})
//       if(resp.result=="ok"){
//         this.setState({
//           msgColor:"#008800",
//           msgText:"Thank you for Activating. Please Login",
//         })
//       }
//       cl(resp)
    }
//     cl("loadInfo")
//     cl("o9pen")
  }

  onChange=(type,vals)=>{
    switch(type){
      case "password":
        this.setState(vals)
        break;
      case "resetPassword":
        this.resetPassword()
        break;
    }
  }

  resetPassword=async()=>{
    let st=this.state
    let reset={
      reset:st.reset,
      password:st.password,
    }
//     cl(reset)
//     let user={
//       name:st.name,
//       email:st.email,
//       password:st.password,
//     }
//     let resp=await wsTrans("users",{uri:"/o/createaccount",method:"update",body:user})
    let resp=await wsTrans("users",{uri:"/o/createaccount",method:"update",body:reset})
//     cl(resp)

  }

  render(){
    let st=this.state
    return(
      <div>
        <MenuBar/>
        <div style={{width:500, padding:20,backgroundColor:"white",
          margin:"auto",top:200,boxShadow:"10px 10px 10px #C88",
          borderRadius:10,position:"relative"
        }}>
        <h3>Reset Password</h3>
        <table><tbody>

        <tr><td>
          <label htmlFor="name">Name:</label>
        </td><td>{st.name}
        </td></tr>

        <tr><td>
          <label htmlFor="email">Email:</label>
        </td><td>{st.email}
        </td></tr>
        </tbody></table>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>New Password:</Form.Label>
              <Form.Control
              id="password"
              type="password"
              placeholder="me@here.com"/>
            </Form.Group>
            <Alert variant={"primary"}
              show={st.msgText.length>0}>
              {st.msgText}
            </Alert>
            <Form.Group className="mb-3">
              <Button variant="primary"
              onClick={e=>this.onChange("resetPassword",{})}
              >Reset Password</Button>{' '}
            </Form.Group>
            <Form.Group className="mb-3">
            </Form.Group>
            <Form.Group className="mb-3">
              <Nav.Link as={Link} to="/login.html">Login</Nav.Link>
              <Nav.Link as={Link} to="/forgotpassword.html">Forgot Password</Nav.Link>
            </Form.Group>
          </Form>
        </div>
      </div>
    )
  }
}

export default CreateAccount;
