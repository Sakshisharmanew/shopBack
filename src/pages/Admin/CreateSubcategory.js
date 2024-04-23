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
import { useNavigate } from "react-router-dom";
import { Select } from "antd";

const { Option } = Select;

const CreateSubcategory = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedCategory, setUpdatedCategory] = useState("");
  const navigate = useNavigate();

  //handle form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name !== "" && category !== "") {
      try {
        const requestData = {
          name: name,
          category: category,
        };

        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const { data } = await axios.post(
          `${mod.api_url}/api/v1/subCategory/subcategories`,
          requestData,
          config
        );

        if (data?.success) {
          toast.success(`${name} is created`);
        }
        getAllSubCategory();

        // console.log("Category:", category);
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Please fill in all fields");
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
        setName("");
      }
    } catch (error) {
      console.log(error);
      toast.error("somthing went wrong in getting category");
    }
  };
  // get all Subcategories
  const getAllSubCategory = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/subCategory/subcategories`
      );
      // console.log(data.subcategories, "data");
      if (data.success) {
        setSubCategories(data.subcategories); // this categories name gate from api
      }
    } catch (error) {
      console.log(error);
      toast.error("somthing went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
    getAllSubCategory();
  }, []);

  //update value or edit
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const requestUpatedData = {
        name: updatedName,
        category: updatedCategory,
      };

      const { data } = await axios.put(
        `${mod.api_url}/api/v1/subCategory/subcategories/${selected._id}`,
        requestUpatedData,
        {
          headers: {
            "Content-Type": "application/json", // Adjust the content type if needed
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAllSubCategory();
        setSelected(null);
        setUpdatedName("");
        setUpdatedCategory("");
        setVisible(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("not Updated this name is available");
    }
  };

  //delete category name
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${mod.api_url}/api/v1/subCategory/subcategories/${id}`
      );

      if (data.success) {
        toast.success(data.message);
        getAllSubCategory();
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
                <h1 className="text-center">Create Sub Category</h1>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-6">
                      <Select
                        bordered={false}
                        placeholder="Select a category"
                        size="large"
                        showSearch
                        className="form-select mb-3"
                        onChange={(value) => {
                          setCategory(value);
                        }}
                        value={category}
                      >
                        {categories?.map((c) => (
                          <Option key={c._id} value={c._id}>
                            {c.name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="col-6">
                      <span className="files">
                        <CategoryForm
                          type="text"
                          value={name}
                          handleSubmit={handleSubmit}
                          setValue={setName}
                        />
                      </span>
                    </div>
                  </div>
                </div>
                <hr />
                <div>
                  <Table
                    striped
                    bordered
                    hover
                    responsive
                    className="tbale-category"
                  >
                    <thead>
                      <tr>
                        <th scope="col">Category</th>
                        <th scope="col">Sub-category</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subcategories &&
                        subcategories?.map((c, index) => (
                          <tr key={c._id}>
                            <td>{c.category}</td>
                            <td>{c.name}</td>
                            <td>
                              <button
                                className="btn btn-success ms-2"
                                onClick={() => {
                                  setVisible(true);
                                  setUpdatedName(c.name);
                                  setUpdatedCategory(c.category);
                                  setSelected(c);
                                }}
                              >
                                <BsPencilFill />
                              </button>
                              <button
                                className="btn btn-danger ms-2"
                                onClick={() => {
                                  confirmAlert({
                                    title: "Confirm yes or no",
                                    message: "Are you sure to delete this.",
                                    buttons: [
                                      {
                                        label: `Yes `,
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
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              </div>
              <Modal
                onCancel={() => setVisible(false)}
                footer={null}
                visible={visible}
              >
                <Select
                  bordered={false}
                  placeholder="Select a category"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setUpdatedCategory(value);
                  }}
                  value={updatedCategory}
                  style={{ width: "50%" }}
                >
                  {categories?.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
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

export default CreateSubcategory;
