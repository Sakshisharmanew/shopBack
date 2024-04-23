import React from "react";
import "../AdminCss/BillPreview.css";
import moment from "moment";
import { Table } from "react-bootstrap";

const BillPreview = ({ order }) => {
  return (
    <div id="bill-preview">
      <header>
        <div className="invoice_hading" style={{ textAlign: "center" }}>
          <h3>Product Invoice</h3>
        </div>
      </header>
      <main>
        <section style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="company_details" style={{ textAlign: "left" }}>
            <h2>SAMAN KI DUKAN</h2>
            135, Shiv Chowk, Near Gurudwara,
            <br />
            New Delhi - 110046
            <br />
            <br />
            Email: samankidukan@gmail.com
            <br />
            Phone: +91 8765432198
            <br />
            GSTIN: 27AABHJ1086Q1ZV
          </div>

          <div className="user_details" style={{ textAlign: "right" }}>
            <h2>Customer Details</h2>
            <h6 className="order-id">Order ID: {order._id}</h6>
            <br></br>
            <p>Customer Name:{order?.shipinginfo?.name}</p>
            <p>Customer Phone: {order?.shipinginfo?.mobile}</p>
            <p>Customer State: {order?.shipinginfo?.state}</p>
            <p>Customer City: {order?.shipinginfo?.city}</p>
            <p>Customer Landmark: {order?.shipinginfo?.landmark}</p>
            <p>Customer PinCode: {order?.shipinginfo?.pincode}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </section>
        <hr></hr>
        {/* 
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((product, index) => (
              <tr key={index} className="product-item">
                <td className="product-name">{product.name}</td>
                <td className="product-description">{product.description}</td>
                <td className="product-price">{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table> */}
      </main>
      <h4 className="text-center"> Products Details</h4>
      <main>
        <section>
          <div
            className="baki_data"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div>
                <strong>Product Name:</strong>
              </div>
              <div>
                <strong>Total Amount:</strong>
              </div>
              <div>
                <strong>Date:</strong>
              </div>
              <div>
                <strong>Quantity:</strong>
              </div>
              <div>
                <strong>Buyer Name:</strong>
              </div>
              <div>
                <strong>Mobile NO:</strong>
              </div>
              <div>
                <strong>State:</strong>
              </div>
              <div>
                <strong>City:</strong>
              </div>
              <div>
                <strong>Landmark:</strong>
              </div>
              <div>
                <strong>Pincode:</strong>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div>{order.products[0].name}</div>
              <div>{order.totalPrice}</div>
              <div>
                {order.createdAt
                  ? moment(order.createdAt).format("MMMM Do YYYY, h:mm:ss a")
                  : "N/A"}
              </div>
              <div>{order.products.length}</div>
              <div>{order.shipinginfo.name}</div>
              <div>{order.shipinginfo.mobile}</div>
              <div>{order.shipinginfo.state}</div>
              <div>{order.shipinginfo.city}</div>
              <div>{order.shipinginfo.landmark}</div>
              <div>{order.shipinginfo.pincode}</div>
            </div>
          </div>
          <hr></hr>
        </section>
      </main>

      <footer>
        <div id="bill-preview" className="footer-item">
          <img
            src="logo192.png"
            alt="VEEAAR SOFTTECH PVT. LTD."
            style={{ height: 40, width: 40 }}
          />
          <h6 style={{ marginTop: 6 }}>VEEAAR SOFTTECH PVT. LTD.</h6>
          {/* <button className="button-70" onClick={handlePrint}>
            Print Bill
          </button> */}
        </div>
      </footer>
    </div>
  );
};

export default BillPreview;
