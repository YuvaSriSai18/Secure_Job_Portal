import { useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import { Button } from "@/components/ui/button";
import * as API from "@/apis/index";
import { useSelector, useDispatch } from "react-redux";
import { clearUserData, selectUserData } from "./reducers/auth/authSlice";
export default function App() {
  const userData = useSelector(selectUserData);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await API.logout();
      localStorage.removeItem('accessToken')
      // Optional: clear Redux user state here
      dispatch(clearUserData());
      window.location.reload();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-200 min-h-screen">
      {userData.email && (
        <div className="p-4 flex justify-end">
          <Button variant="outline" onClick={handleLogout} disabled={loading}>
            {loading ? "Logging Out..." : "Logout"}
          </Button>
        </div>
      )}
      <AppRoutes />
    </div>
  );
}
