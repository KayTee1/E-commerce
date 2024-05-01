import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AuthContext } from "../../../context/AuthContext";
import ProductListingCard from "../../../shared/ProductListingCard";
import Loader from "../../../shared/Loader";
import Button from "../../../shared/Button";

type Category = {
  id: number;
  category_id: string;
  name: string;
};

type Product = {
  id: number;
  product_id: string;
  title: string;
  description: string;
  price: string;
  owner: string;
  image: string;
  quantity?: number;
  categories: Category[];
};

const CategoryProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const { category_id } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const fetchProducts = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(
        `${apiUrl}/api/products/category/${category_id}`
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setIsError(true);
      console.log(error);
    }
    setIsLoading(false);
  };
  const fetchCategoryName = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/categories/${category_id}`);
      const data = await response.json();
      setCategoryName(data.name);
    } catch (error) {
      setIsError(true);
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchProducts();
    fetchCategoryName();
  }, []);

  let content;
  isError ?? (content = <p>There was an error fetching the data</p>);

  !isError &&
    products.length === 0 &&
    (content = (
      <div className=" text-center">
        <p>No products found</p>

        <div className="mt-3">
          <Button
            content="Post the first listing for this Category!"
            variant="primary"
            onClick={() => {
              auth.isLoggedIn
                ? navigate("/create-listing")
                : navigate("/login");
            }}
          />
        </div>
      </div>
    ));

  !isError &&
    products.length > 0 &&
    (content = products.map((product) => (
      <div key={product.id} className="flex gap-4 mx-32 justify-center">
        <ProductListingCard product={product} />
      </div>
    )));

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h2 className="text-3xl font-bold mb-4">
        Products with <span className="underline">{categoryName}</span> tag
      </h2>

      {isLoading ? <Loader isLoading={isLoading} /> : content}
    </div>
  );
};

export default CategoryProducts;
