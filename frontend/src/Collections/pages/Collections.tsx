import { useEffect, useState } from "react";

import Loader from "../../shared/Loader";
import ProductListingCard from "../components/ProductListingCard";

type Product = {
  id: string;
  title: string;
  description: string;
  price: string;
  owner: string;
};

const Collections = () => {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      setIsLoading(true);
      const response = await fetch(apiUrl + "/api/products");
      const data = await response.json();
      setProductsData(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h2 className="text-3xl font-bold mb-4">Collections</h2>
      <p className="text-lg text-gray-600 mb-8">
        Browse our wide range of products.
      </p>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader isLoading={isLoading} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 ">
          {productsData.map((product: Product) => (
            <ProductListingCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
