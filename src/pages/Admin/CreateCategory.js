import React, { useEffect, useState } from "react";
import Layout from "../Admin/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../Admin/CategoryForm";
import { Modal } from "antd";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { TextField } from "@mui/material";
import * as mod from "../../utils/url";
import "../AdminCss/CreateCategory.css";
import Homepage from "../../components/Homepage";
import Navbar from "./Navbar";
import { Table } from "react-bootstrap";
import { BsPencilFill } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedPhoto, setUpdatedPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [viewType, setViewType] = useState("list"); // 'list' or 'card'

  const handleToggleView = () => {
    setViewType((prevType) => (prevType === "list" ? "card" : "list"));
  };

  const navigate = useNavigate();

  //handle form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const existingCategory = categories.find((item) => item.name === name);

      if (existingCategory) {
        toast.error("Category already exists");
      } else {
        const formData = new FormData();
        formData.append("photo", photo);
        formData.append("name", name);

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            // Include any other headers or authentication tokens if needed
          },
        };

        const { data } = await axios.post(
          `${mod.api_url}/api/v1/category/create-category`,
          formData
        );

        if (data?.success) {
          toast.success(`${name} is created`);
          window.location.reload();
          getAllCategory();

          // Clear the form fields here if needed
        } else {
          toast.error(data.message || "Failed to create category");
        }
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized. Please log in.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  // get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/category/get-category`
      );
      if (data.success) {
        setCategories(data.category); // this categories name gate from api
        setPhoto(null);
        setName("");
      }
    } catch (error) {
      console.log(error);
      toast.error("somthing went wrong in getting category");
    }
  };
  useEffect(() => {
    getAllCategory();
  }, []);

  //update value or edit

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updatedFormdata = new FormData();
      updatedFormdata.append("name", updatedName);
      if (updatedPhoto) {
        updatedFormdata.append("photo", updatedPhoto);
      }

      const response = await axios.put(
        `${mod.api_url}/api/v1/category/update-category/${selected._id}`,
        updatedFormdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data; // Use response.data to get the response data

      console.log(updatedFormdata, "updatedFormdata");

      if (data.success) {
        toast.success(data.message);
        setSelected(null);
        setUpdatedName("");
        setUpdatedPhoto("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // Handle specific error scenarios if needed
      if (error.response) {
        // The request was made and the server responded with a status code
        // other than 2xx (success)
        console.error("Response error:", error.response.data);
        toast.error("Failed to update category. Please try again.");
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
        toast.error("No response received from the server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Request setup error:", error.message);
        toast.error("Error setting up the request.");
      }
    }
  };

  //delete category name
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${mod.api_url}/api/v1/category/delete-category/${id}`
      );

      if (data.success) {
        toast.success(data.message);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("not deleted this category");
    }
  };

  return (
    <>
      <div className="for_all_page">
        <Layout>
          <div className="mt-3 dashboard">
            <div className="row">
              <div className="col-md-2 " style={{ marginTop: "-16px" }}>
                <Homepage />
              </div>
              <div
                className="col-md-10"
                style={{ marginTop: 90, marginLeft: 220 }}
              >
                <h1 className="text-center">Create Category</h1>
                <div
                  className="p-3 w-100  file_selelct"
                  style={{ marginLeft: "150px" }}
                >
                  <span className="file">
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
                  </span>
                  <span className="files">
                    <CategoryForm
                      handleSubmit={handleSubmit}
                      value={name}
                      setValue={setName}
                    />
                  </span>
                </div>
                <div>
                  <button
                    className="btn btn-primary mb-2"
                    onClick={handleToggleView}
                  >
                    {viewType === "list"
                      ? "Switch to Card View"
                      : "Switch to List View"}
                  </button>

                  {viewType === "list" ? (
                    <Table
                      striped
                      bordered
                      hover
                      responsive
                      className="table-category"
                    >
                      <thead>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories?.map((c, index) => (
                          <tr key={c._id}>
                            <td>
                              {" "}
                              <img
                                src={`${mod.api_url}/api/v1/category/singlePhoto-category/${c._id}`}
                                alt="Uploaded"
                                className="card-img-top"
                                style={{ width: "80px", height: "50px" }}
                              />
                            </td>
                            <td>{c.name}</td>
                            <td>
                              <div className="btn-actions">
                                <button
                                  className="btn btn-success m-1"
                                  onClick={() => {
                                    setVisible(true);
                                    setUpdatedName(c.name);
                                    setSelected(c);
                                  }}
                                >
                                  <BsPencilFill /> Edit
                                </button>
                                <button
                                  className="btn btn-danger m-1"
                                  onClick={() => {
                                    confirmAlert({
                                      title: "Confirm yes or no",
                                      message: "Are you sure to delete this.",
                                      buttons: [
                                        {
                                          label: "Yes",
                                          onClick: () => handleDelete(c._id),
                                        },
                                        {
                                          label: "No",
                                        },
                                      ],
                                    });
                                  }}
                                >
                                  <MdDeleteForever /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="card-container">
                      {categories?.map((c, index) => (
                        <div key={c.id} className="card mb-3">
                          <img
                            src={`${mod.api_url}/api/v1/category/singlePhoto-category/${c._id}`}
                            alt="Uploaded"
                            className=" text-center card-img-top"
                            style={{
                              width: "100%",
                              height: "100px",
                              borderBottom: "1px solid whitesmoke",
                              padding: "10px",
                            }}
                          />
                          <div className="card-body">
                            <h5 className=" text-center card-title ">
                              {c.name}
                            </h5>
                            <div className="btn-actions">
                              <button
                                className="btn btn-success m-2"
                                onClick={() => {
                                  setVisible(true);
                                  setUpdatedName(c.name);
                                  setSelected(c);
                                }}
                              >
                                <BsPencilFill />
                              </button>
                              <button
                                className="btn btn-danger m-2"
                                onClick={() => {
                                  confirmAlert({
                                    title: "Confirm yes or no",
                                    message: "Are you sure to delete this.",
                                    buttons: [
                                      {
                                        label: "Yes",
                                        onClick: () => handleDelete(c._id),
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
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Modal
                onCancel={() => setVisible(false)}
                footer={null}
                visible={visible}
              >
                <div className="col-6">
                  <label className="">
                    {photo ? photo.name : ""}
                    <TextField
                      type="file"
                      name="photo"
                      onChange={(e) => setUpdatedPhoto(e.target.files[0])}
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
                <CategoryForm
                  value={updatedName}
                  setValue={setUpdatedName}
                  handleSubmit={handleUpdate}
                />
              </Modal>
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
};

export default CreateCategory;
