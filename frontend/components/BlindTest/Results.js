import React, { useEffect } from 'react';
import styles from "../../assets/scss/blindtest/Results.module.scss";
import { checkCorrection } from '../../modules/checkCorrection';
import { useSelector } from 'react-redux';


export default function Results (){
    
    const blindtestInfo = useSelector((state)=>state.blindtest);
    
    const correctionList = blindtestInfo.questionList.map((data)=>{
        return(data.serieName)
    })

    const userResponse = blindtestInfo.answerList

    let correction = [];

    const checkAnswer = ()=>{
        for (let i=0; i<correctionList.length;i++){
            const poster = userResponse[i].showPoster ? 1 : 0;
            const actor = userResponse[i].showActor ? 1 : 0;
            correction.push({
                isCorrect:checkCorrection(correctionList[i],userResponse[i].answer),
                userAnswer:userResponse[i].answer,
                correctAnswer:correctionList[i],
                indiceNbr:poster+actor
            })
        }
    }
    
    let score = 0;
    let maxScore = correctionList.length*3; 
    const scoreCalculation = ()=>{
            score = correction.reduce((total, item) => {
        if (!item.isCorrect) {
            return total + 0;
        } else {
            if (item.indiceNbr === 0) return total + 3;
            if (item.indiceNbr === 1) return total + 2;
            if (item.indiceNbr === 2) return total + 1;
            return total; 
        }
    }, 0)

    }
    
    checkAnswer()
    scoreCalculation()


    console.log(correction)


    return (
        <div className={styles.container}>
            <h1 className={styles.title}> Félicitation ! </h1>
            <p className={styles.subtitle}> Votre score est : {score}/{maxScore} </p>
            <p className={styles.subtitle}> Votre niveau est ... </p>
        </div>
    )
}
