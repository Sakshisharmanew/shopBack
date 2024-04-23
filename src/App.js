import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminOrders from "./pages/Admin/AdminOrders";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Products from "./pages/Admin/Products";
import Slider from "./pages/Admin/slider";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import Users from "./pages/Admin/Users";
import { Header } from "antd/es/layout/layout";
import Navbar from "./pages/Admin/Navbar";
import MultiSlider from "./pages/Admin/MultiSlider";
import CreateSubcategory from "./pages/Admin/CreateSubcategory";
import SliderUpdate from "./pages/Admin/sliderUpdate";

function App() {
  const userData = JSON.parse(localStorage.getItem("admin")) || {};

  return (
    <Router>
      <Routes>
        {userData.token ? (
          <>
            {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/adminDashboard" element={<AdminOrders />} />
            <Route path="/adminOrders" element={<AdminOrders />} />
            <Route path="/createCategory" element={<CreateCategory />} />
            <Route path="/createProduct" element={<CreateProduct />} />
            <Route path="/products" element={<Products />} />
            <Route path="/slider" element={<Slider />} />
            <Route path="/update-slider/:id" element={<SliderUpdate />} />
            <Route path="/updateProduct/:slug" element={<UpdateProduct />} />
            <Route path="/users" element={<Users />} />
            <Route path="/header" element={<Header />} />
            <Route path="/navbar" element={<Navbar />} />
            <Route path="/multisliders" element={<MultiSlider />} />
            <Route path="/createsubcategory" element={<CreateSubcategory />} />
          </>
        ) : (
          <Route path="/login" element={<Login />} />
        )}
        <Route path="/*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
