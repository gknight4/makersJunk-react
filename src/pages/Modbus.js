import React from 'react';
import MenuBar from './MenuBar'
import {cl,constant,openWebSocket,getTime,getTimeMs,checkCRC,
  msecsToDisplayDate} from '../utils/utils'

class Modbus extends React.Component{
  constructor(props) {
    super(props);
//     cl("This page is still loading twice")// remove StrictMode in index.js!
//     let timeline=[]
//     for(let i=0;i<100;i++){timeline.push(100)}
    this.state={
      scrWidth:window.innerWidth,
      scrHeight:window.innerHeight,
//       timeline:timeline,
      times:[],
      who:"dat",
      dispTime:getTimeMs()%86400000,
      play:true,
      playText:"Pause"
    }
    this.loadInfo()
    this.tsOffset=0
    setInterval(this.updDisp,2000)
//     cl("set false")
  }

//   componentDidMount() {
//     cl("did mount")
//     cl(this.mounted)
//     this.mounted=true
//     cl(this.mounted)
//   }

isMaster=true
mbLog=[]

  updDisp=()=>{
//     cl("upd")
    if(this.state.play){
      this.setState({dispTime:getTimeMs()%86400000})
    }
  }



  readMB=()=>{// the data is in recvBytes
/* this looks for a valid MB command, tries to read the packet with a valid checkCRC
It will check the packet as both a Master type and a Slave type
failing those, it will index along (up to 24) to find another MB command, and do it again
i / ind is the index into the current recvBytes. When a packet is good or bad,
recvbytes is trimmed on the left, and the ind goes back to 0.
*/
    let loopCnt=0
//     cl("ReadMB Start")
    while(this.recvBytes.length>24){
//       cl(`Read MB Length: ${this.recvBytes.length}`)
      var data=this.recvBytes
      var res,ind
      for(let i=0;i<24;i++){// try 24 bytes looking for a new message beginning
        res=0
        for(let j=0;j<2;j++){// try both master and slave
          ind=i
          let cmd=data[ind+1].by&0x7F// temp! sometimes high bit is set
          data[ind+1].by=cmd
          var cmdBytes
          switch(cmd){// this calculates the length of the message
            case constant.READ_HOLDING:
              if(this.isMaster){//add:1, func:1, reg:2, num:2, crc:2
                cmdBytes=6
              }else{ //add:1, func:1, bytes:1, data: 2*bytes
                cmdBytes=3+(data[ind+2].by)
              }
              break
            case constant.WRITE_REGISTER:
              if(this.isMaster){// add:1, func:1, reg:2, data:2
                cmdBytes=6
              }else{// add:1, func:1, reg: 2, data: 2
                cmdBytes=6
              }
              break
            case constant.WRITE_MULTIPLE_REGISTERS:
              if(this.isMaster){// add:1, func:1, reg:2, count: 2, bytes: 1, data: bytes
                cmdBytes=7+(data[ind+6].by)
              }else{// add: 1, func: 1, reg:2, quant:2
                cmdBytes=6
              }
              break
            default:
              cmdBytes=0
              break
          }
          let type=(this.isMaster)?"Master":"Slave"
          let ms=this.isMaster
          this.isMaster=!this.isMaster
          if(cmdBytes){
//             cl(data.slice(ind,ind+cmdBytes))
            let bytes=data.slice(ind,ind+cmdBytes+2).map(d=>{return d.by})
            res=checkCRC(bytes,0,cmdBytes)
            if(res){
//               cl(`${type} Read OK`)
//               cl(bytes)
              this.mbLog.push({
                ts:data[ind].ts,
                mb:bytes,
                ms:!this.isMaster,
                crc:res,
              })
//               cl(this.mbLog[this.mbLog.length-1])
              break
            }else{
//               cl(`Bad ${type} CRC:`)
//               cl(bytes)
              if(j==1){// we've tried both master, slave'
                this.mbLog.push({
                  ts:data[ind].ts,
                  mb:bytes,
                  ms:!this.isMaster,
                  crc:res,
                })
//                 cl(this.mbLog[this.mbLog.length-1])
              }
//               cl(data.slice(ind,ind+cmdBytes+2).map(d=>{return d.by}))
//               cl(data.slice(ind,ind+cmdBytes))
            }
          }
//           if(loopCnt++>10){return}
        }
        if(res){
          let endP=ind+cmdBytes+2
          let mbCmd=data.slice(ind,endP)
          this.recvBytes=this.recvBytes.slice(endP)
//           cl(`Recv reduced to ${this.recvBytes.length}`)
          break}
      }
    }
  }

