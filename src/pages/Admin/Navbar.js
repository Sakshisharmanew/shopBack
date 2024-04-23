import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { Layout } from "antd";
import { toast } from "react-toastify";
import "../AdminCss/Navbar.css";
import { IoLogOutSharp } from "react-icons/io5";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const { Header } = Layout;

function Navbar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    confirmAlert({
      title: "Confirm logout",
      message: "Are you sure you want to log out?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            localStorage.removeItem("admin");
            navigate("/login");
            window.location.reload();
            toast.success("Logged out successfully!");
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  return (
    <>
      <Layout
        className="site-layout"
        style={{
          padding: 0,
          background: "white",
        }}
      >
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: 0,
            background: "whitesmoke",
            height: 90,
            borderBottom: "1px solid blacksmoke",
          }}
        >
          {/* <img src="download.png"  style={{height:70, width:150, marginTop:8,marginLeft:40}}/> */}
          <h3 style={{ marginTop: 30, marginLeft: 40, color: "#0dccea" }}>
            ADMIN
          </h3>

          <div className="d-flex gap-4 align-items-center">
            <div className="position-relative">
              <IoIosNotifications
                className="fs-4"
                style={{ height: 30, width: 30 }}
              />
              <span className="badge bg-warning rounded-circle p-1 position-absolute">
                3
              </span>
            </div>

            <div className="d-flex gap-3 align-items-center dropdown">
              <div>
                <img
                  width={52}
                  height={52}
                  style={{ borderRadius: 50 }}
                  src="images.jpg"
                  alt=""
                />
              </div>
              <div
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></div>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li>
                  <Link
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    to="/"
                  >
                    View Profile
                  </Link>
                </li>
              </div>
              {/* </div> */}
              <button className="button-77" onClick={handleLogout}>
                <img src="shutdown.png" className="logout_icon" />
                {/* <IoLogOutSharp /><br></br> */}
                {/* Logout */}
              </button>
              {/* <div> */}
            </div>
          </div>
        </Header>
      </Layout>
    </>
  );
}

export default Navbar;
