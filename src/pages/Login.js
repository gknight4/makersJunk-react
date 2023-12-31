import React from 'react';
import {Link} from 'react-router-dom'
import {cl,constant,openWebSocket,getTime,getTimeMs,checkCRC,
  msecsToDisplayDate,initUsersWs,wsTrans} from '../utils/utils'
// import bcrypt from 'bcrypt'

class Login extends React.Component{
  constructor(props) {
    super(props);
//     cl(props)
//     cl(window.location.href)
    this.state={
      email:"GeneKnight4@GMail.com",
      password:"fremont",
      msgColor:"",
      msgText:"",
    }
    this.loadInfo()
  }

  onChange=(type,vals)=>{
    switch(type){
      case "email":
      case "password":
        this.setState(vals)
        break;
      case "login":
        this.login()
        break;
    }
  }

  loadInfo=async()=>{
    await initUsersWs()
    let url=window.location.href
    let parts=url.split("?")
    if(parts.length>1){
      cl("got query")
      let parts2=parts[1].split("=")
      let activate={activate:parts2[1]}
      cl(activate)
      let resp=await wsTrans("users",{uri:"/o/login",method:"update",body:activate})
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

  login=async()=>{
    let st=this.state
    let user={
      email:st.email,
      password:st.password,
    }
    let resp=await wsTrans("users",{uri:"/o/login",method:"create",body:user})
    if(resp.result=="notFound"){
      this.setState({
        msgColor:"#880000",
        msgText:"I can't find that User / PW combo",
      })

    }else{
      this.setState({msgText:""})
    }
    cl(resp)
  }

  render(){
    let st=this.state
    let msgStyle={display:(st.msgText)?"table-row":"none",color:st.msgColor}
    return(
      <div style={{padding:20}}>
      <h3>Login</h3>
      <table><tbody>
      <tr>
      <td>
        <label htmlFor="emailInput">Email:</label>
      </td>
      <td>
        <input id="emailInput" type="text" value={st.email} onChange={e=>this.onChange(
          "email",{email:e.currentTarget.value})}/>
      </td>
      </tr>
      <tr>
      <td>
        <label htmlFor="passwordInput">Password:</label>
      </td>
      <td>
        <input id="passwordInput" type="password" encrypt="sha1" value={st.password} onChange={e=>this.onChange(
          "password",{password:e.currentTarget.value})}/>
      </td></tr>

      <tr style={msgStyle}><td colSpan="2">
      {st.msgText}
      </td></tr>

      <tr><td colSpan="2">
      <button type="button" onClick={e=>this.onChange("login",{})}>
      Login</button>
      </td></tr>
      <tr><td colSpan="2">
      <Link to="/createaccount.html">Create Account</Link>
      </td></tr>
      <tr><td colSpan="2">
      <Link to="/forgotpassword.html">Forgot Password</Link>
      </td></tr>
      </tbody></table>
      </div>
    )
  }
}

export default Login;
