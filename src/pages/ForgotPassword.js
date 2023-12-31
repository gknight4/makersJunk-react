import React from 'react';
import {Link} from 'react-router-dom'
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
      <div style={{padding:20}}>
      <h3>Forgot Password</h3>
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

      <tr style={msgStyle}><td colSpan="2">
      {st.msgText}
      </td></tr>

      <tr><td colSpan="2">
      <button type="button" onClick={e=>this.onChange("resetPassword",{})}>
      Send Email to Reset Password</button>
      </td></tr>
      <tr><td colSpan="2">
      <Link to="/createaccount.html">Create Account</Link>
      </td></tr>
      <tr><td colSpan="2">
      <Link to="/login.html">Login</Link>
      </td></tr>
      <tr><td colSpan="2">
      <Link to="/resetpassword.html">Reset Password</Link>
      </td></tr>
      </tbody></table>
      </div>
    )
  }
}

export default ForgotPassword;
