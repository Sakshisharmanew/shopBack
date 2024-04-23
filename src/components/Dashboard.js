import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import {  NavLink } from "react-router-dom";
import { Layout, theme } from "antd";
import { useNavigate } from "react-router-dom";
import CreateIcon from '@mui/icons-material/Create';
import SettingsIcon from '@mui/icons-material/Settings';
import LuggageIcon from '@mui/icons-material/Luggage';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ImageIcon from '@mui/icons-material/Image';
import Navbar from "../pages/Admin/Navbar";
import "./Dashboard.css"
import AdminDashboard from "../pages/Admin/AdminDashboard";

  const { Header, Sider, Content } = Layout;


function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

    return (
       <>
       <div className="for_all_page" >   
       <div style={{ position: "fixed", width: "100%", zIndex: 1000 }}>
      <Navbar style={{ background: "whitesmoke" }} />
      </div>
        <Layout style={{backgroundColor: "white" , width:"100%" }}>
  <Sider
    trigger={null}
    collapsible
    collapsed={collapsed}
    style={{
    background: "#454544",
    position: "fixed",
    height: "100%",
    marginTop: 80,
    overflowY: "auto",  // Add this line to enable vertical scrolling
  }}  >
          <div className="logo" >
            <h1 className="text-white fs-5 text-center py-3">
              <span className="sm-logo"></span>
            </h1>
          </div>        
      <div className="text">
        <div className="list-group dashboard-menu" style={{ overflowY: "auto", maxHeight: "100vh" }}>

          <NavLink
            to="/dashboard"
            className="list-group-item list-group-item-actions"
            style={{width:170, marginLeft:10, marginBottom:5, borderRadius:20}}
          >
            <CreateIcon/>
            Dashboard
          </NavLink>
          <NavLink
            to="/createCategory"
            className="list-group-item list-group-item-actions"
            style={{width:170, marginLeft:10, marginBottom:5, borderRadius:20}}
          ><SettingsIcon/>
            Category
          </NavLink>
            <NavLink
            to="/createsubcategory"
            className="list-group-item list-group-item-actions"
            style={{width:170, marginLeft:10, marginBottom:5, borderRadius:20}}
          ><ImageIcon/>
          Sub Category
          </NavLink>
          <NavLink
            to="/createProduct"
            className="list-group-item list-group-item-actions"
            style={{width:170, marginLeft:10, marginBottom:5, borderRadius:20}}
          ><LuggageIcon/>
            CreateProduct
          </NavLink>
          <NavLink
            to="/products"
            className="list-group-item list-group-item-actions"
            style={{width:170, marginLeft:10, marginBottom:5, borderRadius:20}}
          ><GroupAddIcon/>
            Products
          </NavLink>
          <NavLink
            to="/adminOrders"
            className="list-group-item list-group-item-actions"
            style={{width:170, marginLeft:10, marginBottom:5, borderRadius:20}}
          >
            <CreateIcon/>
            Track Orders
          </NavLink>
          <NavLink
            to="/slider"
            className="list-group-item list-group-item-actions"
            style={{width:170, marginLeft:10, marginBottom:5, borderRadius:20}}
          ><ImageIcon/>
            Slider
          </NavLink>  
          <NavLink
            to="/multisliders"
            className="list-group-item list-group-item-actions"
            style={{width:170, marginLeft:10, marginBottom:5, borderRadius:20}}
          ><ImageIcon/>
          Page Banner
          </NavLink>
          <NavLink
            to="/users"
            className="list-group-item list-group-item-actions"
            style={{width:170, marginLeft:10, marginBottom:100, borderRadius:20}}
          ><ImageIcon/>
          Users
          </NavLink>
        </div>
      </div>
        </Sider>
        <div
    className="side_dashboard"
    style={{
      backgroundColor: "whitesmoke",
      marginLeft: collapsed ? "80px" : "200px", // Adjust margin based on collapse state
      transition: "margin 0.2s",
      // overflowY: "auto", // Add scroll for overflow
      height: "100vh", // Set height to full viewport height
      marginTop:90,
    }}
  >        <AdminDashboard/>
        </div>
        </Layout>
        </div>
       </>
    )
}

export default Dashboard
