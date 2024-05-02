import { useEffect, useState } from "react";
import { useCart } from "../../../context/CartContext";
import DetailsForm from "../components/DetailsForm";
import OrderSummary from "../components/OrderSummary";
import Button from "../../../shared/Button";

type Product = {
  id: number;
  product_id: string;
  title: string;
  description: string;
  price: string;
  owner: string;
  image: string;
  quantity?: number;
};

type FormData = {
  name: string;
  email: string;
  address: string;
  postalCode: string;
};

const Checkout = () => {
  const { cartState } = useCart();
  const [products, setProducts] = useState([] as Product[]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    address: "",
    postalCode: "",
  });
  console.log(products)
  useEffect(() => {
    setProducts(cartState.items as Product[]);
  }, [setProducts]);

  const handleSubmit = async () => {
    console.log(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold my-6">Checkout</h2>

      <div className="flex flex-row gap-32">
        <div className="flex flex-col border border-gray-700 rounded-lg p-5 min-w-72">
          <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
          <DetailsForm formData={formData} setFormData={setFormData} />
          <Button
            className="self-center mt-4 w-full max-w-sm"
            content="Place Order"
            variant="primary"
            onClick={handleSubmit}
          />
        </div>

        <div className="flex flex-col border border-gray-700 rounded-lg p-5 min-w-72">
          <h3 className="text-xl font-semibold">Order Summary</h3>
          <OrderSummary
            products={products as Product[]}
            setProducts={setProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
