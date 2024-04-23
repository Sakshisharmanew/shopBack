import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
// import "../AdminCss/AdminDashboard.css";
import "../AdminCss/AdminDashboard.css"
import { useAuth } from "../../components/contexts/contextProvider";
import axios from "axios";
import * as mod from "../../utils/url";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import { Progress } from "antd";
import { Tooltip, Space } from "antd";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import { Table } from "react-bootstrap";
import { Select, Modal } from "antd";
import { confirmAlert } from "react-confirm-alert"; // Import the library
import "react-confirm-alert/src/react-confirm-alert.css"; // Import the styles
import moment from "moment";
import { IoIosPrint } from "react-icons/io";
import { MdPreview } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import BillPreview from "./BillPreview";
import { LineChart } from "@mui/x-charts/LineChart";
import ReactPaginate from "react-paginate";
import { FcPrevious } from "react-icons/fc";
import { FcNext } from "react-icons/fc";



const AdminDashboard = () => {
  const { auth } = useAuth(); // Destructure auth directly from the context value
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [orderStatus, setOrderStatus] = useState([
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);
  const { Option } = Select;
  const [itemOffset, setItemOffset] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  



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

  useEffect(() => {
    getallUsers();
  }, []);

  const chartSetting = {
    yAxis: [
      {
        label: "rainfall (mm)",
      },
    ],
    width: 500,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-20px, 0)",
      },
    },
  };

  const dataset = [
    {
      london: 59,
      paris: 57,
      newYork: 86,
      seoul: 21,
      month: "Jan",
    },
    {
      london: 50,
      paris: 52,
      newYork: 78,
      seoul: 28,
      month: "Fev",
    },
    {
      london: 47,
      paris: 53,
      newYork: 106,
      seoul: 41,
      month: "Mar",
    },
    {
      london: 54,
      paris: 56,
      newYork: 92,
      seoul: 73,
      month: "Apr",
    },
    {
      london: 57,
      paris: 69,
      newYork: 92,
      seoul: 99,
      month: "May",
    },
    {
      london: 60,
      paris: 63,
      newYork: 103,
      seoul: 144,
      month: "June",
    },
    {
      london: 59,
      paris: 60,
      newYork: 105,
      seoul: 319,
      month: "July",
    },
    {
      london: 65,
      paris: 60,
      newYork: 106,
      seoul: 249,
      month: "Aug",
    },
    {
      london: 51,
      paris: 51,
      newYork: 95,
      seoul: 131,
      month: "Sept",
    },
    {
      london: 60,
      paris: 65,
      newYork: 97,
      seoul: 55,
      month: "Oct",
    },
    {
      london: 67,
      paris: 64,
      newYork: 76,
      seoul: 48,
      month: "Nov",
    },
    {
      london: 61,
      paris: 70,
      newYork: 103,
      seoul: 25,
      month: "Dec",
    },
  ];

  const valueFormatter = (value) => `${value}mm`;

  // Api fir get the all orders
  // const getOrders = async () => {
  //   try {
  //     const { data } = await axios.get(`${mod.api_url}/api/v1/auth/all-orders`);
  //     setOrders(data || []);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // // handke the lifecycle
  // useEffect(() => {
  //   if (auth?.token) getOrders();
  // }, [auth?.token]);

  const getOrders = async () => {
    try {
      console.log("Fetching orders...");
      const { data } = await axios.get(`${mod.api_url}/api/v1/auth/all-orders`);
      console.log("Orders fetched successfully:", data);
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const priceString = String(user.phone);
    return (
      user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      priceString.toLowerCase().includes(searchValue.toLowerCase())
    );
  });


  const endOffset = itemOffset + 5;
  const currentUsers = filteredUsers.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredUsers.length / 5);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * 5) % filteredUsers.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    if (auth?.token) {
      console.log("Setting up interval...");
      // Fetch orders initially
      getOrders();

      // Set up interval to fetch orders every 1 minute (60000 milliseconds)
      // const intervalId = setInterval(() => {
      //   getOrders();
      // }, 1000);

      // Clean up the interval on component unmount
      return () => {
        // clearInterval(intervalId);
        // console.log("Interval cleared.");
      };
    }
  }, [auth?.token]);

  

  //code for preview the  bill
  const handleView = (order) => {
    setSelectedOrder(order);
    setIsPreviewModalVisible(true);
  };

  //code for print the bill
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

  //code for closer the preview
  const handleClosePreviewModal = () => {
    setIsPreviewModalVisible(false);
  };

  // Api for update the state of order
  const handleChange = async (orderId, statusData) => {
    try {
      // Call your API to update the order status
      const { res } = await axios.put(
        `${mod.api_url}/api/v1/auth/orders-status/${orderId}/status`,
        setOrderStatus(statusData)
      );
      return res.data;
      // console.log(res);
    } catch (error) {
      console.log(error, "error on status update api");
    }
  };

  // api for delete the order
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
                `${mod.api_url}/api/v1/auth/orderdelete/${id}`
              );
              const { message } = data;
              alert(message);
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
  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
  const amtData = [2400, 2210, 2290, 2000, 2181, 2500, 2100];
  const xLabels = [
    "Page A",
    "Page B",
    "Page C",
    "Page D",
    "Page E",
    "Page F",
    "Page G",
  ];

  const handlePagination = (pageNumber) => setCurrentPage(pageNumber);

  const handlePaginations = (selectedPage) => {
    setCurrentPage(selectedPage);
  };


  return (
    <div className="for_all_page">
      <Layout>
        <h1 className="text-center" style={{ marginLeft: "30px" }}>
          Dashboard
        </h1>
        <div className="container dashboard">
          <div className="row">
            {/* First Pair of Cards */}
            <div className="col-md-5">
              <div className="card p-3 admin_data" style={{width:"100%"}}>
                <h1
                  className="text-center"
                  style={{ background: "whitesmoke" }}
                >
                  Admin Profile
                </h1>
                <img className="admin_profile" src="images.jpg" alt="" />
                <h6 className="data">Admin: {auth?.user?.name}</h6>
                <h6 className="data">Admin Email: {auth?.user?.email}</h6>
                <h6 className="data">Admin Contact: {auth?.user?.phone}</h6>
              </div>
              <span style={{ width: "50%", padding:"20px" }}>
                <BarChart
                  dataset={dataset}
                  xAxis={[{ scaleType: "band", dataKey: "month" }]}
                  series={[
                    { dataKey: "london", label: "London", valueFormatter },
                    { dataKey: "paris", label: "Paris", valueFormatter },
                    { dataKey: "newYork", label: "New York", valueFormatter },
                    { dataKey: "seoul", label: "Seoul", valueFormatter },
                  ]}
                  {...chartSetting}
                />
              </span>
            </div>

            <div className="col-md-7">
              <div className="card p-3 admin_data6" style={{width:"100%"}}>
                <h1
                  className="text-center"
                  style={{ background: "whitesmoke" }}
                >
                  Total Account
                </h1>
                {/* Content for the second card in the first pair */}
                <div className="col-md-6" style={{width:"100%"}}>
                  <div className="card p-3 admin_data5" style={{width:"100%"}}>
                    {/* Small Cards for E-commerce Metrics */}
                    <div className="row mt-3 small-row">
                      <div className="col-md-6">
                        <div className="card p-2 text-center" style={{width:"100%"}}>
                          <h6 style={{width:"100%"}}>Total Sales</h6>
                          {/* Display total sales value here */}
                          <Row gutter={16}>
                            <Col span={12}>
                              <Card bordered={false}>
                                <Statistic
                                  title="Active"
                                  value={11.28}
                                  precision={2}
                                  valueStyle={{ color: "#3f8600" }}
                                  prefix={<ArrowUpOutlined />}
                                  suffix="%"
                                />
                              </Card>
                            </Col>
                            <Col span={12}>
                              <Card bordered={false}>
                                <Statistic
                                  title="Idle"
                                  value={9.3}
                                  precision={2}
                                  valueStyle={{ color: "#cf1322" }}
                                  prefix={<ArrowDownOutlined />}
                                  suffix="%"
                                />
                              </Card>
                            </Col>
                          </Row>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card p-2 text-center" style={{width:"100%"}}>
                          <h6>Total Income</h6>
                          {/* Display total income value here */}
                          <Row gutter={16}>
                            <Col span={12} style={{ height: 193 }}>
                              <Statistic
                                title="Account Balance"
                                value={112893}
                                precision={2}
                              />
                            </Col>
                          </Row>
                        </div>
                      </div>
                      <div className="col-md-6 mt-3">
                        <div className="card p-2 text-center" style={{width:"100%"}}>
                          <h6>Total Users</h6>
                          {/* Display total users value here */}
                          <Progress percent={30} />
                          <Progress percent={50} status="active" />
                          <Progress percent={70} status="exception" />
                          <Progress percent={100} />
                          <Progress percent={50} showInfo={false} />
                        </div>
                      </div>
                      <div className="col-md-6 mt-3">
                        <div className="card p-2 text-center" style={{width:"100%"}}>
                          <h6>Total Orders</h6>
                          <Tooltip title="3 done / 3 in progress / 4 to do">
                            <Progress percent={60} success={{ percent: 30 }} />
                          </Tooltip>
                          <Space wrap>
                            <Tooltip title="3 done / 3 in progress / 4 to do">
                              <Progress
                                percent={60}
                                success={{ percent: 30 }}
                                type="circle"
                              />
                            </Tooltip>
                          </Space>
                          {/* Display total orders value here */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {/* Second Pair of Cards */}
          <div className="col-md-6">
            <div className="card p-3 admin_data1" style={{ background: "whitesmoke", width:"90%", padding:"5px"}}>
              <h1 className="text-center" style={{ background: "whitesmoke", width:"75%" }}>
                All Users{" "}
              </h1>
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
                        </tr>
                      </thead>
                      <tbody>
                        {error ? (
                          <tr>
                            <td colSpan="6">Error: {error}</td>
                          </tr>
                        ) : (
                          users.map((user, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{user.name}</td>
                              <td>{user.phone}</td>
                              <td>{user.email}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel={<FcNext />}
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={5}
                      pageCount={pageCount}
                      previousLabel={<FcPrevious />}
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

          <div className="col-md-6">
            <div className="card p-3 admin_data10" style={{ background: "whitesmoke", width:"95%"}}>
              {/* Content for the second card in the second pair */}
              <h1 className="text-center" style={{ background: "whitesmoke", width:"100%"}}>
                All Orders
              </h1>
              <div className="table-container" style={{ overflowY: "auto" }}>
                <div className="border shadow mb-3">
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th scope="col">S.NO</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Product</th>
                        <th scope="col">Price</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        ?.slice(
                          (currentPage - 1) * ordersPerPage,
                          currentPage * ordersPerPage
                        )
                        .map((o, i) =>
                          o?.products?.map((p, j) => (
                            <tr key={j}>
                              <td>{i + 1}</td>
                              <td
                                style={
                                  o.status === "processing"
                                    ? { fontWeight: "bold", color: "blue" }
                                    : o.status === "canceled"
                                    ? { fontWeight: "normal", color: "red" }
                                    // : o.status === "Not Process"
                                    // ? { fontWeight: "bold", color: "violet" }
                                    : o.status === "deliverd"
                                    ? { fontWeight: "bold", color: "#23d160" }
                                    : o.status === "Shipped"
                                    ? { fontWeight: "bold", color: "cyan" }
                                    : {}
                                }
                              >
                                {o?.status}
                              </td>
                              <td>{o?.shipinginfo?.name}</td>
                              <td>{moment(o?.createAt).fromNow()}</td>
                              <td>{o?.paymentMethod}</td>
                              <td>{o?.products?.length}</td>
                              <td>{p.name.slice(0,15)}</td>
                              <td>{o.totalPrice.toFixed(2)}</td>
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
                <ReactPaginate
                  breakLabel="..."
                  nextLabel={<FcNext />}
                  onPageChange={(selectedPage) =>
                    handlePaginations(selectedPage.selected + 1)
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
              {/* Pagination */}
              {/* <div className="pagination">
                {[...Array(Math.ceil(orders?.length / ordersPerPage))].map(
                  (_, k) => (
                    <span key={k} onClick={() => handlePagination(k + 1)}>
                      {k + 1}
                    </span>
                  )
                )}
              </div> */}
            </div>
          </div>
        </div>
      </Layout>
      {/* Modal for Bill Preview */}
      <Modal
        title="Bill Preview"
        visible={isPreviewModalVisible}
        onCancel={handleClosePreviewModal}
        footer={null}
        width="80%" // Adjust the width of the modal as per your requirement
        style={{ top: 20 }}
      >
        {selectedOrder && (
          <div style={{ height: "100vh", overflowY: "auto" }}>
            {/* Use the entire height of the viewport with vertical scrolling */}
            <BillPreview order={selectedOrder} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
