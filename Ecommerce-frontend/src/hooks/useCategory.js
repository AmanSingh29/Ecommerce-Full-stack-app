import { useState, useEffect } from "react";
const port = "https://ecommerce-hch9.onrender.com";

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
