import React from 'react';
import {Link} from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Alert from 'react-bootstrap/Alert';
import MenuBar from './MenuBar'
import {cl,constant,globs,openWebSocket,getTime,getTimeMs,checkCRC,
  msecsToDisplayDate,initUsersWs,wsTrans} from '../utils/utils'
// import bcrypt from 'bcrypt'

class Login extends React.Component{
  constructor(props) {
    super(props);
//     cl(props)
//     cl(window.location.href)
    this.state={
      email:"",
      password:"",
      rememberMe:true,
      msgColor:"",
      alertType:"danger",
      msgText:"",
      loginResp:"",
    }
    this.loadInfo()
  }

  onChange=(type,vals)=>{
//     cl(type,vals)
    switch(type){
      case "email":
      case "password":
      case "rememberMe":
        this.setState(vals)
        break;
      case "login":
        this.login()
        break;
      case "sendActivate":
        this.sendActivate()
        break;
    }
  }

  loadInfo=async()=>{
    await initUsersWs()
    let url=window.location.href
    cl(url)
    let parts=url.split("?")
    if(parts.length>1){
      cl("got query")
      let parts2=parts[1].split("=")
      let activate={activate:parts2[1]}
      let resp=await wsTrans("users",{uri:"/o/login",method:"update",body:activate})
      if(resp.result=="ok"){
        this.setState({
          alertType:"primary",
          msgText:"Thank you for Activating. Please Login",
        })
      }
    }
  }

  sendActivate=async()=>{
    let st=this.state
    cl("send activate")
    let user={
      email:st.email,
      activate:true,
    }
    let resp=await wsTrans("users",{uri:"/o/createaccount",method:"create",body:user})

  }

  login=async()=>{
    let st=this.state
    let user={
      email:st.email,
      password:st.password,
      rememberMe:st.rememberMe,
    }
    let resp=await wsTrans("users",{uri:"/o/login",method:"create",body:user})
//     cl(resp)
    let resps={
      notActivated:{
        alertType:"warning",
        msgText:"That user is not activated",
        loginResp:resp.result,
      },
      notFound:{
        alertType:"danger",
        msgText:"I can't find that User / PW combo",
        loginResp:resp.result,
      },
      ok:{
        alertType:"primary",
        msgText:"",
        loginResp:resp.result,
      },
    }
    if(resp.result=="ok"){
      let login={
        name:resp.name,
        userId:resp.userId,
        email:st.email,
        password:st.password,
        rememberMe:st.rememberMe,
        sessionId:resp.sessionId,
      }
      let func=(st.rememberMe)?localStorage:sessionStorage
      func.setItem("login",JSON.stringify(login))
      globs.login=login
      globs.events.publish("login",login)
//       globs.sessionId=resp.sessionId
//       globs.loggedIn=true
    }
    this.setState(resps[resp.result])
//     if(resp.result=="notFound"){
//       this.setState({
//         alertType:"danger",
//         msgText:"I can't find that User / PW combo",
//       })
//     }
//     if(resp.result=="notFound"){
//       this.setState({
//       })
//
//     }else{
//       this.setState({msgText:""})
//     }
//     cl(resp)
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
          <h3>Login</h3>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                id="email"
                type="email"
//                 placeholder="me@here.com"
                value={st.email}
                onChange={e=>this.onChange("email",{email:e.currentTarget.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password:</Form.Label>
              <Form.Control
              id="password"
              type="password"
//               placeholder="me@here.com"
              value={st.password}
              onChange={e=>this.onChange("password",{password:e.currentTarget.value})}
              />
            </Form.Group>
            <Alert variant={st.alertType}
              show={st.msgText.length>0}>
              {st.msgText}
            </Alert>
            <Form.Group className="mb-3">
              <Button variant="primary"
              onClick={e=>this.onChange("login",{})}
              >Login</Button>{' '}
              <Button variant="primary"
              style={{display:(st.loginResp=="notActivated")?"inline-block":"none"}}
              show="false"
              onClick={e=>this.onChange("sendActivate",{})}
              >Re-Send Activation Email</Button>{' '}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                label="Remember Me"
                checked={st.rememberMe}
                onChange={e=>this.onChange("rememberMe",{rememberMe:e.currentTarget.checked})}
            />
            </Form.Group>
            <Form.Group className="mb-3">
              <Nav.Link as={Link} to="/createaccount.html">Create Account</Nav.Link>
              <Nav.Link as={Link} to="/forgotpassword.html">Forgot Password</Nav.Link>
            </Form.Group>
          </Form>
        </div>
      </div>
    )
  }
}

export default Login;
