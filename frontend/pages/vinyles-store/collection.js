import Collection from "../../components/VinylesStore/Collection";
import { useSelector } from "react-redux";

function collectionPage() {
  const user = useSelector((state) => state.user.user);
  if (!user) return;
  return <Collection />;
}

export default collectionPage;
