import React, { useState, useEffect } from "react";
import Layout from "../Admin/Layout";
import axios from "axios";
import { AiOutlineReload } from "react-icons/ai";
import toast from "react-hot-toast";
import * as mod from "../../utils/url";
import "../AdminCss/Products.css";
import { Link } from "react-router-dom";
import Homepage from "../../components/Homepage";
import Navbar from "./Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import { BsPencilFill } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import ReactPaginate from "react-paginate";
import { FcNext, FcPrevious } from "react-icons/fc";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const productsPerPage = 5;

  const productFilter = products.filter((product) => {
    const priceString = String(product.price);
    return (
      product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      priceString.toLowerCase().includes(searchValue.toLowerCase())
    );
  });
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handlePagination = (selectedPage) => {
    setPage(selectedPage);
  };

  useEffect(() => {
    if (page === 1) {
      getAllProducts();
    } else {
      loadMore();
    }
  }, [page]);

  //getall products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (page === 1) return;
  //   loadMore();
  // }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${mod.api_url}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllProducts();
    getTotal();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const { data } = await axios.delete(
        `${mod.api_url}/api/v1/product/delete-product/${productId}`
      );

      if (data.success) {
        toast.success(data.message);
        getAllProducts();
      } else {
        toast.error(data.message);
      }
      // navigate(`/updateProduct`);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
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
                style={{ marginLeft: "-33px", marginTop: "-32px" }}
              >
                <Homepage />
              </div>
              <div
                className="col-md-10"
                style={{ marginTop: 90, marginLeft: 30 }}
              >
                <form
                  className="d-flex"
                  role="search"
                  style={{ marginBottom: 10, justifyContent: "center" }}
                >
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search your product by name or by price"
                    aria-label="Search"
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                </form>

                <h1
                  className="text-center"
                  style={{ background: "whitesmoke", width: "1040px" }}
                >
                  All Products List
                </h1>

                <div
                  className="product_section_horizontal"
                  style={{ overflowY: "auto", width: "1040px" }}
                >
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Product</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Offers (%)</th>
                        <th>Quantity</th>
                        <th>colors</th>
                        <th>brand</th>
                        <th>ratting</th>
                        <th>size</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productFilter?.map((p, index) => (
                        <tr key={p._id}>
                          <td>{index + 1}</td>
                          <td>
                            {p?.images.length > 0 && (
                              <img
                                // src={require(`./../../img/produtImg/1703677926306-l2.png`)}
                                src={require(`../../../../client/src/img/produtImg/${p.images[0].filename}`)}
                                className="card-img-product productImage"
                                alt={p.name}
                              />
                            )}
                          </td>

                          <td>{p.name}</td>
                          <td>
                            {p.price} {p.currency}
                          </td>
                          <td>{p.offers}%</td>
                          <td>{p.quantity}</td>
                          <td>{p.colors}</td>
                          <td>{p.brand}</td>
                          <td>{p.ratting}</td>
                          <td>{p.size}</td>
                          <td>
                            <Link to={`/updateProduct/${p.slug}`}>
                              <button className="button-73">
                                <BsPencilFill className="icon_view" />
                              </button>
                            </Link>
                            <button
                              className="button-80"
                              onClick={() => {
                                confirmAlert({
                                  title: "Confirm yes or no",
                                  message: "Are you sure to delete this.",
                                  buttons: [
                                    {
                                      label: `Yes `,
                                      onClick: () => handleDelete(p._id),
                                    },
                                    {
                                      label: "No",
                                    },
                                  ],
                                });
                              }}
                            >
                              <MdDeleteForever className="icon_views" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <ReactPaginate
                  breakLabel="..."
                  nextLabel={<FcNext />}
                  onPageChange={(selectedPage) =>
                    handlePagination(selectedPage.selected + 1)
                  }
                  pageCount={Math.ceil(total / productsPerPage)}
                  previousLabel={<FcPrevious />}
                  containerClassName="pagination"
                  activeClassName="active"
                  nextClassName="next"
                  previousClassName="previous"
                  breakClassName="break"
                  pageClassName="page"
                  pageLinkClassName="page-link"
                  nextLinkClassName="next-link"
                  previousLinkClassName="previous-link"
                />
                {/* <div className="m-2 p-3 text-center">
                  {products && products.length < total && (
                    <button
                      className="btn loadmore"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(page + 1);
                      }}
                    >
                      {loading ? (
                        "Loading ..."
                      ) : (
                        <>
                          {" "}
                          Loadmore <AiOutlineReload />
                        </>
                      )}
                    </button>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
};

export default Products;
