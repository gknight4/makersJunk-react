import React from 'react';
import {Link} from 'react-router-dom'
import {cl,constant,openWebSocket,getTime,getTimeMs,checkCRC,
  msecsToDisplayDate,initUsersWs,sendUsersWs,wsTrans} from '../utils/utils'

class CreateAccount extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      name:"Gene Knight",
      email:"GeneKnight4@GMail.com",
      password:"fremont",
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
    cl("loadInfo")
    cl("o9pen")
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
    }
    let resp=await wsTrans("users",{uri:"/o/createaccount",method:"create",body:user})
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
      <div style={{padding:20}}>
      <h3>Create Account</h3>
      <table><tbody>

      <tr><td>
        <label htmlFor="name">Name:</label>
      </td><td>
        <input id="name" type="text" value={st.name} onChange={e=>this.onChange(
          "name",{name:e.currentTarget.value})}/>
      </td></tr>

      <tr><td>
        <label htmlFor="email">Email:</label>
      </td><td>
        <input id="email" type="text" value={st.email} onChange={e=>this.onChange(
          "email",{email:e.currentTarget.value})}/>
      </td></tr>

      <tr><td>
        <label htmlFor="password">Password:</label>
      </td><td>
        <input id="password" type="text" value={st.password} onChange={e=>this.onChange(
          "password",{password:e.currentTarget.value})}/>
      </td></tr>

      <tr style={msgStyle}><td colSpan="2">
      {st.msgText}
      </td></tr>

      <tr><td colSpan="2">
      <button type="button" onClick={e=>this.onChange("createAccount",{})}>
      Create Account</button>
      </td></tr>
      <tr><td colSpan="2">
      <Link to="/login.html">Login</Link>
      </td></tr>
      <tr><td colSpan="2">
      <Link to="/forgotpassword.html">Forgot Password</Link>
      </td></tr>
      </tbody></table>
      </div>
    )
  }
}

export default CreateAccount;
