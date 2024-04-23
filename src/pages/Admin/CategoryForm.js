import React from "react";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import "../AdminCss/CreateCategory.css";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  return (
    <>
      <form onSubmit={handleSubmit} className="d-flex">
        <div className="mr-2">
          <input
            type="text"
            className="form-control"
            placeholder="enter value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ marginLeft: 20 }}
        >
          <IoCheckmarkDoneCircleSharp className="icon-name" />
        </button>
      </form>
    </>
  );
};

export default CategoryForm;
