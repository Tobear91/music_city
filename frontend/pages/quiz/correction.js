import QuizCorrection from "../../components/quiz/QuizCorrection";
import { useSelector } from "react-redux";

function Correction() {
  const user = useSelector((state) => state.user.user);
  if (!user) return;
  return <QuizCorrection />;
}

export default Correction;
