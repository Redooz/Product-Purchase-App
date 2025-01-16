import { Route, Routes } from "react-router"
import Layout from "./components/Layout"
import Login from "./features/auth/components/Login"
import RequireAuth from "./features/auth/components/RequireAuth"
import Home from "./features/product/components/Home"
import SignUp from './features/auth/components/SignUp';
import StartTransaction from './features/transaction/components/StartTransaction';
import FinishTransaction from './features/transaction/components/FinishTransaction';
import FailedTransaction from './features/transaction/components/FailedTransaction';
import SuccessTransaction from './features/transaction/components/SuccessTransaction';

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
        <Route path="checkout" element={<FinishTransaction />} />
        <Route path="transaction/success" element={<SuccessTransaction />} />
        <Route path="transaction/failed" element={<FailedTransaction />} />
      </Route>
    </Routes>
  )
}

export default App