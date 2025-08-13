import Results from "../../components/blindtest/Results";
import { useSelector } from "react-redux";

function ResultsPage() {
  const user = useSelector((state) => state.user.user);
  if (!user) return;
  return <Results />;
}

export default ResultsPage;
