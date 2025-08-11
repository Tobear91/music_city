import React, { useEffect } from 'react';
import styles from "../../assets/scss/blindtest/Questions.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import QuestionElement from './QuestionElement';
import Image from 'next/image';
import ResponseElement from './ResponseElement';
import { useState } from 'react';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {nextQuestion,addAnswerToStore  } from "../../reducers/blindtest";
import { useRouter } from 'next/router';
import {leaveApplication} from '../../modules/appinteraction'
import { checkCorrection } from '../../modules/checkCorrection';
import { setCorrectionAndScore } from '../../reducers/blindtest';


export default function Questions() {
    const dispatch = useDispatch()

    const router = useRouter();   
    const [currentAnswer, setCurrentAnswer] = useState({
    answer: '',
    showActor: false,
    showPoster: false
});
    const blindtestInfo = useSelector((state)=>state.blindtest)
    const [dispEndQuizz,setDispEndQuiz] = useState(false);


    const saveCurrentAnswer = () => {
        dispatch(addAnswerToStore(currentAnswer));
        setCurrentAnswer({ answer: '', showActor: false, showPoster: false });
    };


      const handleLeaveBuilding = () => {
          leaveApplication(router)
      };
const handleFinishQuiz = () => {
    const updatedAnswerList = [...blindtestInfo.answerList, currentAnswer];

    const correctionList = blindtestInfo.questionList.map(q => q.serieName);
    let correction = [];
    for (let i = 0; i < correctionList.length; i++) {
    correction.push({
    isCorrect: updatedAnswerList[i].answer
        ? checkCorrection(correctionList[i], updatedAnswerList[i].answer)
        : false,  // si pas de réponse, pas correct
    userAnswer: updatedAnswerList[i].answer,
    correctAnswer: correctionList[i],
    indiceNbr: (updatedAnswerList[i].showPoster ? 1 : 0) + (updatedAnswerList[i].showActor ? 1 : 0)
});
    }

    let score = correction.reduce((total, item) => {
        if (!item.isCorrect) {
            return total;
        } else {
            if (item.indiceNbr === 0) return total + 3;
            if (item.indiceNbr === 1) return total + 2;
            if (item.indiceNbr === 2) return total + 1;
            return total;
        }
    }, 0);

    dispatch(setCorrectionAndScore({ correction, score }));

    dispatch(addAnswerToStore(currentAnswer));

    router.push('./results');
};

    const handleNextQuestion = ()=>{
            saveCurrentAnswer();
            dispatch(nextQuestion())}

    useEffect(() => {
    if (blindtestInfo.questionNbr + 1 >= blindtestInfo.questionList.length) {
        setDispEndQuiz(true);
    }
    }, [blindtestInfo.questionNbr]);


    return (
    
    <div className={styles.modalOverlay}>
    <div className={styles.menuBar}>
         <FontAwesomeIcon icon={faCircleXmark}  className={styles.crossClose}  style={{ width: "40px", height: "40px" }} onClick={handleLeaveBuilding}/>
    </div>
        <div className={styles.mainContainer}> 
            <Image src="/img/cloudy_moon.jpg" alt="Cloudy Moon" width={707} height={194} priority />
            <div className={styles.overlaySection}>

                <QuestionElement previewUrl={blindtestInfo.questionList[blindtestInfo.questionNbr].previewURL} totalQuestion={blindtestInfo.questionList.length} questioNumber={blindtestInfo.questionNbr + 1} isCertain={blindtestInfo.questionList[blindtestInfo.questionNbr].isTrackMatchCertain}></QuestionElement>
                <ResponseElement mainActor={blindtestInfo.questionList[blindtestInfo.questionNbr].mainActor} posterUrl= {blindtestInfo.questionList[blindtestInfo.questionNbr].posterPath}     currentAnswer={currentAnswer}
                setCurrentAnswer={setCurrentAnswer}></ResponseElement>

                {!dispEndQuizz && <div className={styles.buttonContainer}>
                    <button className={styles.nextButton} onClick={handleNextQuestion}>
                        Question suivante <FontAwesomeIcon icon={faArrowRight} className={styles.nextFa} />
                    </button>
                </div>}

                {dispEndQuizz && <div className={styles.buttonContainer} onClick={handleFinishQuiz}>
                    <button className={styles.nextButton}>
                        Terminer le quizz <FontAwesomeIcon icon={faArrowRight} className={styles.nextFa} />
                    </button>
                </div>}
               

            </div>
        </div>  
        </div> 
    );
}