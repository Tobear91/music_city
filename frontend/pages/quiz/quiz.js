import Quiz from "../../components/quiz/Quiz"
import { useSelector } from "react-redux";

function QuizPage() {
  const user = useSelector((state) => state.user.user);
  if (!user) return;
  return <Quiz/>;
}

export default QuizPage;