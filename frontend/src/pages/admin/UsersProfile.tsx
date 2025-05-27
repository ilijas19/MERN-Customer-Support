import { useParams } from "react-router-dom";
import { useGetSingleUserQuery } from "../../redux/api/adminApiSlice";
import Loader from "../../components/Loader";
import { isApiError } from "../../utils/isApiError";

const UsersProfile = () => {
  const { id } = useParams();

  const { data: user, isLoading, error } = useGetSingleUserQuery(id ?? "");

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    if (isApiError(error)) {
      return <h2 className="text-red-600 text-lg p-3">{error.data.msg}</h2>;
    } else {
      return <h2 className="text-red-600 text-lg p-3">Something Went Wrong</h2>;
    }
  }
  return <div>UsersProfile</div>;
};
export default UsersProfile;
