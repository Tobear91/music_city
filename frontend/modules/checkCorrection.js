import stringSimilarity from 'string-similarity';

export function checkCorrection(correctAnswer, userAnswer) {
    const threshold = 0.7;
    const safeCorrect = (correctAnswer || '').trim().toLowerCase();
    const safeUser = (userAnswer || '').trim().toLowerCase();
    const similarity = stringSimilarity.compareTwoStrings(safeCorrect, safeUser);
    return similarity >= threshold;
}