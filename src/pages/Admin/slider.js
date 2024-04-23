import React, { useEffect, useState } from "react";
import "../../pages/AdminCss/slider.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import Layout from "../Admin/Layout";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { TextField } from "@mui/material";
import Popup from "reactjs-popup";
import { Link, useNavigate } from "react-router-dom";
import * as mod from "../../utils/url";
import Homepage from "../../components/Homepage";
import Navbar from "./Navbar";
import { Table } from "react-bootstrap";
import { BsPencilFill } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css"; // Include Bootstrap CSS

const Slider = () => {
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();

    if (title !== "" && des !== "" && subTitle !== "") {
      try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("des", des);
        formData.append("subTitle", subTitle);
        formData.append("photo", photo);
        const { data } = await axios.post(
          `${mod.api_url}/api/v1/slider/slider`,
          formData
        );
        if (data?.success) {
          toast.success(data?.message);
          // Clear form fields and selected image after successful upload
          setTitle("");
          setDes("");
          setSubTitle("");
          setPhoto(null);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while uploading.");
      }
    } else {
      toast.error("Please fill in all fields and select an image.");
    }
  };
  const getSlider = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/slider/get-slider`
      );
      if (data.success) {
        // Pass the data to setUploadedData
        setUploadedData(data.sliderData); // Assuming your API response has a "sliderData" property
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting the slider data");
    }
  };
  useEffect(() => {
    getSlider();
  }, []);
  //delete slider name
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${mod.api_url}/api/v1/slider/delete-slider/${id}`
      );

      if (data.success) {
        toast.success(data.message);
        getSlider();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("not deleted this slider");
    }
  };

  return (
    <>
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
                style={{ marginTop: 90, marginLeft: 200 }}
              >
                <h3
                  className="m-2 text-center"
                  style={{ background: "gray", padding: 5, marginBottom: 10 }}
                >
                  Slider Image
                </h3>
                <div className="row m-2">
                  <div className="col-6">
                    <TextField
                      type="text"
                      name="title"
                      id="outlined-basic"
                      label="Title"
                      variant="outlined"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="col-6 description">
                    <TextField
                      type="text"
                      name="des"
                      id="outlined-basic"
                      label="Description"
                      variant="outlined"
                      value={des}
                      onChange={(e) => setDes(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row m-2">
                  <div className="col-6">
                    <TextField
                      type="text"
                      name="subTitle"
                      id="outlined-basic"
                      label="Subtitle"
                      variant="outlined"
                      value={subTitle}
                      onChange={(e) => setSubTitle(e.target.value)}
                    />
                  </div>
                  <div className="col-6">
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
                  <div className="mb-3">
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
                    onClick={handleUpload}
                  >
                    Upload Slider
                  </button>
                </div>

                <hr />
                <div className="swiper-container">
                  <div className=" d-flex flex-column align-items-start">
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th scope="col">Image</th>
                          <th scope="col">Title</th>
                          <th scope="col">Subtitle</th>
                          <th scope="col">Description</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploadedData &&
                          uploadedData.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <img
                                  src={`${mod.api_url}/api/v1/slider/get-slider/${item._id}`}
                                  alt="Uploaded"
                                  style={{ width: 100 }}
                                />
                              </td>
                              <td>{item.title.substring(0, 70)}</td>
                              <td>{item.subTitle.substring(0, 50)}</td>
                              <td>{item.des.substring(0, 18)}</td>
                              <td>
                                <button
                                  className="btn btn-danger ms-2 "
                                  style={{ marginBottom: 2 }}
                                  onClick={() => {
                                    confirmAlert({
                                      title: "Confirm yes or no",
                                      message: "Are you sure to delete this?",
                                      buttons: [
                                        {
                                          label: `Yes `,
                                          onClick: () => handleDelete(item._id),
                                        },
                                        {
                                          label: "No",
                                        },
                                      ],
                                    });
                                  }}
                                >
                                  <MdDeleteForever />
                                </button>

                                <button
                                  className="btn btn-primary ms-2"
                                  onClick={() =>
                                    navigate(`/update-slider/${item._id}`)
                                  }
                                  // onClick={handleEdit(item._id)}
                                >
                                  {" "}
                                  <BsPencilFill />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
};

export default Slider;
