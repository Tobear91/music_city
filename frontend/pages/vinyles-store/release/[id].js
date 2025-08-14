import Release from "../../../components/VinylesStore/Release";
import { useSelector } from "react-redux";

function releasePage() {
  const user = useSelector((state) => state.user.user);
  if (!user) return;
  return <Release />;
}

export default releasePage;
