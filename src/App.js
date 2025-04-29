import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./styles/main.scss";

// Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Patient Components
import PatientDashboard from "./components/patient/PatientDashboard";
import BookAppointment from "./components/patient/BookAppointment";
import MyAppointments from "./components/patient/MyAppointments";

// Doctor Components
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import ManageAppointments from "./components/doctor/ManageAppointments";

// Context
import { AuthProvider } from "./context/AuthContext";
import { AppointmentProvider } from "./context/AppointmentContext";

// Layout Components
import PatientLayout from "./components/layouts/PatientLayout";
import DoctorLayout from "./components/layouts/DoctorLayout";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppointmentProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Patient Routes */}
            <Route path="/patient" element={<PatientLayout />}>
              <Route index element={<PatientDashboard />} />
              <Route path="book" element={<BookAppointment />} />
              <Route path="appointments" element={<MyAppointments />} />
            </Route>

            {/* Doctor Routes */}
            <Route path="/doctor" element={<DoctorLayout />}>
              <Route index element={<DoctorDashboard />} />
              <Route path="appointments" element={<ManageAppointments />} />
            </Route>

            {/* Redirect to login if no route matches */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AppointmentProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
