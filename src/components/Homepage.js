import React, { useState } from "react";
import "./Homepage.css";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  AiOutlineDashboard,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineBgColors,
} from "react-icons/ai";
import { RiCouponLine } from "react-icons/ri";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, NavLink } from "react-router-dom";
import { Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import CreateIcon from "@mui/icons-material/Create";
import SettingsIcon from "@mui/icons-material/Settings";
import LuggageIcon from "@mui/icons-material/Luggage";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ImageIcon from "@mui/icons-material/Image";
import Navbar from "../pages/Admin/Navbar";

const { Header, Sider, Content } = Layout;

function Homepage() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  return (
    <>
      <div className="for_all_page">
        <div style={{ position: "fixed", width: "100%", zIndex: 1000 }}>
          <Navbar style={{ background: "white" }} />
        </div>
        <Layout className="container_contin">
          <div className="tabs_section"></div>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{
              background: "#454544",
              position: "fixed",
              height: "100%",
              marginTop: 70,
            }}
          >
            <div className="logo">
              <h1 className="text-white fs-5 text-center py-3">
                <span className="sm-logo"></span>
              </h1>
            </div>
            <div className="text">
              <div
                className="list-group dashboard-menu"
                style={{
                  overflow: "auto",
                  height: "550px",
                  top: 0,
                }}
              >
                <NavLink
                  to="/dashboard"
                  className="list-group-item list-group-item-actions"
                  style={{
                    width: 170,
                    marginLeft: 10,
                    marginBottom: 10,
                    borderRadius: 20,
                  }}
                >
                  <CreateIcon />
                  Dashboard
                </NavLink>
                <NavLink
                  to="/createCategory"
                  className="list-group-item list-group-item-actions"
                  style={{
                    width: 170,
                    marginLeft: 10,
                    marginBottom: 10,
                    borderRadius: 20,
                  }}
                >
                  <SettingsIcon />
                  Category
                </NavLink>
                <NavLink
                  to="/createsubcategory"
                  className="list-group-item list-group-item-actions"
                  style={{
                    width: 170,
                    marginLeft: 10,
                    marginBottom: 10,
                    borderRadius: 20,
                  }}
                >
                  <ImageIcon />
                  Sub Category
                </NavLink>
                <NavLink
                  to="/createProduct"
                  className="list-group-item list-group-item-actions"
                  style={{
                    width: 170,
                    marginLeft: 10,
                    marginBottom: 10,
                    borderRadius: 20,
                  }}
                >
                  <LuggageIcon />
                  createProduct
                </NavLink>

                <NavLink
                  to="/products"
                  className="list-group-item list-group-item-actions"
                  style={{
                    width: 170,
                    marginLeft: 10,
                    marginBottom: 10,
                    borderRadius: 20,
                  }}
                >
                  <GroupAddIcon />
                  products
                </NavLink>
                <NavLink
                  to="/adminOrders"
                  className="list-group-item list-group-item-actions"
                  style={{
                    width: 170,
                    marginLeft: 10,
                    marginBottom: 10,
                    borderRadius: 20,
                  }}
                >
                  <CreateIcon />
                  Track Orders
                </NavLink>
                <NavLink
                  to="/slider"
                  className="list-group-item list-group-item-actions"
                  style={{
                    width: 170,
                    marginLeft: 10,
                    marginBottom: 10,
                    borderRadius: 20,
                  }}
                >
                  <ImageIcon />
                  Slider
                </NavLink>
                <NavLink
                  to="/multisliders"
                  className="list-group-item list-group-item-actions"
                  style={{
                    width: 170,
                    marginLeft: 10,
                    marginBottom: 10,
                    borderRadius: 20,
                  }}
                >
                  <ImageIcon />
                  Page Banner
                </NavLink>
                <NavLink
                  to="/users"
                  className="list-group-item list-group-item-actions"
                  style={{
                    width: 170,
                    marginLeft: 10,
                    marginBottom: 100,
                    borderRadius: 20,
                  }}
                >
                  <ImageIcon />
                  Users
                </NavLink>
              </div>
            </div>
          </Sider>
        </Layout>
      </div>
    </>
  );
}

export default Homepage;
