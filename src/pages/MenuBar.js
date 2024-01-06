import React from 'react';
import {Link} from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {withRouter} from './withRouter'
import 'bootstrap/dist/css/bootstrap.css';
import {cl,globs} from '../utils/utils'


class MenuBar extends React.Component{
  constructor(props) {
    super(props);
//     cl("menubar start")
//     cl(globs)
    this.state={
      userName:"Sign In",
    }
//     this.subscribe_login=globs.events.subscribe("login", this.loginEvent)
  }

//   componentWillUnmount=()=>{
//     this.subscribe_login.remove()
//   }


//   loginEvent=(data)=>{
// //     cl(data)
//     this.setState({loggedIn:true,userName:data.name})
//   }

  logOut=()=>{
    cl("logout")
    globs.login=null
    this.setState({loggedIn:false})
    localStorage.removeItem("login")
    sessionStorage.removeItem("login",null)
    this.props.navigate("/login.html")
  }

  onChange=(type,vals)=>{
    switch(type){
      case "logOut":
        this.logOut()
        break
      default:
        break
    }
  }

  userDropdown=()=>{
    let st=this.state
    let userName=(globs.login)?globs.login.name:"Sign In"
//     cl(globs.login)
//     cl(userName)
    if(globs.login){
      return(
        <NavDropdown title={userName} id="basic-nav-dropdown">
          <NavDropdown.Item onClick={e=>this.onChange("logOut")}>Log Out</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/account.html">Account</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">
            Separated link
          </NavDropdown.Item>
        </NavDropdown>
      )
    }else{
      return(
        <Nav.Link as={Link} to="/login.html">{userName}</Nav.Link>

      )
    }
  }

  render(){
    let st=this.state
//               <Nav.Link href="/login.html">{st.userName}</Nav.Link>
    return(
        <div style={{boxShadow:"10px 10px 10px #C88",}}>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="Home.html">
          <img src="/img/mbLogo.png"
          width="30" height="30"/>&nbsp;
          Modbus Monitor</Navbar.Brand>
          <Navbar.Toggle />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="#home">Home</Nav.Link>
                  <Nav.Link href="modbus.html">Modbus</Nav.Link>
                  <Nav.Link as={Link} to="/devicetypes.html">Device Types</Nav.Link>
                  <Nav.Link as={Link} to="/busses.html">Busses</Nav.Link>
                  <Nav.Link as={Link} to="/monitors.html">Monitors</Nav.Link>
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
            {this.userDropdown()}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
        </div>
   )
  }
}

export default withRouter(MenuBar);
