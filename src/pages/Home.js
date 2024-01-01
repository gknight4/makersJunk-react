import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
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
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
          <img src="/img/mbLogo.png"
          width="30" height="30"/>&nbsp;
          Modbus Monitor</Navbar.Brand>
          <Navbar.Toggle />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="#home">Home</Nav.Link>
                  <Nav.Link href="#link">Link</Nav.Link>
                  <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">
                      Separated link
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>

          <Navbar.Collapse className="justify-content-end">
            <Nav className="ml-auto">
              <Nav.Link href="/login.html">Sign In</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
        </div>
   )
  }
}

export default Home;
