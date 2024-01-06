// import logo from './logo.svg';
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import Host from './pages/Host'
import Home from './pages/Home'
import CreateAccount from './pages/CreateAccount'
import ForgotPassword from './pages/ForgotPassword'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import Modbus from './pages/Modbus'
import DeviceTypes from './pages/DeviceTypes'
import Busses from './pages/Busses'
import Monitors from './pages/Monitors'
import Account from './pages/Account'
import{
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import {cl, init} from './utils/utils'
import './App.css';
// import { createBrowserHistory } from 'history';
// const history=createBrowserHistory();
const router=createBrowserRouter([
// {
//   path:"/",
//   element:<div>Hellow world!</div>,
// },
{
  path:"/*",
  element:<Login/>,
},
{
  path:"/account.html",
  element:<Account/>,
},
{
  path:"/index.html",
  element:<Home/>,
},
{
  path:"/createaccount.html",
  element:<CreateAccount/>,
},
{
  path:"/login.html",
  element:<Login/>,
},
{
  path:"/forgotpassword.html",
  element:<ForgotPassword/>,
},
{
  path:"/home.html",
  element:<Home/>,
},
{
  path:"/resetpassword.html",
  element:<ResetPassword/>,
},
{
  path:"/modbus.html",
  element:<Modbus/>,
},
{path:"/devicetypes.html",element:<DeviceTypes/>},
{path:"/busses.html",element:<Busses/>},
{path:"/monitors.html",element:<Monitors/>},

])

function App() {
//     <React.StrictMode>
//     </React.StrictMode>
//     <div style={{position:"absolute",height:"100vh",backgroundImage:GrBack,
//       backgroundSize:"cover",backgroundRepeat:"no-repeat"}}>
//   backgroundColor:"red"
//   initUsersWs()
  cl("restart app")
  init()
  return (
    <div style={{height:"100vh",backgroundImage:"/none.jpg"}}>
        <RouterProvider router={router}/>
    </div>
  );
}

export default App;
