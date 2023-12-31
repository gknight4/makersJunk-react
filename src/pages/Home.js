import React from 'react';
// import { useHistory } from 'react-router-dom';
import history from '../history'

class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      who:"this",
    }
//     let history=useHistory()
    history.push("/login.html")
//     browserHistory.push("/login.html")
  }

  button=()=>{
    this.setState({who:"that"})
  }

  render(){
    return(
      <div>Home
//       {this.state.who}
//       <button type="button" onClick={this.button}>who</button>
      </div>
    )
  }
}

export default Home;
