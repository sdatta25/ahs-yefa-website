import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import About from "./pages/About"
import Officers from "./pages/Officers"
import Calendar from "./pages/Calendar"
import Competitions from "./pages/Competitions"
import Forms from "./pages/Forms"
import Resources from "./pages/Resources"
import SocialMedia from "./pages/SocialMedia"
import Partners from "./pages/Partners"
import Contact from "./pages/Contact"
import Admin from "./pages/Admin"
import Login from "./pages/Login"
import Member from "./pages/Member"
import RequireAuth from "./components/RequireAuth"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="officers" element={<Officers />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="meetings-competitions" element={<Navigate to="/calendar" replace />} />
        <Route path="competitions" element={<Competitions />} />
        <Route path="forms" element={<Forms />} />
        <Route path="resources" element={<Resources />} />
        <Route path="social" element={<SocialMedia />} />
        <Route path="partners" element={<Partners />} />
        <Route path="contact" element={<Contact />} />
        <Route path="admin" element={<Admin />} />
        <Route path="login" element={<Login />} />
        <Route
          path="member"
          element={
            <RequireAuth>
              <Member />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  )
}
