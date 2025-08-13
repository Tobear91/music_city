import Correction from "../../components/blindtest/Correction";
import { useSelector } from "react-redux";

function CorrectionPage() {
  const user = useSelector((state) => state.user.user);
  if (!user) return;
  return <Correction />;
}

export default CorrectionPage;
