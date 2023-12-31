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
      <div style={{padding:20}}>
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

      <tr><td>
        <label htmlFor="password">Password:</label>
      </td><td>
        <input id="password" type="text" value={st.password} onChange={e=>this.onChange(
          "password",{password:e.currentTarget.value})}/>
      </td></tr>

      <tr style={{display:(st.showMsg)?"block":"none"}}><td colSpan="2">

      </td></tr>
      <tr><td colSpan="2">
      <button type="button" onClick={e=>this.onChange("resetPassword",{})}>
      Reset Password</button>
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
