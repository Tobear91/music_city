import Questions from "../../components/blindtest/Questions";
import { useSelector } from "react-redux";

function QuestionsPage() {
  const user = useSelector((state) => state.user.user);
  if (!user) return;
  return <Questions />;
}

export default QuestionsPage;
