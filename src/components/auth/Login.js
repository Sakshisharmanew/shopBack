import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./../contexts/contextProvider";
import * as mod from "./../../utils/url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AuthStyle.css";

const Login = () => {
  const { setAuth, auth } = useAuth();
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${mod.api_url}/api/v1/auth/login`, {
        phoneOrEmail,
        password,
      });

      if (res.data.success) {
        if (res.data.user.role === 1) {
          toast.success(res.data.message);
          setAuth({
            ...auth,
            user: res.data.user,
            token: res.data.token,
          });
          localStorage.setItem("admin", JSON.stringify(res.data));
          navigate("/dashboard");
          window.location.reload();

        } else {
          toast.error("You are not authorized. Only admins can log in.");
        }
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
<>
<div>
        <div className="login_page">
        <h2 className="text-center">Admin Panel For Manage All Data</h2>
          <div className="wrapper">
            <div className="title_head">Login Form</div>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <input
                  type="text"
                  autoFocus
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="form-control"
                  id="phone-input"
                  label="mobile"
                  variant="outlined"
                  required
                />
                <label>Phone</label>
              </div>

              <div className="field">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  id="password-input"
                  label="Password"
                  variant="outlined"
                  required
                />
                <label>Password</label>
              </div>

              <div className="field">
                <input type="submit" value="Login" />
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
    </div>
</>
  );
};

export default Login;


