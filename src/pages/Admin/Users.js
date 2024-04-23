import React, { useEffect, useState } from "react";
import Layout from "../Admin/Layout";
import axios from "axios";
import * as mod from "../../utils/url";
import "../AdminCss/Users.css";
import Homepage from "../../components/Homepage";
import { Table } from "react-bootstrap";
import { FcSearch } from "react-icons/fc";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [itemOffset, setItemOffset] = useState(0);

  const blockUser = async (userId) => {
    try {
      const response = await axios.put(
        `${mod.api_url}/api/v1/auth/user/${userId}/block`
      );
      toast.success(response.data.message);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, blocked: true } : user
        )
      );
    } catch (error) {
      toast.error(`Error blocking user: ${error.response.data.message}`);
    }
  };

  const unblockUser = async (userId) => {
    try {
      const response = await axios.put(
        `${mod.api_url}/api/v1/auth/user/${userId}/unblock`
      );
      toast.success(response.data.message);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, blocked: false } : user
        )
      );
    } catch (error) {
      toast.error(`Error unblocking user: ${error.response.data.message}`);
    }
  };

  const getallUsers = async () => {
    try {
      const { data } = await axios.get(`${mod.api_url}/api/v1/auth/users`);
      if (data?.success) {
        setUsers(data?.users);
      } else {
        setError(data?.message || "An error occurred");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const priceString = String(user.phone);
    return (
      user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      priceString.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    getallUsers();
  }, []);

  const endOffset = itemOffset + 5;
  const currentUsers = filteredUsers.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredUsers.length / 5);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * 5) % filteredUsers.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <div className="for_all_page">
        <Layout>
          <div className="container m-1 p-1 dashboard">
            <div className="row">
              <div
                className="col-md-2"
                style={{ marginLeft: "-8px", marginTop: "-8px" }}
              >
                <Homepage />
              </div>
              <div
                className="col-md-10"
                style={{ marginTop: "100px", marginLeft: 278 }}
              >
                <h1 style={{ textAlign: "center" }}>Registered User</h1>
                <form
                  className="d-flex"
                  role="search"
                  style={{ marginBottom: 10 }}
                >
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search with user name"
                    aria-label="Search"
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                  <button
                    className="btn btn-outline-success"
                    style={{ height: 55 }}
                    type="submit"
                  >
                    Search
                  </button>
                </form>
                <div className="card w-100 p-3 usrs">
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Key</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>State</th>
                            <th>Pincode</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {error ? (
                            <tr>
                              <td colSpan="7">Error: {error}</td>
                            </tr>
                          ) : (
                            currentUsers.map((user, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.phone}</td>
                                <td>{user.email}</td>
                                <td>{user.states}</td>
                                <td>{user.pincode}</td>
                                <td>
                                  {user.blocked === false ? (
                                    <>
                                      <button
                                        className="btn btn-danger"
                                        onClick={() => blockUser(user._id)}
                                      >
                                        Block
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        className="btn btn-primary"
                                        onClick={() => unblockUser(user._id)}
                                      >
                                        Unblock
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </Table>
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel="next >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel="< previous"
                        renderOnZeroPageCount={null}
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
                    </>
                  )}
                </div>
              </div>
            </div>
            <ToastContainer />
          </div>
        </Layout>
      </div>
    </>
  );
};

export default Users;
