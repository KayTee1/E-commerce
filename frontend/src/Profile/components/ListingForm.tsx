import { ChangeEvent, useState } from "react";
import FormItem from "../../shared/FormItem";
import Message from "../../shared/Message";
type FormData = {
  title: string;
  price: string;
  description: string;
  image: string;
  owner: string;
};
type MessageType = {
  message: string;
  color: string;
};

type ListingFormProps = {
  method: string;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  postListing?: () => Promise<{ message: string; success: boolean }>;
  editListing?: () => { message: string; success: boolean };
};

const ListingForm = ({
  method,
  formData,
  setFormData,
  ...props
}: ListingFormProps) => {
  const [message, setMessage] = useState<MessageType>({
    message: "",
    color: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
    setMessage({ message: "", color: "" });
  };

  const validateForm = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { title, price, description, image } = formData;

    if (!title || !price || !description || !image) {
      setMessage({ message: "Please fill in all fields", color: "red" });
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
      props.editListing();
    }
  };
  return (
    <form onSubmit={validateForm} className="grid">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormItem name="title" placeholder="Bike" handleChange={handleChange} />
        <FormItem
          name="price"
          displayName="Price (€)"
          placeholder="80"
          handleChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-1">
        <FormItem
          name="description"
          placeholder="A nice bike"
          handleChange={handleChange}
        />
        <FormItem
          name="image"
          placeholder="https://www.example.com/image.jpg"
          handleChange={handleChange}
        />
      </div>

      <Message message={message} />
      <button
        type="submit"
        className="mt-3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  );
};

export default ListingForm;

const isValidImageUrl = async (url: string): Promise<boolean> => {
  const img = new Image();
  img.src = url;
  return img.complete;
};
