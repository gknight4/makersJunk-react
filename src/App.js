// import logo from './logo.svg';
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import Home from './pages/Home'
import CreateAccount from './pages/CreateAccount'
import ForgotPassword from './pages/ForgotPassword'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import Modbus from './pages/Modbus'
import{
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import './App.css';

const router=createBrowserRouter([
// {
//   path:"/",
//   element:<div>Hellow world!</div>,
// },
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
  path:"/resetpassword.html",
  element:<ResetPassword/>,
},
{
  path:"/modbus.html",
  element:<Modbus/>,
},
])

function App() {
  return (
//     <React.StrictMode>
      <RouterProvider router={router} />
//     </React.StrictMode>
  );
}

export default App;
