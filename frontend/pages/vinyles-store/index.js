import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function VSConnexionPage() {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  console.log(user);
  if (!user) router.push("/connexion");
  else user.discogs ? router.push("/vinyles-store/wantlist") : router.push("/vinyles-store/connexion");
}

export default VSConnexionPage;