  recvBytes=[]// received data, in an array with timestamps for each byte


  procData=(pack)=>{// the pack received
//     cl("proc")
    let st=this.state
    var lastMB=[],packRem,itemRem,timeStamp,times=[]
    var mbBytes=[]

    var readWord=()=>{
      let ret=pack[0]|(pack[1]<<8)
      pack=pack.slice(2)
      return ret
    }

    var readUint=()=>{
      let ret=pack[0]|(pack[1]<<8)|(pack[2]<<16)|(pack[3]<<24)
      pack=pack.slice(4)
      return ret
    }

    while(pack.length){
      let cmd=readWord(pack)//pack[0]|(pack[1]<<8)
      switch(cmd){
        case constant.MB_PACK:
          packRem=readWord(pack)-4
          break
        case constant.MB_ITEM:
          itemRem=readWord(pack)-8
          timeStamp=readUint(pack)
          if(this.tsOffset==0){this.tsOffset=(new Date()).getTime()%86400000-timeStamp}
          timeStamp+=this.tsOffset
          for(let i=0;i<itemRem;i++){
            mbBytes.push({
              ts:timeStamp+0.52*i,// .52 ms / byte
              by:pack[i]
            })
          }
          times.push({ts:timeStamp,bytes:itemRem})
          lastMB=lastMB.concat(pack.slice(0,itemRem))
          pack=pack.slice(itemRem)
          break
      }
    }
//     cl(mbBytes)// an array of objects with timestamps for each byte
    this.recvBytes=this.recvBytes.concat(mbBytes)
//     cl(this.recvBytes.length)
    if(this.recvBytes.length>1000){this.recvBytes=[]}
    times=st.times.concat(times)
    let last=times[times.length-1].ts
    times=times.filter(t=>{return t.ts>last-10000})
      this.setState({times:times})
  }

  onData=(msg)=>{
//     cl("onData")
    let obj=JSON.parse(msg.data)
    this.procData(obj)// process to array of timestamps and bytes
    this.readMB()
//     cl(msg.data)
//     cl(obj)
  }

  loadInfo=async()=>{
    this.ws=await openWebSocket(constant.wsUrl,this.onData)
  }

  onChange=(type,vals)=>{
    let st=this.state
    switch(type){
      case "playPause":
        cl("play")
        let play=!st.play
        this.setState({play:play,playText:(play)?"Pause":"Play"})
        break
    }
  }

  showTimeLine=()=>{
// use st.dispTime, find the location in the mbLog array, then display from end to -10secs
    let st=this.state
    let dispTime=st.dispTime
    if(this.mbLog.length){
      let i=this.mbLog.length-1
      while(this.mbLog[i].ts>dispTime&&(i>0)){i--}
      let shows=[]
      while(this.mbLog[i].ts>(dispTime-10000)&&(i>0)){
        shows.push(this.mbLog[i--])
      }
      let tlHeight=20
      let tlWidth=st.scrWidth*0.9
      let segs=shows.map((s,i)=>{
        let pos=1000-Math.floor((dispTime-s.ts)/10)
        return(
          <div key={i} style={{width:1,height:20,backgroundColor:s.crc?"green":"red",
            position:"absolute",left:pos,top:0
          }}
          />
        )
      })
      return(
        <div>
          <div style={{width:tlWidth,height:tlHeight, border:"1px solid",
            position:"relative"
          }}>
          {segs}
          </div>
          <div style={{margin:5}}>
            <button style={{width:50,padding:1,lineHeight:"16px"}}
            type="button" onClick={e=>this.onChange("playPause",{})}>{st.playText}</button>&nbsp;
            <span style={{padding:2,lineHeight:"16px",border:"solid",fontSize:13.333,
              textAlign:"center",borderWidth:1}}>{msecsToDisplayDate(dispTime)}
            </span>
          </div>
        </div>
      )
    }
  }

