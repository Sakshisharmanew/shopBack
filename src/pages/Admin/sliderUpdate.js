import React, { useEffect, useState } from "react";
import "../../pages/AdminCss/slider.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import Layout from "../Admin/Layout";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { TextField } from "@mui/material";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import * as mod from "../../utils/url";
import Homepage from "../../components/Homepage";
import Navbar from "./Navbar";

import "bootstrap/dist/css/bootstrap.min.css"; // Include Bootstrap CSS

const SliderUpdate = () => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [des, setDes] = useState("");
  const [photo, setPhoto] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  const getSingleslider = async (id) => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/slider/getSingle-slider/${params.id}`
      );
      setTitle(data.data.title);
      setSubTitle(data.data.subTitle);
      setDes(data.data.des);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSingleslider();
    //eslint-disable-next-line
  }, []);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("des", des);
    formData.append("photo", photo);

    try {
      const response = await axios.put(
        `${mod.api_url}/api/v1/slider/update-slider/${params.id}`,
        formData
      );

      if (response.data.success) {
        // Handle success, maybe redirect or show a success message
        toast.success("Slider updated successfully");
        navigate("/slider");
      } else {
        // Handle failure, show an error message
        toast.error("Error updating slider");
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network error or other issues
    }
  };

  return (
    <div className="for_all_page">
      <Layout>
        <div className="container m-3 p-3 dashboard">
          <div className="row">
            <div
              className="col-md-2"
              style={{ marginLeft: "-32px", marginTop: "-32px" }}
            >
              <Homepage />
            </div>
            <div
              className="col-md-10"
              style={{ marginTop: 90, marginLeft: 30 }}
            >
              <h3
                className="m-2 text-center"
                style={{ background: "gray", padding: 5, marginBottom: 10 }}
              >
                Update Slider Image
              </h3>{" "}
              <div className="container row">
                <TextField
                  className="col-4 m-2"
                  type="text"
                  value={title}
                  name="title"
                  id="outlined-basic"
                  onChange={(e) => setTitle(e.target.value)}
                  label="Title"
                  variant="outlined"
                />
                <TextField
                  className="col-4 m-2"
                  value={des}
                  onChange={(e) => setDes(e.target.value)}
                  type="text"
                  name="des"
                  id="outlined-basic"
                  label="Description"
                  variant="outlined"
                />
                <TextField
                  className="col-4 m-2"
                  onChange={(e) => setSubTitle(e.target.value)}
                  value={subTitle}
                  type="text"
                  name="subTitle"
                  id="outlined-basic"
                  label="Subtitle"
                  variant="outlined"
                />
                <div className="col-6 m-2">
                  <label className="">
                    {photo ? photo.name : ""}
                    <TextField
                      type="file"
                      name="photo"
                      onChange={(e) => setPhoto(e.target.files[0])}
                      accept=".jpg, .jpeg, .png"
                      id="outlined-basic"
                      variant="outlined"
                    />
                  </label>
                </div>
                <div className="mb-3 m-2">
                  {photo && (
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="Product photo"
                        height={"200px"}
                        className="img img-responsive"
                      />
                    </div>
                  )}
                </div>
                <button
                  className="button-79 "
                  style={{ marginTop: 10 }}
                  onClick={handleSubmit}
                >
                  Update Slider
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};
export default SliderUpdate;
