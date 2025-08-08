import React, { useEffect,useState } from 'react';
import styles from "../../assets/scss/blindtest/Results.module.scss";
import { checkCorrection } from '../../modules/checkCorrection';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/router';
import {leaveApplication} from '../../modules/appinteraction'
import Image from 'next/image';

export default function Results (){
    const router = useRouter();   

    const blindtestInfo = useSelector((state)=>state.blindtest);
    
    const correctionList = blindtestInfo.questionList.map((data)=>{
        return(data.serieName)
    })

    const userResponse = blindtestInfo.answerList

    
    const handleLeaveBuilding = () => {
        leaveApplication(router)
    };


    const handleRestart = () => {
            router.push('/blindtest-serie');       
        };

    const handleWatchCorrection = ()=>{
        router.push('/blindtest-serie/correction'); 

    }
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




    return (
        <div className={styles.modalOverlay}>
    <div className={styles.menuBar}>
         <FontAwesomeIcon icon={faCircleXmark}  className={styles.crossClose}  style={{ width: "40px", height: "40px" }} onClick={handleLeaveBuilding}/>
    </div>
        <div className={styles.mainContainer}> 
                        <Image src="/img/cloudy_moon.jpg" alt="Cloudy Moon" width={707} height={194} priority />
            
            <div className={styles.overlaySection}>
        <div className={styles.container}>
            <h1 className={styles.title}> Félicitation ! </h1>
            <p className={styles.subtitle}> Votre score est : {score}/{maxScore} </p>
            <p className={styles.subtitle}> Votre niveau est ... </p>
        </div>
        <div className={styles.buttonTriple} >
            <button className={styles.button} onClick={handleWatchCorrection}>
                Voir la correction <FontAwesomeIcon icon={faArrowRight} className={styles.nextFa} />
            </button>
    
            <button className={styles.button} onClick={handleRestart} >
                Relancer le quizz <FontAwesomeIcon icon={faArrowRight} className={styles.nextFa} />
            </button>
            <button className={styles.button}  onClick={handleLeaveBuilding}>
                Sortir du batiment <FontAwesomeIcon icon={faArrowRight} className={styles.nextFa}/>
            </button>
        </div>
        </div>
        </div>
         </div>
    )
}