  readMbReg=(mb,ind)=>{
    return (mb[ind]<<8)|mb[ind+1]
  }

  formatReadHolding=(msg,i)=>{
    let mb=msg.mb
    let color=(msg.crc)?"black":"red"
    let style={color:color}
    if(msg.ms){
// 8) [4, 3, 0, 209, 0, 2, 148, 103]
// ReadReg Addr 3 Start: Reg 209, Count 2
      let start=(mb[2]<<8)+mb[3]
      let count=(mb[4]<<8)+mb[5]
      let cmd=(msg.crc)?"Read Register":"CRC ERROR"
//         <span style={style} key={i}>{`Addr ${msg.mb[0]}, ${cmd}, Start ${start},
//           Count ${count}`}<br/></span>
      return(
        <tr style={style} key={i}>
        <td>{`Addr ${msg.mb[0]}`}</td>
        <td>{`${cmd}`}</td>
        <td>{`Start ${start}`}</td>
        <td>{`Count ${count}`}</td>
        </tr>
      )
    }else{
//[4, 3, 4, 0, 14, 0, 0, 206, 240]
      let val1=this.readMbReg(mb,3)
      let val2=this.readMbReg(mb,5)
      let cmd=(msg.crc)?"Read Response":"CRC ERROR"
//         <span style={style} key={i}>{`Addr ${msg.mb[0]}, ${cmd}, Bytes ${mb[2]},
//           Values ${val1}, ${val2}...`}<br/></span>
      return(
        <tr style={style} key={i}>
        <td>{`Addr ${msg.mb[0]}`}</td>
        <td>{`${cmd}`}</td>
        <td>{`Bytes ${mb[2]}`}</td>
        <td>{`Values ${val1}, ${val2}...`}</td>
        </tr>
      )
    }
    cl(msg)
  }

  formatMB=(msg,i)=>{
    let cmd=msg.mb[1]
    switch(cmd){
      case constant.READ_HOLDING:
        return this.formatReadHolding(msg,i)
        break
    }
//     return(
//       <span key={i}>{`${msg.mb[0]}-${msg.mb[1]}`}<br/></span>
//     )
  }

  showModbus=()=>{
//     cl(this.mbLog)
    let st=this.state
    let dispTime=st.dispTime
    let mbHeight=900
    let mbWidth=st.scrWidth*0.9
    if(this.mbLog.length){
      let i=this.mbLog.length-1
      while(this.mbLog[i].ts>dispTime&&(i>0)){i--}
      let len=i
      let cnt=(len<20)?len:20
  //       while(this.mbLog[i].ts>(dispTime-10000)&&(i>0)){
  //         shows.push(this.mbLog[i--])
  //       }
      let lines=this.mbLog.slice(len-cnt,len).map((l,i)=>{
        return(
          this.formatMB(l,i)
        )
      })
  //     cl(lines)
      return(
        <div>
          <div style={{width:mbWidth,height:mbHeight, border:"1px solid",
            position:"relative"
          }}>
          <table><tbody>
          {lines}
          </tbody></table>
          </div>
        </div>
      )
    }
  }

  render(){
//     cl(this.mounted)
    let st=this.state
    let wid=0.9*st.scrWidth
    let hgt=1000
    return(
      <div>
        <MenuBar/>
        <div style={{width:wid, height: hgt, padding:20,backgroundColor:"white",
          margin:"auto",top:50,boxShadow:"10px 10px 10px #C88",
          borderRadius:10,position:"relative"
        }}>
        {this.showModbus()}
        {this.showTimeLine()}
        </div>
      </div>
    )
  }
}

export default Modbus;
