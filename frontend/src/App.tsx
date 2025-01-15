import { Route, Routes } from "react-router"
import Layout from "./components/Layout"
import Login from "./features/auth/components/Login"
import RequireAuth from "./features/auth/components/RequireAuth"
import Home from "./features/product/components/Home"
import SignUp from './features/auth/components/SignUp';
import StartTransaction from './features/transaction/components/StartTransaction';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      {/* public routes */}
      <Route index element={<Login />} />
      <Route path="signup" element={<SignUp />} />

      {/* protected routes */}
      <Route element={<RequireAuth />}>
        <Route path="home" element={<Home />} />
        <Route path="start-transaction" element={<StartTransaction />} />
      </Route>
    </Routes>
  )
}

export default App
