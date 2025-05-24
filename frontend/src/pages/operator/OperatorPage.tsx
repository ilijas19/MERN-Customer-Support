import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const OperatorPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.role !== "operator") {
      navigate("/");
    }
  }, [currentUser]);

  return <div>Opertror page</div>;
};
export default OperatorPage;
