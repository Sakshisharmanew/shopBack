import React, { useState, useEffect } from "react";
import "../../pages/AdminCss/CreateProduct.css";
import Layout from "../Admin/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import * as mod from "../../utils/url";
import Homepage from "../../components/Homepage";
import { MdProductionQuantityLimits } from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { IoIosColorPalette } from "react-icons/io";
import { TbBrandStorybook } from "react-icons/tb";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TiPlus } from "react-icons/ti"; // Replace with the appropriate icon for product size
import { FaStar } from "react-icons/fa";

const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("");
  const [category, setCategory] = useState("");
  const [offers, setOffers] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState([]);
  const [offerDate, setOfferDate] = useState("");
  const [brand, setBrand] = useState("");
  const [formattedDeleverydate, setFormattedDeleverydate] = useState(null);
  const [colors, setColors] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rating, setRating] = useState(0);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategory, setSubcategory] = useState("");
  // console.log(subcategory, "subcategory");
  const handleFileChange = (e) => {
    const selectedImages = e.target.files;
    setSelectedFiles([...selectedFiles, ...selectedImages]);

    const previews = Array.from(selectedImages).map((image) =>
      URL.createObjectURL(image)
    );
    setSelectedImagePreviews([...selectedImagePreviews, ...previews]);
  };

  const handleDeleteImage = (index) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...selectedImagePreviews];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setSelectedFiles(updatedFiles);
    setSelectedImagePreviews(updatedPreviews);
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Create product function
  const handleCreate = async (e) => {
    e.preventDefault();

    if (
      name !== "" &&
      description !== "" &&
      price !== "" &&
      selectedFiles.length > 0 &&
      category !== "" &&
      currency !== ""
    ) {
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
        productData.append("deleverydate", formattedDeleverydate);
        productData.append("brand", brand);
        productData.append("size", size);
        productData.append("quantity", quantity);
        productData.append("ratting", rating);
        productData.append("offerDate", offerDate);

        for (let i = 0; i < selectedFiles.length; i++) {
          productData.append("images", selectedFiles[i]);
        }

        const { data } = await axios.post(
          `${mod.api_url}/api/v1/product/create-product`,
          productData
        );

        if (data?.success) {
          toast.success(data?.message);

          // Clear form fields after successful creation
          setName("");
          setDescription("");
          setPrice("");
          setCurrency("");
          setCategory("");
          setSubcategory("");
          setColors("");
          setOffers("");
          setSelectedFiles([]);
          setSelectedImagePreviews([]);

          // Delay for 3 seconds and then refresh the page
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          toast.error("Product not created");
        }
      } catch (error) {
        console.error(error);
        toast.error("Product not created");
      }
    } else {
      toast.error("Please fill in all fields");
    }
  };

  //handle product size
  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  //handle start rating
  // const handleStarClick = (e) => {
  //   setRating(e.target.value);
  // };
  const fetchSubcategories = async () => {
    try {
      // Fetch subcategories based on the category state
      const response = await axios.get(
        `${mod.api_url}/api/v1/subCategory/subcategry/${category}`
      );

      setSubcategories(response.data.subcategories);
      setSubcategory("");
    } catch (error) {
      // toast.error( "Error fetching subcategories");
    }
  };
  useEffect(() => {
    fetchSubcategories();
  }, [category]); // Re-run the effect when the category state changes

  return (
    <>
      <div className="for_all_page">
        <Layout title={"Dashboard - Create Product"}>
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
                style={{ marginTop: 50, marginLeft: 200 }}
              >
                <h1 style={{ backgroundColor: "white", marginTop: 10 }}>
                  Create Product
                </h1>
                <div className="row">
                  <div className="col-6">
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
                  <div className="col-6">
                    <label>SubCategories</label>
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
                  <div className="row">
                    <div className="col-12">
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
                  </div>
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
                    <label>Product Name</label>
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
                  <label>Price</label>
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
                    <label>Currency</label>

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
                    <label>Brand</label>
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
                    <label>Delevery Date</label>

                    <select
                      className="mb-3 form-control"
                      value={formattedDeleverydate}
                      onChange={(e) => setFormattedDeleverydate(e.target.value)}
                      placeholderText="Select delivery Date"
                    >
                      <option value="">Delivery Date</option>
                      <option value="1-3 days">1-3 Days</option>
                      <option value="3-5 days">3-5 Days</option>
                      <option value="5-7 days">5-7 Days</option>
                      <option value="7-9 days">7-9 Days</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <label>Color</label>

                    <select
                      className="mb-3 form-control"
                      onChange={(e) => setColors(e.target.value)}
                      placeholder="Select product"
                      required
                      value={colors}
                    >
                      <option>Colors</option>
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
                    <label>Size</label>
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
                    <label style={{ paddingLeft: "10px" }}>Offer Valid</label>
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
                      style={{ paddingLeft: "10px" }}
                    />
                  </div>
                  <div className="col-6">
                    <label> Quantity</label>
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
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: 10 }}
                      onClick={handleCreate}
                    >
                      CREATE PRODUCT
                    </button>
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

export default CreateProduct;
