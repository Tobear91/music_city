import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function VSConnexionPage() {
  const router = useRouter();
  const user = useSelector((state) => state.user.user);
  user.discogs ? router.push("/vinyles-store/wantlist") : router.push("/vinyles-store/connexion");
}

export default VSConnexionPage;
