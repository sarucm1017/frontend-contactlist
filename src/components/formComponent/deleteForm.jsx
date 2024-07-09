import React from "react";
import { deleteContact, getAllContact } from "../../redux/contactSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const DeleteForm = ({ close, contactId }) => {
  const { currentPage, searchQuery, pageSize } = useSelector(
    (state) => state.data
  );

  const dispatch = useDispatch();

  const handleDeleteFunction = async () => {
    try {
      await dispatch(deleteContact(contactId)).unwrap();
      dispatch(getAllContact({ searchQuery, currentPage, pageSize }));
      close();
      toast.success("Contact Deleted successfully");
    } catch (error) {
      console.error("Error deleting", error);
    }
  };
  return (
    <>
      <div className="deleteContainer">
        <div className="subContainer">
          <div className="rightBtn">
            <h3 className="deleteText">Delete Contact</h3>
            <button className="closebtn close" onClick={close}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="deleteContent">
            <h5>Do you want to delete this contact </h5>
            <div>
              <button className="deleteBtn" onClick={close}>
                Cancel
              </button>
              <button
                className="deleteBtn confirm"
                onClick={handleDeleteFunction}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="overlay"></div>
    </>
  );
};

export default DeleteForm;
