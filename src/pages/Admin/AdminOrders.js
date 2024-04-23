import React, { useState, useEffect } from "react";
import axios from "axios";
import "../AdminCss/AdminOrders.css";
import Layout from "../Admin/Layout";
import moment from "moment";
import { Select, Modal, Input } from "antd";
import * as mod from "../../utils/url";
import Homepage from "../../components/Homepage";
import { IoIosPrint } from "react-icons/io";
import { MdPreview, MdDeleteForever } from "react-icons/md";
import { Table } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useAuth } from "../../components/contexts/contextProvider";
import { useOrderContext } from "./../../components/contexts/orderContext";
import BillPreview from "./BillPreview";
import ReactPaginate from "react-paginate";
import { FcNext, FcPrevious } from "react-icons/fc";

const AdminOrders = ({ status }) => {
  const [orders, setOrders] = useState([]);
  const { auth } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [orderStatus, setOrderStatus] = useState([
    "processing",
    "Shipped",
    "deliverd",
    "canceled",
  ]);
  const { Option } = Select;
  const { updateOrderStatus } = useOrderContext();
  const [searchValue, setSearchValue] = useState("");
  const [itemOffset, setItemOffset] = useState(0);

  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${mod.api_url}/api/v1/auth/all-orders`);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      console.log("Setting up interval...");
      getOrders();

      const intervalId = setInterval(() => {
        getOrders();
      }, 1000);

      return () => {
        clearInterval(intervalId);
        console.log("Interval cleared.");
      };
    }
  }, [auth?.token]);

  const handlePagination = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsPreviewModalVisible(true);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("bill-preview");

    if (printContent) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(
        "<html><head><title>Print</title></head><body>"
      );
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Element with ID 'bill-preview' not found");
    }
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalVisible(false);
  };

  const handleChange = async (id, statusData) => {
    try {
      const { data } = await axios.put(
        `${mod.api_url}/api/v1/auth/orders-status/${id}/status`,
        { status: statusData }
      );

      const updatedOrders = orders.map((order) =>
        order._id === id ? { ...order, status: statusData } : order
      );
      setOrders(updatedOrders);
      console.log(data);
    } catch (error) {
      console.log("Error on status update API:", error);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      confirmAlert({
        title: "Confirm Deletion",
        message: "Are you sure you want to delete this order?",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              const { data } = await axios.delete(
                `${mod.api_url}/api/v1/auth/deleteOrders/${id}`
              );
              const { message } = data;
              alert(message);
              getOrders();
            },
          },
          {
            label: "No",
            onClick: () => console.log("Deletion canceled"),
          },
        ],
      });
    } catch (error) {
      console.log(error, "error on delete api");
    }
  };

  const lowercaseSearchValue = searchValue ? searchValue.toLowerCase() : "";

  const orderFilter = orders.filter((order) => {
    const productName = order?.products[0]?.name || "";
    const priceString = String(order?.products[0]?.price);
    const pincode = String(order?.shipinginfo?.pincode) || "";
    const mobile = String(order?.shipinginfo?.mobile) || "";
    const state = order?.shipinginfo?.state || "";
    const city = order?.shipinginfo?.city || "";
    const paymentMethod = order?.paymentMethod || "";
    const status = order?.status || "";
    const dateString = moment(order?.createdAt).format(
      "MMMM Do YYYY, h:mm:ss a"
    );

    const lowercaseSearchValue = searchValue.toLowerCase();

    return (
      productName.toLowerCase().includes(lowercaseSearchValue) ||
      priceString.includes(lowercaseSearchValue) ||
      dateString
        .toLowerCase()
        .includes(lowercaseSearchValue.replace(/[^a-zA-Z0-9]/g, " ")) ||
      paymentMethod.toLowerCase().includes(lowercaseSearchValue) ||
      pincode.toLowerCase().includes(lowercaseSearchValue) ||
      mobile.toLowerCase().includes(lowercaseSearchValue) ||
      state.toLowerCase().includes(lowercaseSearchValue) ||
      status.toLowerCase().includes(lowercaseSearchValue) ||
      city.toLowerCase().includes(lowercaseSearchValue)
    );
  });

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="for_all_page">
      <Layout title={"All Orders Data"}>
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
              <h1 className="text-center" style={{ background: "whitesmoke" }}>
                Manage Orders
              </h1>
              <form
                className="d-flex"
                role="search"
                style={{ marginBottom: 10, justifyContent: "center" }}
              >
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search your product & status &name & mobile & city & price"
                  aria-label="Search"
                  value={searchValue}
                  onChange={handleSearchChange}
                />
              </form>

              <div
                className="table-container"
                style={{ overflowY: "auto", width: "1000px" }}
              >
                <div className="border shadow mb-3">
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th scope="col">S.No</th>
                        <th scope="col">Change Status</th>
                        <th scope="col">Product</th>
                        <th scope="col">Price</th>
                        <th scope="col">Selling Price</th>
                        <th scope="col">Status</th>
                        <th scope="col">Date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Buyer Name</th>
                        <th scope="col">Mobile</th>
                        <th scope="col">state</th>
                        <th scope="col">city</th>
                        <th scope="col">landmark</th>
                        <th scope="col">pincode</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderFilter
                        ?.slice(
                          (currentPage - 1) * ordersPerPage,
                          currentPage * ordersPerPage
                        )
                        .map((o, i) =>
                          o?.products?.map((p, j) => (
                            <tr key={j}>
                              <td>{i + 1}</td>
                              <td>
                                <Select
                                  bordered={false}
                                  onChange={(statusData) =>
                                    handleChange(o._id, statusData)
                                  }
                                  defaultValue={o?.status}
                                >
                                  {orderStatus.map((s, k) => (
                                    <Option key={k} value={s}>
                                      {s}
                                    </Option>
                                  ))}
                                </Select>
                              </td>
                              <td>{p.name.slice(0, 25)}</td>
                              <td>{p.price}</td>
                              <td>{o.totalPrice.toFixed(2)}</td>
                              <td
                                style={
                                  o.status === "processing"
                                    ? { fontWeight: "bold", color: "blue" }
                                    : o.status === "canceled"
                                    ? { fontWeight: "normal", color: "red" }
                                    : // : o.status === "Not Process"
                                    // ? { fontWeight: "bold", color: "violet" }
                                    o.status === "deliverd"
                                    ? { fontWeight: "bold", color: "#23d160" }
                                    : o.status === "Shipped"
                                    ? { fontWeight: "bold", color: "cyan" }
                                    : {}
                                }
                              >
                                {o?.status}
                              </td>
                              <td>
                                {o?.createdAt
                                  ? moment(o.createdAt).format(
                                      "MMMM Do YYYY, h:mm:ss a"
                                    )
                                  : "N/A"}
                              </td>
                              <td>{o?.paymentMethod}</td>
                              <td>{o?.products?.length}</td>
                              <td>{o?.shipinginfo?.name.slice(0, 10)}</td>
                              <td>{o?.shipinginfo?.mobile}</td>
                              <td>{o?.shipinginfo?.state}</td>
                              <td>{o?.shipinginfo?.city}</td>
                              <td>{o?.shipinginfo?.landmark}</td>
                              <td>{o?.shipinginfo?.pincode}</td>
                              <td>
                                <button
                                  className="button-71"
                                  onClick={() => handleView(o)}
                                  style={{ marginRight: 5 }}
                                >
                                  <MdPreview />
                                </button>
                                <button
                                  className="button-76"
                                  onClick={() => handlePrint(o)}
                                >
                                  <IoIosPrint />
                                </button>
                                <button
                                  className="button-75"
                                  onClick={() => handleDeleteOrder(o._id)}
                                >
                                  {" "}
                                  <MdDeleteForever />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                    </tbody>
                  </Table>
                </div>
              </div>
              <ReactPaginate
                breakLabel="..."
                nextLabel={<FcNext />}
                onPageChange={(selectedPage) =>
                  handlePagination(selectedPage.selected + 1)
                }
                pageCount={Math.ceil(orders?.length / ordersPerPage)}
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
            </div>
          </div>
        </div>
      </Layout>

      {/* Modal for Bill Preview */}
      <Modal
        title="Bill Preview"
        open={isPreviewModalVisible} // Use 'open' instead of 'visible'
        onCancel={handleClosePreviewModal}
        footer={null}
        width="80%"
        style={{ top: 20 }}
      >
        {selectedOrder && (
          <div style={{ height: "100vh", overflowY: "auto" }}>
            <BillPreview order={selectedOrder} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;
