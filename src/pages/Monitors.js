import React from 'react';
import Form from 'react-bootstrap/Form'
import MenuBar from './MenuBar'
import Popup from './Popup'
import {cl,constant,globs,wsTrans,getRandomString} from '../utils/utils'

class Monitors extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      scrWidth:window.innerWidth,
      scrHeight:window.innerHeight,
      monitors:[],
      popupShow:false,
      popupText:"",
      popupButtons:"",
      typeName:"",
    }
    this.loadInfo()
    this.updateTimer=null
  }


newMonitor=()=>{
    let st=this.state
    let monitorId=getRandomString(16)
    let name="New Monitor"
    let newDev={name:name,mod:true,monitorId:monitorId,id:""}
    cl(newDev)
    let devs=st.monitors.slice(0)
    devs.unshift(newDev)
    this.setState({monitors:devs,monitorSel:monitorId,editShow:true,
      typeName:name,id:""
    })
  }

  monitorDelete=(type,vals)=>{
//     cl(type,vals)
    let st=this.state
    let newState={popupShow:false}
    if(vals.val=="OK"){
//       cl(st.monitorSel)
      let devs=st.monitors.slice(0)
      let dev=devs.filter(d=>{return d.monitorId==st.monitorSel})
      dev[0].del=true
      vals.monitors=devs
      newState.monitors=devs
      newState.typeName=""
      newState.id=""
//       cl(newState)

    }
    this.setState(newState)
  }

  updateMonitors=async()=>{
    let st=this.state
    let devs=st.monitors.slice(0)
    let dels=[]
    let mods=[]
    devs.forEach(d=>{
      cl(d)
      if(d.del){
        delete d.del
        delete d.mod
        dels.push(d)
      }else{
        if(d.mod){
          delete d.mod
          mods.push(d)
        }
      }
    })
    var resp
    if(dels.length){
      resp=await wsTrans("users",{uri:"/s/monitors",method:"delete",
        sessionId:globs.login.sessionId,body:dels})
    }
    if(mods.length){
      resp=await wsTrans("users",{uri:"/s/monitors",method:"update",
        sessionId:globs.login.sessionId,body:mods})
    }
  }

  updateInfo=()=>{
    cl("update info")
    this.updateTimer=null
    this.updateMonitors()
  }

  setUpdateTimer=()=>{
    if(this.updateTimer){clearTimeout(this.updateTimer)}
    this.updateTimer=setTimeout(this.updateInfo,5000)
  }

  onChange=(type,vals)=>{
    cl(type,vals)
    this.setUpdateTimer()
    let st=this.state
    var dev,reg,regs,devs
    switch(type){
      case "newMonitor":
        cl("newMonitor")
        this.newMonitor()
        break;
      case "monitorSel":
        vals.editShow=true
        dev=st.monitors.filter(d=>{return d.monitorId==vals.monitorSel})
        if(dev[0]){
          vals.typeName=dev[0].name
          vals.id=dev[0].id
        }
        this.setState(vals)
        break;
      case "monitorDel":
//         cl("monitorDel")
        this.setState({monitorSel:vals.monitorSel,popupShow:true,
          popupText:"This will delete the selected Monitor Type",
          popupButtons:"OKCancel",
          popupFunc:this.monitorDelete,
        })
        vals.e.stopPropagation()
        break
      case "typeName":
        devs=st.monitors.slice(0)
        dev=devs.filter(d=>{return d.monitorId==st.monitorSel})
        dev[0].name=vals.typeName
        dev[0].mod=true
        vals.monitors=devs
        this.setState(vals)
        break
      case "id":
        devs=st.monitors.slice(0)
        dev=devs.filter(d=>{return d.monitorId==st.monitorSel})
        dev[0].id=vals.id
        dev[0].mod=true
        vals.monitors=devs
        this.setState(vals)
        break
    }
  }

  loadInfo=async()=>{
    cl(globs.login.sessionId)
    let resp=await wsTrans("users",{uri:"/s/monitors",method:"retrieve",
      sessionId:globs.login.sessionId,body:{}})
    cl(resp)
    this.setState({monitors:resp.monitors})

  }

  showMonitorSel=()=>{
    let st=this.state
    if(!st.editShow){return}
    let pa=this.props.parms
    let wid=0.9*st.scrWidth
    let wid2=0.9*wid
    return(
      <div>
        <Form style={{width:500}}>
          <Form.Group className="mb-3">
            <Form.Label>Monitor ID:</Form.Label>
            <Form.Control
              id="id"
              type="text"
              value={st.id}
              onChange={e=>this.onChange("id",{id:e.currentTarget.value})}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Monitor Name:</Form.Label>
            <Form.Control
              id="typeName"
              type="text"
              value={st.typeName}
              onChange={e=>this.onChange("typeName",{typeName:e.currentTarget.value})}
            />
          </Form.Group>
        </Form>
      </div>

    )
  }

  showMonitors=()=>{
    let st=this.state
    let pa=this.props.parms
    let wid=0.9*st.scrWidth
    let wid2=0.9*wid
    let rows=(st.monitors||[])
      .filter(d=>{return !d.del})
      .map((d,i)=>{
//       cl(d,st.monitorSel)
      let bgColor=(d.monitorId==st.monitorSel)?"#AAFFFF":"white"
      if(!d.del){

      }
      return(
        <tr key={i} style={{cursor:"pointer",backgroundColor:bgColor}}
          onClick={e=>this.onChange("monitorSel",{monitorSel:d.monitorId})}
        >
          <td style={{fontSize:22,fontWeight:700,color:"#CC0000",cursor:"pointer"}}
          onClick={e=>{this.onChange("monitorDel",{monitorSel:d.monitorId,e:e})}}
          >&nbsp;x&nbsp;</td>
        <td>{d.name}</td></tr>
      )
    })
    return(
    <>
        <h3>Monitors</h3>
          <div style={{width:wid2,height:200,borderRadius:10,border:"1px solid",
            position:"relative",top:20,padding:20,overflowY:"auto"
          }}>
          <table><tbody>
          <tr>
          <td></td><th width="200">Monitor Name</th>
          <td>
            <span style={{fontSize:36,fontWeight:700,color:"#00CCCC",cursor:"pointer"}}
            onClick={e=>this.onChange("newMonitor")}
            >+</span></td></tr>
            {rows}
          </tbody></table>
          </div><br/>
    </>
    )
  }

  render(){
    let st=this.state
    cl(st)
    let wid=0.9*st.scrWidth
    return(
      <div>
        <MenuBar/>
        <div style={{width:wid,borderRadius:10,backgroundColor:"white",
          margin:"auto",padding:20,top:50,position:"relative"
        }}>
          {this.showMonitors()}
          {this.showMonitorSel()}
        </div>
          <Popup parms={{
            center:[st.scrWidth/2,st.scrHeight/2],
            onChange:st.popupFunc,//this.monitorDelete,
            show:st.popupShow,
            text:st.popupText,
            buts:st.popupButtons,
          }}/>
      </div>
    )
  }
}

export default Monitors;

