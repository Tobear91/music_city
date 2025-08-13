import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function VSConnexionPage() {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  if (!user) return;

  // Si le user est discogs connecté on le dirige directement sur sa collection, sinon on lui repropose la connexion
  else user.discogs ? router.push("/vinyles-store/collection") : router.push("/vinyles-store/connexion");
}

export default VSConnexionPage;
