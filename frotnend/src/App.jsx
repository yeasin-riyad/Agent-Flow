import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Agents from "./pages/Agents";
import Integration from "./pages/Integration";
import CreateAgent from "./pages/CreateAgent";
import AgentChat from "./pages/AgentChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/integrations" element={<Integration />} />
        <Route path="/agents/create" element={<CreateAgent />} />
        <Route path="/agents/:agentId/chat" element={<AgentChat />}
/>

      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
