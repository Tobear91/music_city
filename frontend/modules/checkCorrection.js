import stringSimilarity from 'string-similarity';


export function checkCorrection(correctAnswer,userAnswer){
    const threshold=0.7;
    const similarity = stringSimilarity.compareTwoStrings(
        correctAnswer.trim().toLowerCase(),
        userAnswer.trim().toLowerCase()
    );

    return similarity >= threshold;
    
}