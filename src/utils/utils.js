var cl = console.log
var globs={
  webSocket:{},
  login:null,

}

var constant={
  wsPort:3202,
  wsUrl:"ws:localhost:3202",
  wsUsersUrl:"ws:localhost:3203",
  MB_PACK:1000,
  MB_ITEM:1001,
  READ_COIL: 1,
  READ_DISCRETE: 2,
  READ_HOLDING: 3,
  READ_INPUT: 4,
  WRITE_COIL: 5,
  WRITE_REGISTER: 6,
  DIAGNOSTICS: 8,
  WRITE_MULTIPLE_COILS: 15,
  WRITE_MULTIPLE_REGISTERS: 16,
  MASTER: 0,
  SLAVE: 1,
}

var getTimeMs=()=>{
  return (new Date()).getTime()
}

function getTime(){
  return getTimeMs() / 1000 ;
}

var onOpen = (r, e)=>{
  cl("ws onOpen");
  let gws=globs.webSocket// this needs to be redone
  gws.open=true
  r(true)
}

function onClose(e){
  cl("ws onClose");
  globs.webSocket.open=false
  globs.webSocket.res=null// added 20231203
}

var recvSocket = async(msg)=>{
  globs.webSocket.onData(msg)
//   var mo
//   cl("got data")
//   cl(msg)
}

function onError(e){
  cl("ws onError");
  cl(e)
}

var sendWS = (pack)=>{
  cl(pack);
  globs.webSocket.ws.send(JSON.stringify(pack))
}

var openWebSocket=(uri,onData)=>{// this is for both
//   cl("open web")
  let gws=globs.webSocket
  return new Promise((r,e)=>{
    if(gws.open){
      cl("returnig")
      r(true)}else{
      if(gws.res){gws.res.push(r); return}// add it to the list of responses
//       cl("do connect")
      gws.res=[r]// create the list of responses
      let ws = new WebSocket(uri);
      gws.ws=ws;
      gws.onData=onData
      ws.onopen = ()=>onOpen(r, e);
      ws.onclose = e=>onClose(e);
      ws.onmessage = e=>recvSocket(e);
      ws.onerror = e=>onError(e);
      usersWs=ws
    }
  })

}

var checkCRC=(data, ind, length)=>{
  let crc=0xFFFF
  for(let i=0;i<length;i++){
    crc=crc^data[i+ind]
    for(let j=0;j<8;j++){
      if((crc&0x01)!=0){
        crc=crc>>1
        crc=crc^0xA001
      }else{
        crc=crc>>1
      }
    }
  }
  let crc2=data[ind+length]|(data[ind+length+1]<<8)
  return crc==crc2
}

var az=(val,digs)=>{
  return ("000"+val).slice(0-digs)
}

var msecsToDisplayDate=(msecs)=>{
  let hr=Math.floor(msecs/3600000)
  let mn=Math.floor(msecs/60000)%60
  let sc=Math.floor(msecs/1000)%60
  let ms=msecs%1000
  return `${hr}:${az(mn,2)}:${az(sc,2)}.${az(ms,3)}"`
}

var onData=(msg)=>{
//   cl(msg)
  let obj=JSON.parse(msg.data)
//   cl(obj)
  if(obj.key in wsTransCallbacks){
    let cb=wsTransCallbacks[obj.key]
    delete wsTransCallbacks[obj.key]
    cb(obj.resp)
  }
}

var usersWs

var initUsersWs=async()=>{
  await openWebSocket(constant.wsUsersUrl,onData)
//   cl("initting")
//   console.trace()
//   return new Promise((r,e)=>{
//     openWebSocket(constant.wsUsersUrl,onData).then(r2=>{
//       cl("got")
//       r(true)
//     })
//   })
//     cl("awaited")
//     return
}

var sendUsersWs=async(msg)=>{
  cl("send user ws")
  usersWs.send(msg)
}

var wsTransKey=0
var wsTransCallbacks={}

var wsTrans=async(wsId,parms)=>{// parms:{cmd, uri, method, sessionId, body}
if(!globs.webSocket.open){await initUsersWs()}
  return new Promise((r,e)=>{
    if(wsId=="users"){
      wsTransCallbacks[wsTransKey]=r
      parms.key=wsTransKey++
      sendUsersWs(JSON.stringify(parms))
    }
  })
}

globs.events = (function(){
  var topics = {};
  var hOP = topics.hasOwnProperty;
  return {
    subscribe: function(topic, listener) {
      if(!listener){cl(`Subscribe error, topic: ${topic}`)}
      // Create the topic's object if not yet created
      if(!hOP.call(topics, topic)) topics[topic] = [];

      // Add the listener to queue
      var index = topics[topic].push(listener) -1;

      // Provide handle back for removal of topic
      return {
        remove: function() {
          delete topics[topic][index];
        }
      };
    },
    publish: async function(topic, info) {
      if(!hOP.call(topics, topic)) return;
      // Cycle through topics queue, fire!
      for(let i=0;i<topics[topic].length;i++){
        let item=topics[topic][i]
        if(item){await item(info !== undefined ? info : {});}
      }
    }
  };
})();

// let res=await wsTrans("usa", {cmd: "cRest", uri: "/s/controllerEvents",
//       method: "retrieve", sessionId: globs.userData.session.sessionId,
//       body: {}})




export {cl,constant,globs,openWebSocket,getTime,checkCRC,getTimeMs,msecsToDisplayDate,
  initUsersWs,sendUsersWs,wsTrans
}
