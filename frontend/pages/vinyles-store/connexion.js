import Connexion from "../../components/VinylesStore/Connexion";
import { useSelector } from "react-redux";

function VSConnexionPage() {
  const user = useSelector((state) => state.user.user);
  if (!user) return;
  return <Connexion />;
}

export default VSConnexionPage;
