import React from 'react';
import MenuBar from './MenuBar'
import Form from 'react-bootstrap/Form'
import Popup from './Popup'
import {cl,constant,globs,wsTrans,getRandomString} from '../utils/utils'
// import bcrypt from 'bcrypt'

class Busses extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      scrWidth:window.innerWidth,
      scrHeight:window.innerHeight,
      busses:[],
      instDevs:[],
      popupShow:false,
      popupText:"",
      popupButtons:"",
      devicesShow:false,
      deviceName:"",
      busName:"",
      busSel:"",
      instDevName:"",
      instDevAddr:"",
      instDevType:"",
    }
    this.loadInfo()
    this.updateTimer=null
    this.subscribe_visCh=globs.events.subscribe("visibilityChange",this.visCh)
  }

  componentWillUnmount=()=>{
    this.subscribe_visCh.remove()
  }

  visCh=(state)=>{
    cl(state)
    if(state=="hidden"){
      this.updateInfo()
    }
  }

  newBuss=()=>{
    let st=this.state
    let busId=getRandomString(16)
    let busName="New Bus"
    let newDev={name:busName,mod:true,busId:busId}
    let buss=st.busses.slice(0)
    buss.unshift(newDev)
    this.setState({busses:buss,busSel:busId,devicesShow:true,busName:busName})
  }

  newDevice=()=>{
    let st=this.state
    let instDevId=getRandomString(16)
    let instDevName="New Device"
    let newDev={name:instDevName,mod:true,instDevId:instDevId,busId:st.busSel,
      instDevName:instDevName
    }
    let instDevs=st.instDevs.slice(0)
    instDevs.unshift(newDev)
    cl(instDevs)
    this.setState({instDevs:instDevs,deviceSel:instDevId,deviceSelShow:true,
      instDevName:instDevName
    })
  }

  busDelete=(type,vals)=>{
//     cl(type,vals)
    let st=this.state
    let newState={popupShow:false}
    if(vals.val=="OK"){
//       cl(st.busSel)
      let buss=st.busses.slice(0)
      let dev=buss.filter(d=>{return d.busId==st.busSel})
      dev[0].del=true
      vals.busses=buss
      newState.busses=buss
    newState.devicesShow=false
    newState.deviceSelShow=false
//       cl(newState)
    }
    this.setState(newState)
  }

  instDevDelete=(type,vals)=>{
    let st=this.state
    let newState={popupShow:false}
    if(vals.val=="OK"){
      let devs=st.instDevs.slice(0)
      let dev=devs.filter(d=>{return d.instDevId==st.deviceSel})
      dev[0].del=true
      vals.instDevs=devs
      newState.instDevs=devs
//     newState.devicesShow=false
    newState.deviceSelShow=false
    }
    this.setState(newState)
  }

  updateBusses=async()=>{
    let st=this.state
    let buss=st.busses.slice(0)
    let dels=[]
    let mods=[]//
//     let buss2=buss.filter(b=>{return !b.del})
//     cl(buss2)
    this.setState({busses:buss.filter(b=>{return !b.del})})
    buss.forEach(d=>{
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
//     cl(buss)
    var resp
    cl(mods)
    if(dels.length){
      resp=await wsTrans("users",{uri:"/s/busses",method:"delete",
        sessionId:globs.login.sessionId,body:dels})
    }
    if(mods.length){
      resp=await wsTrans("users",{uri:"/s/busses",method:"update",
        sessionId:globs.login.sessionId,body:mods})
    }
  }

  updateDevices=async()=>{
    let st=this.state
    let regs=st.instDevs.slice(0)
    cl(regs)
    let dels=[]
    let mods=[]
    this.setState({instDevs:regs.filter(b=>{return !b.del})})
    regs.forEach(r=>{
      if(r.del){
        delete r.del
        delete r.mod
        dels.push(r)
      }else{
        if(r.mod&&(r.instDevType!="none")){
          delete r.mod
          mods.push(r)
        }
      }
    })
    var resp
    if(dels.length){
      resp=await wsTrans("users",{uri:"/s/instDevs",method:"delete",
        sessionId:globs.login.sessionId,body:dels})
    }
    if(mods.length){
      resp=await wsTrans("users",{uri:"/s/instDevs",method:"update",
        sessionId:globs.login.sessionId,body:mods})
    }
  }

  updateInfo=()=>{
    cl("update info")
    this.updateTimer=null
    this.updateBusses()
    this.updateDevices()
  }

  setUpdateTimer=()=>{
    if(this.updateTimer){clearTimeout(this.updateTimer)}
    this.updateTimer=setTimeout(this.updateInfo,5000)
  }

  onChange=(type,vals)=>{
    cl(type,vals)
    this.setUpdateTimer()
    let st=this.state
    var dev,reg,regs
    switch(type){
      case "newBuss":
        cl("newBuss")
        this.newBuss()
        break;
      case "newDevice":
        cl("newDevice")
        this.newDevice()
        break;
      case "busSel":
        vals.devicesShow=true
        vals.deviceSelShow=false
        dev=st.busses.filter(d=>{return d.busId==vals.busSel})
        if(dev[0]){
          vals.busName=dev[0].name
          vals.deviceSel="none"
        }
        this.setState(vals)
        break;
      case "instDevSel":
        vals.deviceSelShow=true
        reg=st.instDevs.filter(r=>{return r.instDevId==vals.deviceSel})
        cl(reg)
        if(reg[0]){
          vals.instDevName=reg[0].name
          vals.instDevType=reg[0].instDevType
        }
        cl(vals)
        this.setState(vals)
        break;
      case "busDel":
//         cl("deviceDel")
        this.setState({busSel:vals.busSel,popupShow:true,
          popupText:"This will delete the selected Bus Type",
          popupButtons:"OKCancel",
          popupFunc:this.busDelete,
        })
        vals.e.stopPropagation()
        break
      case "instDevDel":
        this.setState({deviceSel:vals.deviceSel,popupShow:true,
          popupText:"This will delete the selected Device Type",
          popupButtons:"OKCancel",
          popupFunc:this.instDevDelete,
        })
        vals.e.stopPropagation()
        break
      case "busName":
        let buss=st.busses.slice(0)
        cl(st)

        dev=buss.filter(d=>{return d.busId==st.busSel})
        dev[0].name=vals.busName
        dev[0].mod=true
        vals.busses=buss
        this.setState(vals)
        break
      case "instDevName":
        regs=st.instDevs.slice(0)
        reg=regs.filter(r=>{return r.instDevId==st.deviceSel})
        reg[0].name=vals.instDevName
        reg[0].mod=true
        vals.instDevs=regs
        this.setState(vals)
        break
      case "instDevType":
        regs=st.instDevs.slice(0)
        reg=regs.filter(r=>{return r.instDevId==st.deviceSel})
        reg[0].instDevType=vals.instDevType
        reg[0].mod=true
        vals.instDevs=regs
        this.setState(vals)
        break
    }
  }

  loadInfo=async()=>{
    cl(globs.login.sessionId)
    let resp=await wsTrans("users",{uri:"/s/busses",method:"retrieve",
      sessionId:globs.login.sessionId,body:{}})
    let busses=resp.busses
    cl(busses)
    cl(resp)
    resp=await wsTrans("users",{uri:"/s/instDevs",method:"retrieve",
      sessionId:globs.login.sessionId,body:{}})
    let instDevs=resp.instDevs
    cl(resp)
    resp=await wsTrans("users",{uri:"/s/devices",method:"retrieve",
      sessionId:globs.login.sessionId,body:{}})
    let devices=resp.devices

    this.setState({busses:busses,instDevs:instDevs,devices:devices})

  }

  showBussSel=()=>{
    let st=this.state
    if(!st.devicesShow){return}
    let pa=this.props.parms
    let wid=0.9*st.scrWidth
    let wid2=0.9*wid
    return(
      <div>
        <Form style={{width:500}}>
          <Form.Group className="mb-3">
            <Form.Label>Bus Name:</Form.Label>
            <Form.Control
              id="busName"
              type="text"
              value={st.busName}
              onChange={e=>this.onChange("busName",{busName:e.currentTarget.value})}
            />
          </Form.Group>
        </Form>
      </div>

    )
  }

  showDeviceSel=()=>{
    let st=this.state
    if(!st.deviceSelShow){return}
    let pa=this.props.parms
    let wid=0.9*st.scrWidth
    let wid2=0.9*wid
    let options=st.devices.map((d,i)=>{
      return(
        <option key={i} value={d.deviceId}>{d.name}</option>
      )
    })
    options.unshift(<option key={"x"} value="none">Select a Device Type</option>)
    return(
      <div>
        <Form style={{width:500}}>
          <Form.Group className="mb-3">
            <Form.Label>Device Name:</Form.Label>
            <Form.Control
              id="instDevName"
              type="text"
              value={st.instDevName}
              onChange={e=>this.onChange("instDevName",{instDevName:e.currentTarget.value})}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Device Type:</Form.Label>
            <Form.Select aria-label="device type select"
            value={st.instDevType}
            onChange={e=>this.onChange("instDevType",{instDevType:e.currentTarget.value})}>
            {options}
            </Form.Select>
          </Form.Group>
        </Form>
      </div>

    )
  }

  showBusses=()=>{
    let st=this.state
    let pa=this.props.parms
    let wid=0.9*st.scrWidth
    let wid2=0.9*wid
    let rows=(st.busses||[])
      .filter(d=>{return !d.del})
      .map((d,i)=>{
//       cl(d,st.busSel)
      let bgColor=(d.busId==st.busSel)?"#AAFFFF":"white"
      if(!d.del){

      }
      return(
        <tr key={i} style={{cursor:"pointer",backgroundColor:bgColor}}
          onClick={e=>this.onChange("busSel",{busSel:d.busId})}
        >
          <td style={{fontSize:22,fontWeight:700,color:"#CC0000",cursor:"pointer",
          }}
          onClick={e=>{this.onChange("busDel",{busSel:d.busId,e:e})}}
          ><span style={{position:"relative",top:-2}}>&nbsp;x&nbsp;</span>
          </td>
        <td>{d.name}</td></tr>
      )
    })
    return(
    <>
        <h3>Busses</h3>
          <div style={{width:wid2,height:200,borderRadius:10,border:"1px solid",
            position:"relative",top:20,padding:20,overflowY:"auto"
          }}>
          <table><tbody>
          <tr>
          <td></td><th width="200">Buss Name</th>
          <td>
            <span style={{fontSize:36,fontWeight:700,color:"#00CCCC",cursor:"pointer"}}
            onClick={e=>this.onChange("newBuss")}
            >+</span></td></tr>
            {rows}
          </tbody></table>
          </div><br/>
    </>
    )
  }

  showDevices=()=>{
    let st=this.state
    if(!st.devicesShow){return}
    let pa=this.props.parms
    let wid=0.9*st.scrWidth
    let wid2=0.9*wid
    let rows=st.instDevs
    .filter(d=>{return (d.busId==st.busSel)&&(!d.del)})
    .map((r,i)=>{
//       cl(r,st.busSel)
      let bgColor=(r.instDevId==st.deviceSel)?"#AAFFFF":"white"
      return(
        <tr key={i} style={{cursor:"pointer",backgroundColor:bgColor}}
          onClick={e=>this.onChange("instDevSel",{deviceSel:r.instDevId})}
        >
          <td style={{fontSize:22,fontWeight:700,color:"#CC0000",cursor:"pointer"}}
          onClick={e=>{this.onChange("instDevDel",{deviceSel:r.instDevId,e:e})}}
          ><span style={{position:"relative",top:-2}}>&nbsp;x&nbsp;</span></td>
        <td>{r.name}</td><td>{r.instDevAddr}</td></tr>
      )
    })
    return(
    <>
        <h3>Installed Devices</h3>
          <div style={{width:wid2,height:200,borderRadius:10,border:"1px solid",
            position:"relative",top:20,padding:20,overflowY:"auto"
          }}>
          <table><tbody>
          <tr>
          <td></td><th width="200">Device</th><th width="200">Device Address</th>
          <td>
            <span style={{fontSize:36,fontWeight:700,color:"#00CCCC",cursor:"pointer"}}
            onClick={e=>this.onChange("newDevice")}
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
          {this.showBusses()}
          {this.showBussSel()}
          {this.showDevices()}
          {this.showDeviceSel()}
        </div>
          <Popup parms={{
            center:[st.scrWidth/2,st.scrHeight/2],
            onChange:st.popupFunc,//this.busDelete,
            show:st.popupShow,
            text:st.popupText,
            buts:st.popupButtons,
          }}/>
      </div>
    )
  }
}

export default Busses;
