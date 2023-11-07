import React from "react";

const CategoryForm = ({ handleCategoryForm, value, setName }) => {
  return (
    <div className="my-3">
      <h3 className="text-center">Create New Category</h3>
      <form onSubmit={(e) => handleCategoryForm(e)}>
        <div className="mb-3">
          <input
            value={value}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Enter category name"
            aria-describedby="emailHelp"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
