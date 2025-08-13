import Homepage from "../../components/blindtest/Homepage";
import { useSelector } from "react-redux";

function BlindTestHomePage() {
  const user = useSelector((state) => state.user.user);
  if (!user) return;
  return <Homepage />;
}

export default BlindTestHomePage;
