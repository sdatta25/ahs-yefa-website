import { Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import About from "./pages/About"
import Officers from "./pages/Officers"
import Competitions from "./pages/Competitions"
import Events from "./pages/Events"
import Contact from "./pages/Contact"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="officers" element={<Officers />} />
        <Route path="competitions" element={<Competitions />} />
        <Route path="events" element={<Events />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  )
}
