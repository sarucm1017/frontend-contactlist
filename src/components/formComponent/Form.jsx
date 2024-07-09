import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addContact,
  updateContact,
  getContactById,
  getAllContact,
} from "../../redux/contactSlice";
import { toast } from "react-toastify";

const FormComponent = ({ close, contactToEdit }) => {
  const { currentPage, searchQuery, pageSize } = useSelector(
    (state) => state.data
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (contactToEdit) {
        try {
          const actionResult = await dispatch(
            getContactById(contactToEdit._id)
          );
          const contactData = actionResult.payload;
          if (contactData) {
            setFormData({
              firstName: contactData.firstName || "",
              lastName: contactData.lastName || "",
              email: contactData.email || "",
              phone: contactData.phone || "",
            });
          }
        } catch (error) {
          console.error("Error fetching contact:", error);
        }
      }
    };

    fetchData();
  }, [contactToEdit, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contactToEdit) {
      dispatch(updateContact({ id: contactToEdit._id, formData }))
        .unwrap()
        .then(() => {
          setFormData({ firstName: "", lastName: "", email: "", phone: "" });
          close();
          dispatch(getAllContact({ searchQuery, currentPage, pageSize }));
          toast.success("Contact updated successfully");
        })
        .catch((error) => {
          console.error("Error updating contact:", error);
        });
    } else {
      dispatch(addContact(formData))
        .unwrap()
        .then(() => {
          setFormData({ firstName: "", lastName: "", email: "", phone: "" });
          close();
          dispatch(getAllContact({ searchQuery, currentPage, pageSize }));
          toast.success("Contact added successfully");
        })
        .catch((error) => {
          console.error("Error adding contact:", error);
        });
    }
  };

  return (
    <>
      <div className="formContainer">
        <div className="mainForm">
          <div className="top">
            <h3>{contactToEdit ? "Edit Contact" : "Create Contact"}</h3>
            <button className="closebtn" onClick={close}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter the first name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter the last name"
              value={formData.lastName}
              onChange={handleChange}
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter the email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Enter the phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <div className="submitBtn">
              <button className="btn" type="submit">
                {contactToEdit ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="overlay"></div>
    </>
  );
};

export default FormComponent;
