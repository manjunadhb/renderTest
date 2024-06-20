import "./App.css";
import Signup from "./component/Signup";
import Login from "./component/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./component/Dashboard";
import Tasks from "./component/Tasks";
import EditProfile from "./component/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/tasks" element={<Tasks />}></Route>
        <Route path="/editProfile" element={<EditProfile />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
