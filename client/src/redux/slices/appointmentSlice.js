

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/appointments";

// export const fetchPendingAppointments = createAsyncThunk(
//   "appointments/fetchPending",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const token = getState().auth.token;
//       console.log(
//         "fetchPendingAppointments - Token:",
//         token ? "Present" : "Missing"
//       );
//       if (!token) {
//         throw new Error("No authentication token found. Please log in.");
//       }
//       const response = await axios.get(`${API_URL}/pending`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("fetchPendingAppointments - Response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error(
//         "fetchPendingAppointments - Error:",
//         error.message,
//         error.response?.data
//       );
//       return rejectWithValue(
//         error.response?.data?.error ||
//           error.message ||
//           "Failed to fetch pending appointments"
//       );
//     }
//   }
// );

// export const fetchConfirmedAppointments = createAsyncThunk(
//   "appointments/fetchConfirmed",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const token = getState().auth.token;
//       console.log(
//         "fetchConfirmedAppointments - Token:",
//         token ? "Present" : "Missing"
//       );
//       if (!token) {
//         throw new Error("No authentication token found. Please log in.");
//       }
//       const response = await axios.get(`${API_URL}/confirmed`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("fetchConfirmedAppointments - Response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error(
//         "fetchConfirmedAppointments - Error:",
//         error.message,
//         error.response?.data
//       );
//       return rejectWithValue(
//         error.response?.data?.error ||
//           error.message ||
//           "Failed to fetch confirmed appointments"
//       );
//     }
//   }
// );

// export const createAppointment = createAsyncThunk(
//   "appointments/create",
//   async (appointmentData, { getState, rejectWithValue }) => {
//     try {
//       const token = getState().auth.token;
//       console.log("createAppointment - Token:", token ? "Present" : "Missing");
//       if (!token) {
//         throw new Error("No authentication token found. Please log in.");
//       }
//       const response = await axios.post(API_URL, appointmentData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("createAppointment - Response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error(
//         "createAppointment - Error:",
//         error.message,
//         error.response?.data
//       );
//       return rejectWithValue(
//         error.response?.data?.error ||
//           error.message ||
//           "Failed to create appointment"
//       );
//     }
//   }
// );

// export const deleteAppointment = createAsyncThunk(
//   "appointments/delete",
//   async (id, { getState, rejectWithValue }) => {
//     try {
//       const token = getState().auth.token;
//       console.log("deleteAppointment - Token:", token ? "Present" : "Missing");
//       if (!token) {
//         throw new Error("No authentication token found. Please log in.");
//       }
//       await axios.delete(`${API_URL}/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("deleteAppointment - Success:", id);
//       return id;
//     } catch (error) {
//       console.error(
//         "deleteAppointment - Error:",
//         error.message,
//         error.response?.data
//       );
//       return rejectWithValue(
//         error.response?.data?.error ||
//           error.message ||
//           "Failed to delete appointment"
//       );
//     }
//   }
// );

// export const confirmAppointment = createAsyncThunk(
//   "appointments/confirm",
//   async (appointmentId, { getState, rejectWithValue }) => {
//     try {
//       const token = getState().auth.token;
//       console.log("confirmAppointment - Token:", token ? "Present" : "Missing");
//       if (!token) {
//         throw new Error("No authentication token found. Please log in.");
//       }
//       const response = await axios.post(
//         `${API_URL}/confirm`,
//         { appointmentId },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("confirmAppointment - Response:", response.data);
//       return response.data.appointment;
//     } catch (error) {
//       console.error(
//         "confirmAppointment - Error:",
//         error.message,
//         error.response?.data
//       );
//       return rejectWithValue(
//         error.response?.data?.error ||
//           error.message ||
//           "Failed to confirm appointment"
//       );
//     }
//   }
// );

