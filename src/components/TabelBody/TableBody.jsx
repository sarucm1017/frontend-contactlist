import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContact, getContactById } from "../../redux/contactSlice";
import FormComponent from "../formComponent/Form";
import DeleteForm from "../formComponent/deleteForm";

const TableBody = () => {
  const [contactToEdit, setcontactToEdit] = useState(null);
  const [contactToDelete, setcontactToDelete] = useState(null);
  const [showForm, setshowForm] = useState(false);
  const [showPop, setshowPop] = useState(false);
  const searchData = useSelector((state) => state.data.data);
  const {
    data,
    loading,
    error,
    currentPage,
    pageSize,
    searchQuery,
  } = useSelector((state) => state.data);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllContact({ searchQuery, currentPage, pageSize }));
  }, [dispatch, searchQuery, currentPage, pageSize]);

  const handleEdit = async (contactId) => {
    try {
      const response = await dispatch(getContactById(contactId));
      const contactData = response.payload;
      setcontactToEdit(contactData);
      setshowForm(true);
    } catch (error) {
      console.error("Error fetching contact for edit:", error);
    }
  };

  const handleDelete = (contactId) => {
    setcontactToDelete(contactId);
    setshowPop(true);
  };

  const handleCloseForm = () => {
    setshowForm(false);
    setcontactToEdit(null);
  };

  const handleClosePop = () => {
    setshowPop(false);
    setcontactToDelete(null);
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) &&
            data.map((contact, index) => (
              <tr key={contact._id}>
                <td>{index + 1 + (currentPage - 1) * pageSize}</td>
                <td>
                  {contact.firstName} {contact.lastName}
                </td>
                <td>{contact.phone}</td>
                <td>{contact.email}</td>
                <td className="lastcolumn">
                  <div className="contact_action">
                    <button
                      onClick={() => handleEdit(contact._id)}
                      className="contact_btn edit_btn"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="contact_btn delete_btn"
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="message">
        {searchData.length === 0 && <p>No data found</p>}
        {loading && <div className="loading"> Loading ... </div>}
        {error && <div className="error"> {error} </div>}
      </div>
      {showForm && (
        <FormComponent close={handleCloseForm} contactToEdit={contactToEdit} />
      )}
      {showPop && (
        <DeleteForm close={handleClosePop} contactId={contactToDelete} />
      )}
    </>
  );
};

export default TableBody;
