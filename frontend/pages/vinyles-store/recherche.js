import Recherche from "../../components/VinylesStore/Recherche";
import { useSelector } from "react-redux";

function recherchePage() {
  const user = useSelector((state) => state.user.user);
  if (!user) return;
  return <Recherche />;
}

export default recherchePage;
