import React from 'react';
import ReCAPTCHA from "react-google-recaptcha";
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
      alertType:"",
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
      let reset={reset:parts2[1]}
      cl(reset)
      let resp=await wsTrans("users",{uri:"/o/createaccount",method:"update",body:reset})
      if(resp.result=="ok"){
        this.setState({
          msgColor:"#008800",
          msgText:"Thank you for Activating. Please Login",
        })
      }
      cl(resp)
    }
  }

  onChange=(type,vals)=>{
    switch(type){
      case "name":
      case "email":
      case "password":
        this.setState(vals)
        break;
      case "createAccount":
        this.createAccount()
        break;
    }
  }

  createAccount=async()=>{
    let st=this.state
    let user={
      name:st.name,
      email:st.email,
      password:st.password,
      recaptchaResponse:st.recaptchaResponse,

    }
    cl(user)
    let resp=await wsTrans("users",{uri:"/o/createaccount",method:"create",body:user})
    cl(resp)
    if(resp.result=="userExists"){
      this.setState({
        alertType:"warning",
        msgText:"That user already has an account",
      })
    }
    if(resp.result=="ok"){
      this.setState({
        alertType:"success",
        msgText:"I sent you an Activation email",
      })

    }

  }

  onReCaptcha=(e)=>{
    this.setState({recaptchaResponse: e})
  }

  render(){
    let st=this.state
    let msgStyle={display:(st.msgText)?"table-row":"none",color:st.msgColor}
    return(
      <div>
        <MenuBar/>
        <div style={{width:500, padding:20,backgroundColor:"white",
          margin:"auto",top:200,boxShadow:"10px 10px 10px #C88",
          borderRadius:10,position:"relative"
        }}>
        <h3>Create Account</h3>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                id="name"
                type="text"
                value={st.name}
                onChange={e=>this.onChange("name",{name:e.currentTarget.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                id="email"
                type="email"
                value={st.email}
                onChange={e=>this.onChange("email",{email:e.currentTarget.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password:</Form.Label>
              <Form.Control
              id="password"
              type="text"
              />
            </Form.Group>
            <Alert variant={st.alertType}
              show={st.msgText.length>0}>
              {st.msgText}
            </Alert>
            <div className="recaptcha-wrapper">
              <div className="recaptcha-container">
                <ReCAPTCHA
                sitekey="6Ld3ekIpAAAAAOodF4fA8A-Kc3hshlEGap6ExH2B"
                onChange={this.onReCaptcha}
                />
              </div>
            </div>
            <Form.Group className="mb-3">
              <Button variant="primary"
              onClick={e=>this.onChange("createAccount",{})}
              >Create Account</Button>{' '}
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
