import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RouteProtector = ({ children }) => {
  const { token, removeAccessToken, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function verifyAccessToken(token) {
      if (!token) {
        toast.warning(
          <div className="flex flex-col px-1.5">
            <h3 className="font-bold text-white text-[16px]">
              Authenticate ⚠️
            </h3>
            <p className="text-xs text-gray-500 font-medium w-full truncate">
              Please login to explore the insights...
            </p>
          </div>
        );
        navigate("../../auth?mode=signin", { replace: true });
        return false;
      }
      try {
        const res = await fetch(`${BASE_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!res.ok || result.success === false) {
          toast.warning(
            <div className="flex flex-col px-1.5">
              <h3 className="font-bold text-white text-[16px]">
                Session Invalid/Expired ⚠️
              </h3>
              <p className="text-xs text-gray-500 font-medium w-full truncate">
                {result.msg}
              </p>
            </div>
          );
          if (token) {
            removeAccessToken();
            setUser({});
          }
          navigate("../../auth?mode=signin", { replace: false });
          return false;
        }
        if (mounted && result.success) console.log(result);
      } catch (e) {
        toast.error(
          <p className="text-[11px] font-semibold">
            Sorry, Something went wrong!😢
          </p>
        );
        console.log(e);
        return false;
      }
    }
    verifyAccessToken(token);

    return () => (mounted = false);
  }, [token, navigate]);

  return children;
};

export default RouteProtector;
