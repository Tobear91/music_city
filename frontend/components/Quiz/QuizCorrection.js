import styles from "../../assets/scss/quiz/QuizCorrection.module.scss";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Header from "./Header";
import Image from "next/image";

export default function QuizCorrection() {
  // Récuperation des données du quiz depuis Redux
  const { questions, score, total } = useSelector((state) => state.quiz);
  const router = useRouter();
  const { q } = router.query;

  return (
    <div>
      <Header q={q} />
      <div className={styles.container}>
        <Image
          src="/img/cloudy_moon_nobg.png"
          alt="Cloudy Moon"
          width={707}
          height={194}
          priority
        />

        <h1 className={styles.title}>Correction du quiz</h1>

        <p className={styles.score}>
          Score : {score}/{total}
        </p>

        {questions.map((myQuestion, index) => (
          <div key={index} className={styles.questionCard}>
            {myQuestion.image && (
              <div className={styles.coverWrap}>
                <Image
                  src={myQuestion.image}
                  alt="Track cover"
                  width={80}
                  height={80}
                  className={styles.cover}
                />
              </div>
            )}
            <div className={styles.textContainer}>
              <p className={styles.questionText}>
                Question {index + 1}: {myQuestion.question}
              </p>
              <p className={styles.correctAnswer}>
                Réponse correcte : {myQuestion.correctAnswer}
              </p>
              <p
                style={{
                  color:
                    myQuestion.userAnswer === myQuestion.correctAnswer
                      ? "green"
                      : "red",
                }}
              >
                <strong>Votre réponse :</strong>{" "}
                {myQuestion.userAnswer || "Aucune"}
              </p>
            </div>
          </div>
        ))}

        <div className={styles.buttonContainer}>
          <button
            className={styles.endButton}
            onClick={() => router.push("/quiz")}
          >
            Rejouer un quiz
          </button>
        </div>
      </div>
    </div>
  );
}
