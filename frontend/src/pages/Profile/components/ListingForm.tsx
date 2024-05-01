import { ChangeEvent, useContext, useEffect, useState } from "react";
import FormItem from "../../../shared/FormItem";
import Message from "../../../shared/Message";
import { CategoriesSelector } from "./CategoriesSelector";
import { AuthContext } from "../../../context/AuthContext";

type Category = {
  category_id: string;
  name: string;
};

type FormData = {
  title: string;
  price: string;
  description: string;
  image: string;
  owner: string;
  categories: Category[];
};
type MessageType = {
  message: string;
  color: "red" | "green" | "";
};

type ListingFormProps = {
  method: string;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  postListing?: () => Promise<{ message: string; success: boolean }>;
  editListing?: () => Promise<{ message: string; success: boolean }>;
  placeholders?: {
    title: string;
    price: string;
    description: string;
    image: string;
  };
};

const ListingForm = ({
  method,
  formData,
  setFormData,
  ...props
}: ListingFormProps) => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState<MessageType>({
    message: "",
    color: "",
  });

  const auth = useContext(AuthContext);
  const fetchCategories = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(apiUrl + "/api/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setCategories(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const postCategory = async (category: Category) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(apiUrl + "/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(category),
      });
      if (!response.ok) {
        throw new Error("Failed to create category");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitNewCategory = async () => {
    let newCategories = selectedCategories.filter((category) => {
      const capitalizedCategoryName =
        category.name.charAt(0).toUpperCase() + category.name.slice(1);

      return !categories.some((c) => c.name === capitalizedCategoryName);
    });

    if (newCategories.length === 0) {
      return;
    }
    try {
      await Promise.all(
        newCategories.map((category) => postCategory(category))
      );
    } catch (error) {
      console.error("Failed to create one or more categories:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
    setMessage({ message: "", color: "" });
  };

  const validateForm = async () => {
    await handleSubmitNewCategory();
    const { title, price, description, image } = formData;

    if (!title || !price || !description || !image) {
      setMessage({ message: "Please fill in all fields", color: "red" });
      return;
    }

    if (selectedCategories.length === 0) {
      setMessage({
        message: "Please select at least one category",
        color: "red",
      });
      return;
    }

    if (isNaN(Number(price))) {
      setMessage({ message: "Price must be a number", color: "red" });
      return;
    }
    const isValidImg = isValidImageUrl(image);
    if (!isValidImg) {
      setMessage({ message: "Image URL is invalid", color: "red" });
      return;
    }
    if (description.length < 10) {
      setMessage({
        message: "Description must be at least 10 characters",
        color: "red",
      });
      return;
    }
    if (title && title[0] !== title[0].toUpperCase()) {
      setMessage({
        message: "Title must start with a capital letter",
        color: "red",
      });
      return;
    }
    formData.categories = selectedCategories;

    if (method === "POST" && props.postListing) {
      props
        .postListing()
        .then(({ success, message }) => {
          if (success) {
            setMessage({ message: message, color: "green" });
          } else {
            setMessage({
              message: message,
              color: "red",
            });
          }
        })
        .catch((error) => {
          console.error(error);
          setMessage({
            message: "An unexpected error has occurred",
            color: "red",
          });
        });
    } else if (method === "PUT" && props.editListing) {
      props
        .editListing()
        .then(({ success, message }) => {
          if (success) {
            setMessage({ message: message, color: "green" });
          } else {
            setMessage({
              message: message,
              color: "red",
            });
          }
        })
        .catch((error) => {
          console.error(error);
          setMessage({
            message: "An unexpected error has occurred",
            color: "red",
          });
        });
    }
  };
  return (
    <div className="grid bg-slate-100 p-9 rounded-lg border-solid border-4">
      <form onSubmit={validateForm}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormItem
            name="title"
            placeholder={props.placeholders ? props.placeholders.title : "Bike"}
            handleChange={handleChange}
          />
          <FormItem
            name="price"
            displayName="Price (€)"
            placeholder={props.placeholders ? props.placeholders.price : "100"}
            handleChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <FormItem
            name="description"
            placeholder={
              props.placeholders
                ? props.placeholders.description
                : "A nice bike"
            }
            handleChange={handleChange}
          />
          <FormItem
            name="image"
            placeholder={
              props.placeholders
                ? props.placeholders.image
                : "https://example.com/image.jpg"
            }
            handleChange={handleChange}
          />
        </div>
      </form>
      <div className="mx-2 my-2">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          Categories
        </label>
        <CategoriesSelector
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </div>

      <button
        onClick={validateForm}
        className="mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Submit
      </button>
      <Message message={message} className="mt-2" />
    </div>
  );
};

export default ListingForm;

const isValidImageUrl = async (url: string): Promise<boolean> => {
  const img = new Image();
  img.src = url;
  return img.complete;
};
