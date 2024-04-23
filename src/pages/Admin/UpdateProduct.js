import React, { useState, useEffect } from "react";
import Layout from "../Admin/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import
import * as mod from "../../utils/url";
import "../../pages/AdminCss/UpdateProduct.css";
import Homepage from "../../components/Homepage";
// import Navbar from "./Navbar";
// import { IoIosColorPalette } from "react-icons/io";
// import { TbBrandStorybook } from "react-icons/tb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { TiPlus } from "react-icons/ti"; // Replace with the appropriate icon for product size
// import { FaStar } from "react-icons/fa";
// import { MdProductionQuantityLimits } from "react-icons/md";

const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [offers, setOffers] = useState("");
  const [id, setId] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState([]);
  const [offerDate, setOfferDate] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rating, setRating] = useState(0);
  const [brand, setBrand] = useState("");
  const [deleverydate, setDeleverydate] = useState(null);
  const [colors, setColors] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [subcategory, setSubcategory] = useState("");

  //get single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/product/get-product/${params.slug}`
      );
      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setCurrency(data.product.currency);
      setQuantity(data.product.quantity);
      setOffers(data.product.offers);
      setCategory(data.product.category._id);
      setSubcategory(data.product.subcategory._id);
      setSize(data.product.size);
      setColors(data.product.colors);
      setDeleverydate(data.product.deleverydate);
      setRating(data.product.ratting);
      setSelectedFiles(data.product.images.map((img) => img));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSingleProduct();
    //eslint-disable-next-line
  }, []);
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
        fetchSubcategories();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something wwent wrong in getting catgeory");
    }
  };
  const fetchSubcategories = async () => {
    try {
      // Fetch subcategories based on the category state
      const response = await axios.get(
        `${mod.api_url}/api/v1/subCategory/subcategry/${category}`
      );
      setSubcategories(response.data.subcategories);
      // setSubcategory("");
    } catch (error) {
      // toast.error(error.message || "Error fetching subcategories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, [category]);

  //create product function
  const handleUpdate = async (e) => {
    e.preventDefault();
    confirmAlert({
      title: "Confirm yes or no",
      message: "Are you sure to update your details.",
      buttons: [
        {
          label: `Yes `,
          onClick: async () => {
            try {
              const productData = new FormData();
              productData.append("name", name);
              productData.append("description", description);
              productData.append("price", price);
              productData.append("currency", currency);
              productData.append("offers", offers);
              productData.append("category", category);
              productData.append("subcategory", subcategory);
              productData.append("colors", colors);
              productData.append("deleverydate", deleverydate);
              productData.append("brand", brand);
              productData.append("size", size);
              productData.append("quantity", quantity);
              productData.append("ratting", rating);
              productData.append("offerDate", offerDate);
              for (let i = 0; i < selectedFiles.length; i++) {
                productData.append("images", selectedFiles[i]);
              }
              const { data } = axios.put(
                `${mod.api_url}/api/v1/product/update-product/${id}`,
                productData,
                { new: true }
              );
              if (data?.success) {
                toast.error(data?.message);
              } else {
                toast.success("Product Updated Successfully");
                navigate("/products");
              }
            } catch (error) {
              console.log(error);
              toast.error("something went wrong");
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleFileChange = (e) => {
    const selectedImages = e.target.files;
    setSelectedFiles([...selectedFiles, ...selectedImages]);

    // Generate previews for the selected images
    const previews = Array.from(selectedImages).map((image) =>
      URL.createObjectURL(image)
    );
    setSelectedImagePreviews([...selectedImagePreviews, ...previews]);
  };

  //delete preview image
  const handleDeleteImage = (index) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...selectedImagePreviews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    // Update the state with the new arrays
    setSelectedFiles(updatedFiles);
    setSelectedImagePreviews(updatedPreviews);
  };

  //delete a product
  const handleDelete = async () => {
    try {
      let answer = window.prompt("Are You Sure want to delete this product ? ");
      if (!answer) return;
      const { data } = await axios.delete(
        `${mod.api_url}/api/v1/product/delete-product/${id}`
      );
      toast.success("Product DEleted Succfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  //handle product size
  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  return (
    <>
      <div className="for_all_page">
        <Layout title={"Dashboard - Create Product"}>
          <div className="container-fluid mt-4">
            <div className="row">
              <div
                className="col-md-2"
                style={{ marginLeft: "-12px", marginTop: "-24px" }}
              >
                <Homepage />
              </div>
              <div className="col-md-10 " style={{ marginTop: 90 }}>
                <h1
                  className="text-center"
                  style={{ backgroundColor: "white" }}
                >
                  Update Products
                </h1>

                <div className="m-1 w-100">
                  <div className="row">
                    <div className="col-4">
                      <label>Category</label>
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
                    <div className="col-4">
                      <label>SubCategoriesCategory</label>
                      <Select
                        bordered={false}
                        placeholder="Select a sub category"
                        size="large"
                        showSearch
                        className="form-select mb-3"
                        onChange={(value) => {
                          setSubcategory(value);
                        }}
                        value={subcategory}
                      >
                        {subcategories?.map((subc) => (
                          <Option key={subc._id} value={subc._id}>
                            {subc.name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="col-4">
                      product image
                      <label className="btn btn-outline-secondary col-md-12">
                        <input
                          type="file"
                          accept=".jpg, .jpeg, .png"
                          id="outlined-basic"
                          variant="outlined"
                          onChange={handleFileChange}
                          multiple
                        />
                      </label>
                    </div>
                    <ul>
                      {selectedFiles.map((file, index) => (
                        <li key={index}>Filename: {file.filename}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-3"></div>
                  {selectedImagePreviews.length > 0 && (
                    <div className="mb-3">
                      <h5>Selected Images:</h5>
                      {selectedImagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <img
                            src={preview}
                            alt={`Selected ${index + 1}`}
                            style={{
                              width: "100px",
                              marginRight: "10px",
                              marginBottom: "10px",
                            }}
                          />
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteImage(index)}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="row">
                    <div className="col-6">
                      <label>Product name</label>
                      <input
                        type="text"
                        value={name}
                        placeholder="write a name"
                        className="form-control"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="col-6">
                      <label>% Off price</label>
                      <input
                        type="number"
                        value={offers}
                        placeholder="%  write your Offers"
                        className="form-control"
                        onChange={(e) => setOffers(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label>Description</label>
                    <textarea
                      type="text"
                      value={description}
                      placeholder="write a description"
                      className="form-control"
                      onChange={(e) => setDescription(e.target.value)}
                      style={{ height: 200 }}
                    />
                  </div>
                  <div className="row">
                    <label>Product Price</label>
                    <div className="col-6">
                      <div className="mb-3">
                        <input
                          type="number"
                          value={price}
                          placeholder="write a Price"
                          className="form-control"
                          onChange={(e) => setPrice(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <label>Product currency</label>

                      <select
                        className="mb-3 form-control"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        required
                      >
                        <option value="$">USD </option>
                        <option value="€">Euro </option>
                        <option value="£">AUD </option>
                        <option value="₹">Indian Rupee </option>
                        <option value="AED">United Arab Emirates</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label>product Brand</label>
                      <input
                        type="text"
                        value={brand}
                        placeholder="Brand Name"
                        className="form-control"
                        onChange={(e) => setBrand(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label>Delevery provide within date</label>

                      <select
                        className="mb-3 form-control"
                        value={deleverydate}
                        onChange={(e) => setDeleverydate(e.target.value)}
                        placeholderText="Select delivery Date"
                      >
                        <option value="">Product Delivery Date</option>
                        <option value="1-3 days">1-3 Days</option>
                        <option value="3-5 days">3-5 Days</option>
                        <option value="5-7 days">5-7 Days</option>
                        <option value="7-9 days">7-9 Days</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label>Product color</label>
                      {/* <IoIosColorPalette
                        style={{
                          width: "40px",
                          height: "40px",
                          marginRight: "10px",
                          marginBottom: "17px",
                        }}
                      /> */}
                      <select
                        className="mb-3 form-control"
                        onChange={(e) => setColors(e.target.value)}
                        placeholder="Select product"
                        required
                        value={colors}
                      >
                        <option>Select Colors</option>
                        <option value="red">Red</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="yellow">Yellow</option>
                        <option value="orange">Orange</option>
                        <option value="purple">Purple</option>
                        <option value="pink">Pink</option>
                        <option value="brown">Brown</option>
                        <option value="gray">Gray</option>
                        <option value="black">Black</option>
                        <option value="white">White</option>
                        <option value="cyan">Cyan</option>
                        <option value="magenta">Magenta</option>
                        <option value="lime">Lime</option>
                        <option value="teal">Teal</option>
                        <option value="lavender">Lavender</option>
                        <option value="maroon">Maroon</option>
                        <option value="navy">Navy</option>
                        <option value="olive">Olive</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label>Select Your Product Size</label>
                      <select
                        className="mb-3 form-control"
                        value={size}
                        onChange={handleSizeChange}
                        placeholder="Select size"
                        required
                      >
                        {/* <option value=""></option> */}
                        <option value="S">Small</option>
                        <option value="M">Medium</option>
                        <option value="L">Large</option>
                        <option value="XL">Extra Large</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label>Offer valid</label>
                      <DatePicker
                        selected={offerDate}
                        onChange={(date) => setOfferDate(date)}
                        className="mb-3 form-control"
                        placeholderText="Select Offer Date"
                        dateFormat="MMMM d, yyyy"
                        isClearable
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={5}
                      />
                    </div>
                    <div className="col-6">
                      <label>Product Quantity</label>
                      <input
                        type="number"
                        value={quantity}
                        placeholder="Enter Product Quantity"
                        className="form-control"
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label>Product Rating</label>
                      <select
                        className="mb-3 form-control"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        placeholder="product Ratting"
                        required
                      >
                        <option value="">Product Ratting</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                    </div>
                    <div className="col-6"></div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="mb-3">
                        <button
                          className="btn btn-primary"
                          onClick={handleUpdate}
                        >
                          UPDATE PRODUCT
                        </button>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="mb-3">
                        <button
                          className="btn btn-danger"
                          onClick={handleDelete}
                        >
                          DELETE PRODUCT
                        </button>
                      </div>
                    </div>
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

export default UpdateProduct;
