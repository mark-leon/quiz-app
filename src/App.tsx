import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authContext/AuthContext";
import Questions from "./components/questions/Questions";
import Answers from "./components/answers/Answers";
import SignIn from "./components/auth/Signin";

const PrivateRoute: React.FC<{
  component: React.FC;
  role: "admin" | "user";
  path: string;
}> = ({ component: Component, role, ...rest }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (user.role !== role) {
    return <Navigate to="/signin" />;
  }

  return <Component {...rest} />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/questions"
            element={<PrivateRoute component={Questions} role="admin" />}
          />
          <Route
            path="/answers"
            element={<PrivateRoute component={Answers} role="user" />}
          />
          <Route path="/" element={<Navigate to="/signin" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
