import { useState, useEffect } from "react";
const port = "http://localhost:5000";

export const useCategory = () => {
  const [category, setCategory] = useState([]);

  const getCategory = () => {
    fetch(`${port}/category/get-category`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setCategory(data.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getCategory();
  }, []);

  return category;
};
