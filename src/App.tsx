import { Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import About from "./pages/About"
import Officers from "./pages/Officers"
import MeetingsCompetitions from "./pages/MeetingsCompetitions"
import Forms from "./pages/Forms"
import Resources from "./pages/Resources"
import SocialMedia from "./pages/SocialMedia"
import Partners from "./pages/Partners"
import Contact from "./pages/Contact"
import Admin from "./pages/Admin"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="officers" element={<Officers />} />
        <Route path="meetings-competitions" element={<MeetingsCompetitions />} />
        <Route path="forms" element={<Forms />} />
        <Route path="resources" element={<Resources />} />
        <Route path="social" element={<SocialMedia />} />
        <Route path="partners" element={<Partners />} />
        <Route path="contact" element={<Contact />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  )
}
