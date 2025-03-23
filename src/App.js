import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register/Register.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google"
import { CLIENT_ID } from "./constants/constant.js";

function App() {
  return (
    <GoogleOAuthProvider clientId = {CLIENT_ID}>
    <BrowserRouter>
      <Routes>
      <Route path="/register" element={<Register />} />
        {/* <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/new-password" element={<SetNewPassword />} />
        <Route path='/logout' element={<Logout/>} />
        <Route path="/lead" element={<ProtectedRouting Component={LeadListing} />} />
        <Route path="/import" element={<Imports />} />
        <Route path="/details/:id" element={<LeadDetails />} />
        <Route path="/deal" element={<DealList />} />
        <Route path="/widgetz" element={<Widgets />} />
        <Route path="/convert-deal" element = {<ConvertToDeal/>} />
        <Route path="/overdue" element={<FollowUpOverdue />} />
        <Route path="/verify-user-email" element={<VerifyUserEmail />} />

        <Route path="/follow-up" element={<FollowUpOverdue />} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/company" element={<Company/>} />

        <Route path="/import-lead" element={<ImportLeadCard/>} />
        <Route path="/upload-lead" element={<UploadLead/>} />
        <Route path="/map-fields" element={<MapFileds/>} />
        <Route path="/preview-lead" element={<PreviewLead/>} />
        <Route path="/error-csv" element={<ErrorCsvImport />} />
        <Route path="/import-history" element={<ImportHistory />} />
        <Route path="/import-history-detail/:id" element={<ImportHistoryDetail />} /> */}
        

      </Routes>
    </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
