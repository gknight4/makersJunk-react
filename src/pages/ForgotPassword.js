import React from 'react';
import {Link} from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Alert from 'react-bootstrap/Alert';
import MenuBar from './MenuBar'
import {cl,constant,openWebSocket,getTime,getTimeMs,checkCRC,
  msecsToDisplayDate,initUsersWs,wsTrans} from '../utils/utils'

class ForgotPassword extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      email:"GeneKnight4@GMail.com",
      msgColor:"",
      msgText:"",
    }
    this.loadInfo()
  }

  loadInfo=async()=>{
    let res=await initUsersWs()
  }

  onChange=(type,vals)=>{
    switch(type){
      case "resetPassword":
        this.resetPassword()
      case "email":
        this.setState(vals)
        break;
    }
  }

  resetPassword=async()=>{
    cl("do reset")
    let st=this.state
    this.setState({
      msgColor:"#008800",
      msgText:"Reset Email Sent",
    })
    let email={email:st.email}
    let resp=await wsTrans("users",{uri:"/o/createaccount",method:"update",body:email})
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
        <h3>Forgot Password</h3>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                id="email"
                type="email"
                placeholder="me@here.com"
                value={st.email}
                onChange={e=>this.onChange("email",{email:e.currentTarget.value})}
              />
            </Form.Group>
            <Alert variant={"primary"}
              show={st.msgText.length>0}>
              {st.msgText}
            </Alert>
            <Form.Group className="mb-3">
              <Button variant="primary"
              onClick={e=>this.onChange("resetPassword",{})}
              >Send Email to Reset Password</Button>{' '}
            </Form.Group>
            <Form.Group className="mb-3">
              <Nav.Link as={Link} to="/createaccount.html">Create Account</Nav.Link>
              <Nav.Link as={Link} to="/login.html">Login</Nav.Link>
              <Nav.Link as={Link} to="/resetpassword.html">Reset Password</Nav.Link>
            </Form.Group>
          </Form>
        </div>
      </div>
    )
  }
}

export default ForgotPassword;
