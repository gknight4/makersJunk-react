import React from 'react';
import Form from 'react-bootstrap/Form'
import MenuBar from './MenuBar'
import Popup from './Popup'
import {cl,constant,globs,wsTrans,getRandomString} from '../utils/utils'
// import bcrypt from 'bcrypt'

class DeviceTypes extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      scrWidth:window.innerWidth,
      scrHeight:window.innerHeight,
      devices:[],
      registers:[],
      popupShow:false,
      popupText:"",
      popupButtons:"",
      registersShow:false,
      registerSelShow:false,
      typeName:"",
      id:"",
      registerName:"",
      regAddr:"",
      regCoil:false,
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


  newDevice=()=>{
    let st=this.state
    let deviceId=getRandomString(16)
    let deviceName="New Device"
    let newDev={name:deviceName,mod:true,deviceId:deviceId}
    let devs=st.devices.slice(0)
    devs.unshift(newDev)
    this.setState({devices:devs,deviceSel:deviceId,registersShow:true,
      typeName:deviceName
    })
  }

  newRegister=()=>{
    let st=this.state
    let registerId=getRandomString(16)
    let registerName="New Register"
    let newReg={name:registerName,mod:true,registerId:registerId,
      regAddr:0,regCoil:false,deviceId:st.deviceSel}
    let regs=st.registers.slice(0)
    regs.unshift(newReg)
    cl(regs)
    this.setState({registers:regs,registerSel:registerId,
      registerName:registerName,registerSelShow:true,
      regAddr:"0",regCoil:false
    })
  }

  deviceDelete=(type,vals)=>{
//     cl(type,vals)
    let st=this.state
    let newState={popupShow:false}
    if(vals.val=="OK"){
//       cl(st.deviceSel)
      let devs=st.devices.slice(0)
      let dev=devs.filter(d=>{return d.deviceId==st.deviceSel})
      dev[0].del=true
      vals.devices=devs
      newState.devices=devs
//       cl(newState)
    }
    newState.registersShow=false
    newState.registerSelShow=false
    this.setState(newState)
  }

  updateDevices=async()=>{
    let st=this.state
    let devs=st.devices.slice(0)
    let dels=[]
    let mods=[]
    this.setState({devices:devs.filter(b=>{return !b.del})})
    devs.forEach(d=>{
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
      resp=await wsTrans("users",{uri:"/s/devices",method:"delete",
        sessionId:globs.login.sessionId,body:dels})
    }
    if(mods.length){
      resp=await wsTrans("users",{uri:"/s/devices",method:"update",
        sessionId:globs.login.sessionId,body:mods})
    }
  }

  updateRegisters=async()=>{
    let st=this.state
    let regs=st.registers.slice(0)
    cl(regs)
    let dels=[]
    let mods=[]
    this.setState({registers:regs.filter(b=>{return !b.del})})
    regs.forEach(r=>{
      if(r.del){
        delete r.del
        delete r.mod
        dels.push(r)
      }else{
        if(r.mod){
          delete r.mod
          mods.push(r)
        }
      }
    })
    var resp
    if(dels.length){
      resp=await wsTrans("users",{uri:"/s/registers",method:"delete",
        sessionId:globs.login.sessionId,body:dels})
    }
    if(mods.length){
      resp=await wsTrans("users",{uri:"/s/registers",method:"update",
        sessionId:globs.login.sessionId,body:mods})
    }
  }

  updateInfo=()=>{
    cl("update info")
    this.updateTimer=null
    this.updateDevices()
    this.updateRegisters()
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
      case "newDevice":
        this.newDevice()
        break;
      case "newRegister":
        this.newRegister()
        break;
      case "deviceSel":
        vals.registersShow=true
        dev=st.devices.filter(d=>{return d.deviceId==vals.deviceSel})
        if(dev[0]){
          vals.typeName=dev[0].name
        }
        vals.registerSelShow=false
        vals.regAddr=""
        vals.regCoil=false
        this.setState(vals)
        break;
      case "registerSel":
        vals.registerSelShow=true
        reg=st.registers.filter(r=>{return r.registerId==vals.registerSel})
        if(reg[0]){
          vals.registerName=reg[0].name
          vals.regAddr=reg[0].regAddr
          vals.regCoil=reg[0].regCoil
        }
        this.setState(vals)
        break;
      case "deviceDel":
//         cl("deviceDel")
        this.setState({deviceSel:vals.deviceSel,popupShow:true,
          popupText:"This will delete the selected Device Type",
          popupButtons:"OKCancel",
          popupFunc:this.deviceDelete,
        })
        vals.e.stopPropagation()
        break
      case "typeName":
        let devs=st.devices.slice(0)
        dev=devs.filter(d=>{return d.deviceId==st.deviceSel})
        dev[0].name=vals.typeName
        dev[0].mod=true
        vals.devices=devs
        this.setState(vals)
        break
      case "registerName":
        regs=st.registers.slice(0)
        reg=regs.filter(r=>{return r.registerId==st.registerSel})
        reg[0].name=vals.registerName
        reg[0].mod=true
        vals.registers=regs
        this.setState(vals)
        break
      case "regAddr":
      case "regCoil":
        regs=st.registers.slice(0)
        reg=regs.filter(r=>{return r.registerId==st.registerSel})
        if(type=="regAddr"){
          reg[0].regAddr=vals.regAddr
        }else{
          reg[0].regCoil=vals.regCoil
        }
        reg[0].mod=true
        vals.registers=regs
        this.setState(vals)
        break
    }
  }

  loadInfo=async()=>{
    cl(globs.login.sessionId)
    let resp=await wsTrans("users",{uri:"/s/devices",method:"retrieve",
      sessionId:globs.login.sessionId,body:{}})
    let devices=resp.devices
    cl(devices)
    resp=await wsTrans("users",{uri:"/s/registers",method:"retrieve",
      sessionId:globs.login.sessionId,body:{}})
    let registers=resp.registers.sort((a,b)=>{
      if(a.regAddr>b.regAddr){return 1}
      if(a.regAddr<b.regAddr){return -1}
      return 0
    })
    cl(registers)
    cl(resp)
    this.setState({devices:devices,registers:registers})

  }

  showRegistersO=()=>{
    let st=this.state
    if(!st.registersShow){return}
    let wid2=0.81*st.scrWidth
    return(
      <div>
        <Form style={{width:500}}>
          <Form.Group className="mb-3">
            <Form.Label>Device Type Name:</Form.Label>
            <Form.Control
              id="typeName"
              type="text"
              value={st.typeName}
              onChange={e=>this.onChange("typeName",{typeName:e.currentTarget.value})}
            />
          </Form.Group>
        </Form>
        <h4>Registers</h4>
        <div style={{width:wid2,height:200,borderRadius:10,border:"1px solid",
          position:"relative",top:20,padding:20,overflowY:"auto"
        }}>
          <table><tbody>
          </tbody></table>
        </div><br/>
        <Form style={{width:500}}>
          <Form.Group className="mb-3">
            <Form.Label>Register Name:</Form.Label>
            <Form.Control
              id="registerName"
              type="text"
              value={st.typeName}
              onChange={e=>this.onChange("registerName",{typeName:e.currentTarget.value})}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Register Address:</Form.Label>
            <Form.Control
              id="registerType"
              type="text"
              value={st.typeName}
              onChange={e=>this.onChange("registerName",{typeName:e.currentTarget.value})}
            />
          </Form.Group>
        </Form>
      </div>
    )
  }

  showDeviceSel=()=>{
    let st=this.state
    if(!st.registersShow){return}
    let pa=this.props.parms
    let wid=0.9*st.scrWidth
    let wid2=0.9*wid
    return(
      <div>
        <Form style={{width:500}}>
          <Form.Group className="mb-3">
            <Form.Label>Device Type Name:</Form.Label>
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

  showRegisterSel=()=>{
    let st=this.state
    if(!st.registerSelShow){return}
    let pa=this.props.parms
    let wid=0.9*st.scrWidth
    let wid2=0.9*wid
    return(
      <div>
        <Form style={{width:500}}>
          <Form.Group className="mb-3">
            <Form.Label>Register Name:</Form.Label>
            <Form.Control
              id="registerName"
              type="text"
              value={st.registerName}
              onChange={e=>this.onChange("registerName",{registerName:e.currentTarget.value})}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Register Address:</Form.Label>
            <Form.Control
              id="regAddr"
              type="text"
              value={st.regAddr}
              onChange={e=>this.onChange("regAddr",{regAddr:e.currentTarget.value})}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
                type="checkbox"
                label="Coil"
                id="regCoil"
                checked={st.regCoil}
                onChange={e=>this.onChange("regCoil",{regCoil:e.currentTarget.checked})}
              />
          </Form.Group>
        </Form>
      </div>

    )
  }

  showDevices=()=>{
    let st=this.state
    let pa=this.props.parms
    let wid=0.9*st.scrWidth
    let wid2=0.9*wid
    let rows=(st.devices||[])
      .filter(d=>{return !d.del})
      .map((d,i)=>{
//       cl(d,st.deviceSel)
      let bgColor=(d.deviceId==st.deviceSel)?"#AAFFFF":"white"
      if(!d.del){

      }
      return(
        <tr key={i} style={{cursor:"pointer",backgroundColor:bgColor}}
          onClick={e=>this.onChange("deviceSel",{deviceSel:d.deviceId})}
        >
          <td style={{fontSize:22,fontWeight:700,color:"#CC0000",cursor:"pointer"}}
          onClick={e=>{this.onChange("deviceDel",{deviceSel:d.deviceId,e:e})}}
          ><span style={{position:"relative",top:-2}}>&nbsp;x&nbsp;</span></td>
        <td>{d.name}</td></tr>
      )
    })
    return(
    <>
        <h3>Device Types</h3>
          <div style={{width:wid2,height:200,borderRadius:10,border:"1px solid",
            position:"relative",top:20,padding:20,overflowY:"auto"
          }}>
          <table><tbody>
          <tr>
          <td></td><th width="200">Device Name</th>
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

  showRegisters=()=>{
    let st=this.state
    if(!st.registersShow){return}
    let pa=this.props.parms
    let wid=0.9*st.scrWidth
    let wid2=0.9*wid
    let rows=st.registers
    .filter(r=>{return r.deviceId==st.deviceSel})
    .map((r,i)=>{
      cl(r,st.deviceSel)
      let bgColor=(r.registerId==st.registerSel)?"#AAFFFF":"white"
      let addr=r.regAddr+((r.regCoil)?" (Coil)":"")
      return(
        <tr key={i} style={{cursor:"pointer",backgroundColor:bgColor}}
          onClick={e=>this.onChange("registerSel",{registerSel:r.registerId})}
        >
          <td style={{fontSize:22,fontWeight:700,color:"#CC0000",cursor:"pointer"}}
          onClick={e=>{this.onChange("registerDel",{registerSel:r.registerId,e:e})}}
          ><span style={{position:"relative",top:-2}}>&nbsp;x&nbsp;</span></td>
        <td>{r.name}</td><td>{addr}</td></tr>
      )
    })
    return(
    <>
        <h3>Registers</h3>
          <div style={{width:wid2,height:200,borderRadius:10,border:"1px solid",
            position:"relative",top:20,padding:20,overflowY:"auto"
          }}>
          <table><tbody>
          <tr>
          <td></td><th width="200">Register</th><th width="200">Register Address</th>
          <td>
            <span style={{fontSize:36,fontWeight:700,color:"#00CCCC",cursor:"pointer"}}
            onClick={e=>this.onChange("newRegister")}
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
          {this.showDevices()}
          {this.showDeviceSel()}
          {this.showRegisters()}
          {this.showRegisterSel()}
        </div>
          <Popup parms={{
            center:[st.scrWidth/2,st.scrHeight/2],
            onChange:st.popupFunc,//this.deviceDelete,
            show:st.popupShow,
            text:st.popupText,
            buts:st.popupButtons,
          }}/>
      </div>
    )
  }
}

export default DeviceTypes;
