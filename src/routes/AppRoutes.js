import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../component/dashboard/dashboard";
import PrivateRoute from "../component/widgets/PrivateRoutes";
import Login from "../component/auth/login";
import Signup from "../component/auth/signup";

const AppRoutes = () => {
    return (
      <div>
        <BrowserRouter>
          <Routes>
          <Route exact path='/' element={<PrivateRoute />}>
            <Route path='/*' element={<Dashboard/>}/>
            <Route path='/' element={<Dashboard/>}/>
          </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  };
  
  export default AppRoutes;