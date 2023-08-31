import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map/Map";
import Sidebar from "../components/Sidebar/Sidebar";
import User from "../components/User/User";
import { useAuth } from "../contexts/FakeAuthContext";
import styles from "./AppLayout.module.css";

export default function AppLayout() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(
    function () {
      if (isAuthenticated === false) {
        navigate("/login", { replace: true });
      }
    },
    [isAuthenticated, navigate]
  );
  return (
    <div className={styles.app}>
      <Sidebar />
      {user ? <User /> : null}
      <Map />
    </div>
  );
}
