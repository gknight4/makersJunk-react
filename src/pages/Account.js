import React from 'react';
import {Link} from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Alert from 'react-bootstrap/Alert';
import MenuBar from './MenuBar'
import {cl,globs,constant,openWebSocket,getTime,getTimeMs,checkCRC,
  msecsToDisplayDate,initUsersWs,sendUsersWs,wsTrans} from '../utils/utils'

class Account extends React.Component{
  constructor(props) {
    super(props);
    cl(globs)
    let user=globs.login
    this.state={
      name:user?.name||"",
      email:user?.email||"",
      password:"",
      msgColor:"",
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
      case "update":
        this.updateAccount()
        break;
    }
  }

  updateAccount=async()=>{
    let st=this.state
    let user={
      name:st.name,
      email:st.email,
      password:st.password,
      userId:globs.login.userId,
      info:true,
    }
    let resp=await wsTrans("users",{uri:"/o/createaccount",method:"update",body:user})
    cl(resp)
    if(resp.result=="userExists"){
      this.setState({
        msgColor:"#880000",
        msgText:"That user already has an account",
      })
    }

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
        <h3>Update Account</h3>
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
            <Alert variant={"primary"}
              show={st.msgText.length>0}>
              {st.msgText}
            </Alert>
            <Form.Group className="mb-3">
              <Button variant="primary"
              onClick={e=>this.onChange("update",{})}
              >Update</Button>{' '}
            </Form.Group>
          </Form>
        </div>
      </div>
    )
  }
}

export default Account;
