import React from 'react';
// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import MenuBar from './MenuBar'
// import { useHistory } from 'react-router-dom';
import history from '../history'

import 'bootstrap/dist/css/bootstrap.css';

class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      who:"this",
    }
//     let history=useHistory()
//     history.push("/login.html")
//     browserHistory.push("/login.html")
  }

  button=()=>{
    this.setState({who:"that"})
  }

  render(){
    return(
      <div>
        <MenuBar/>
      </div>
    )
  }
}

export default Home;