// const appointmentSlice = createSlice({
//   name: "appointments",
//   initialState: {
//     pendingAppointments: [],
//     confirmedAppointments: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchPendingAppointments.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPendingAppointments.fulfilled, (state, action) => {
//         state.loading = false;
//         state.pendingAppointments = action.payload.appointments;
//       })
//       .addCase(fetchPendingAppointments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchConfirmedAppointments.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchConfirmedAppointments.fulfilled, (state, action) => {
//         state.loading = false;
//         state.confirmedAppointments = action.payload.appointments;
//       })
//       .addCase(fetchConfirmedAppointments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(createAppointment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createAppointment.fulfilled, (state, action) => {
//         state.loading = false;
//         state.pendingAppointments.push(action.payload.appointment);
//       })
//       .addCase(createAppointment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(deleteAppointment.fulfilled, (state, action) => {
//         state.pendingAppointments = state.pendingAppointments.filter(
//           (appointment) => appointment._id !== action.payload
//         );
//         state.confirmedAppointments = state.confirmedAppointments.filter(
//           (appointment) => appointment._id !== action.payload
//         );
//       })
//       .addCase(deleteAppointment.rejected, (state, action) => {
//         state.error = action.payload;
//       })
//       .addCase(confirmAppointment.fulfilled, (state, action) => {
//         const confirmedAppointment = action.payload;
//         state.pendingAppointments = state.pendingAppointments.filter(
//           (appointment) => appointment._id !== confirmedAppointment._id
//         );
//         state.confirmedAppointments.push(confirmedAppointment);
//       })
//       .addCase(confirmAppointment.rejected, (state, action) => {
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearError } = appointmentSlice.actions;
// export default appointmentSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchPendingAppointments = createAsyncThunk(
  "appointments/fetchPending",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      console.log(
        "fetchPendingAppointments - Token:",
        token ? "Present" : "Missing"
      );
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
      const response = await axiosInstance.get("/appointments/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("fetchPendingAppointments - Response:", response.data);
      const appointments = response.data.appointments || [];
      if (!Array.isArray(appointments)) {
        console.error("fetchPendingAppointments - Response is not an array:", response.data);
        return rejectWithValue("Invalid response format: appointments is not an array");
      }
      return appointments;
    } catch (error) {
      console.error(
        "fetchPendingAppointments - Error:",
        error.message,
        error.response?.data
      );
      return rejectWithValue(
        error.response?.data?.error ||
          error.message ||
          "Failed to fetch pending appointments"
      );
    }
  }
);

export const fetchConfirmedAppointments = createAsyncThunk(
  "appointments/fetchConfirmed",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      console.log(
        "fetchConfirmedAppointments - Token:",
        token ? "Present" : "Missing"
      );
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
      const response = await axiosInstance.get("/appointments/confirmed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("fetchConfirmedAppointments - Response:", response.data);
      const appointments = response.data.appointments || [];
      if (!Array.isArray(appointments)) {
        console.error("fetchConfirmedAppointments - Response is not an array:", response.data);
        return rejectWithValue("Invalid response format: appointments is not an array");
      }
      return appointments;
    } catch (error) {
      console.error(
        "fetchConfirmedAppointments - Error:",
        error.message,
        error.response?.data
      );
      return rejectWithValue(
        error.response?.data?.error ||
          error.message ||
          "Failed to fetch confirmed appointments"
      );
    }
  }
);

export const createAppointment = createAsyncThunk(
  "appointments/create",
  async (appointmentData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      console.log("createAppointment - Token:", token ? "Present" : "Missing");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
      const response = await axiosInstance.post("/appointments", appointmentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("createAppointment - Response:", response.data);
      return response.data.appointment;
    } catch (error) {
      console.error(
        "createAppointment - Error:",
        error.message,
        error.response?.data
      );
      return rejectWithValue(
        error.response?.data?.error ||
          error.message ||
          "Failed to create appointment"
      );
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  "appointments/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      console.log("deleteAppointment - Token:", token ? "Present" : "Missing");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
      await axiosInstance.delete(`/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("deleteAppointment - Success:", id);
      return id;
    } catch (error) {
      console.error(
        "deleteAppointment - Error:",
        error.message,
        error.response?.data
      );
      return rejectWithValue(
        error.response?.data?.error ||
          error.message ||
          "Failed to delete appointment"
      );
    }
  }
);

export const confirmAppointment = createAsyncThunk(
  "appointments/confirm",
  async (appointmentId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      console.log("confirmAppointment - Token:", token ? "Present" : "Missing");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
      const response = await axiosInstance.post(
        "/appointments/confirm",
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("confirmAppointment - Response:", response.data);
      return response.data.appointment;
    } catch (error) {
      console.error(
        "confirmAppointment - Error:",
        error.message,
        error.response?.data
      );
      return rejectWithValue(
        error.response?.data?.error ||
          error.message ||
          "Failed to confirm appointment"
      );
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointments",
  initialState: {
    pendingAppointments: [],
    confirmedAppointments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingAppointments = action.payload;
      })
      .addCase(fetchPendingAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchConfirmedAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConfirmedAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.confirmedAppointments = action.payload;
      })
      .addCase(fetchConfirmedAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingAppointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.pendingAppointments = state.pendingAppointments.filter(
          (appointment) => appointment._id !== action.payload
        );
        state.confirmedAppointments = state.confirmedAppointments.filter(
          (appointment) => appointment._id !== action.payload
        );
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(confirmAppointment.fulfilled, (state, action) => {
        const confirmedAppointment = action.payload;
        state.pendingAppointments = state.pendingAppointments.filter(
          (appointment) => appointment._id !== confirmedAppointment._id
        );
        state.confirmedAppointments.push(confirmedAppointment);
      })
      .addCase(confirmAppointment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;