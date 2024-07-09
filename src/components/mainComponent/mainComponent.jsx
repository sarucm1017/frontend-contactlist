import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./main.css";
import TableBody from "../TabelBody/TableBody";
import FormComponent from "../formComponent/Form";
import DeleteForm from "../formComponent/deleteForm";
import {
  deleteContact,
  getAllContact,
  setCurrentPage,
  setPageSize,
} from "../../redux/contactSlice";

const MainComponent = () => {
  const [createForm, setCreateForm] = useState(false);
  const [contactState, setContactState] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const { currentPage, totalPages, pageSize } = useSelector(
    (state) => state.data
  );
  const searchQuery = "";
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllContact({ searchQuery, currentPage, pageSize }));
  }, [dispatch, searchQuery, currentPage, pageSize]);

  const handleSearch = (e) => {
    const newSearchQuery = e.target.value;
    dispatch(
      getAllContact({ searchQuery: newSearchQuery, currentPage: 1, pageSize })
    );
    
  };

  const handlePageSize = (e) => {
    const newSize = parseInt(e.target.value, 10);
    const newTotalPages = Math.ceil(totalPages / newSize);
    const newCurrentPage = Math.min(currentPage, newTotalPages);
    dispatch(setPageSize(newSize));
    dispatch(setCurrentPage(newCurrentPage));
  };

  const pageNumber = Array.from(
    { length: Math.ceil(totalPages / pageSize) },
    (_, numBtn) => numBtn + 1
  );

  const handleChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setCurrentPage(newPage));
    }
  };

  const handleEditContact = (contact) => {
    setContactState(contact);
    setCreateForm(true);
  };

  const handleDelete = (contactId) => {
    setContactState(contactId);
    setShowDeletePopup(true);
  };

  const closePopup = () => {
    setShowDeletePopup(false);
    setContactState(null);
  };

  const confirmDelete = (contactId) => {
    dispatch(deleteContact(contactId));
    closePopup();
  };

  return (
    <>
      <div className="maincontainer">
        <div className="container">
          <div className="headerSection">
            <div className="leftSide">
              <h1 className="bodyHead">ContactList</h1>
              <div className="totalCount">
                <h5 className="totalText">Show</h5>
                <select
                  className="showlist"
                  name="contact"
                  id="showList"
                  value={pageSize}
                  onChange={handlePageSize}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
                <h5 className="entries">entries</h5>
                <p>of {totalPages}</p>
              </div>
            </div>
            <div className="searchbar">
              <div className="rightSide">
                <button className="btn" onClick={() => setCreateForm(true)}>
                  Create
                </button>
              </div>
              <input
                className="searchbarInput"
                type="text"
                placeholder="search"
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="bodySection">
            <TableBody
              onEditContact={handleEditContact}
              onDeleteContact={handleDelete}
            />
            <div className="pagination">
              <button
                className="paginate_btn"
                onClick={() => handleChangePage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>
              {pageNumber.map((pageNumbers) => (
                <button
                  key={pageNumbers}
                  onClick={() => handleChangePage(pageNumbers)}
                  className={`paginate_btn ${pageNumbers === currentPage ? "active" : "" }`}
                >
                  {pageNumbers}
                </button>
              ))}
              <button
                className="paginate_btn"
                onClick={() => handleChangePage(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalPages / pageSize)}
              >
                &raquo;
              </button>
            </div>
          </div>
        </div>

        {createForm && (
          <FormComponent
            close={() => setCreateForm(false)}
            contactToEdit={contactState}
          />
        )}
        {showDeletePopup && (
          <DeleteForm
            contactId={contactState}
            close={closePopup}
            confirmDelete={confirmDelete}
          />
        )}
      </div>
    </>
  );
};

export default MainComponent;
