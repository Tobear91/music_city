import Wantlist from "../../components/VinylesStore/Wantlist";
import { useSelector } from "react-redux";

function wantlistPage() {
  const user = useSelector((state) => state.user.user);
  if (!user) return;
  return <Wantlist />;
}

export default wantlistPage;
