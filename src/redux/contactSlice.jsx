import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllContact = createAsyncThunk(
  "getAllContact",
  async ({ searchQuery, currentPage, pageSize }) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/contact/?searchQuery=${searchQuery}&currentPage=${currentPage}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const addContact = createAsyncThunk(
  "contacts/addContact",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/contact",
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getContactById = createAsyncThunk("getContactById", async (id) => {
  try {
    const response = await axios.get(`http://localhost:5001/contact/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/contact/${id}`,
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/contact/${id}`
      );
      console.log(response.data);
      return id;
    } catch (error) {
      throw error;
    }
  }
);

const contactSlice = createSlice({
  name: "data",
  initialState: {
    data: [],
    error: "",
    loading: false,
    currentPage: 1,
    pageSize: 5,
    totalPages: 0,
    searchQuery: "",
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllContact.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getAllContact.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.contacts;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllContact.rejected, (state, action) => {
        state.loading = false;
        state.error = "Some error occurred";
      })

      //create contact
      .addCase(addContact.pending, (state) => {
        state.adding = true;
        state.error = null;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.adding = false;
        state.data.push(action.payload);
      })
      .addCase(addContact.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload;
      })

      // upadate

      .addCase(updateContact.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.updating = false;
        state.data = action.payload;
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      //delete
      .addCase(deleteContact.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.deleting = false;
        state.data = state.data.filter(
          (contact) => contact._id !== action.payload
        );
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })

      //get by id
      .addCase(getContactById.fulfilled, (state, action) => {
        state.loading = false;
      });
  },
});

export const { setCurrentPage, setPageSize } = contactSlice.actions;

export default contactSlice.reducer;
