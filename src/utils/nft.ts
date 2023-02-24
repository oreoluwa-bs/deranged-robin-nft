export function calculateDifficulty(totalAttempts: number, totalWins: number) {
  const ratio = totalWins / totalAttempts;

  if (totalAttempts === 0) {
    // If there have been no attempts, the difficulty is unknown
    return "???";
  } else if (ratio < 0.1) {
    return "Very Hard";
  } else if (ratio < 0.3) {
    return "Hard";
  } else if (ratio < 0.5) {
    return "Medium";
  } else if (ratio < 0.7) {
    return "Easy";
  } else {
    return "Very Easy";
  }
}

// function calculateDifficultyAlt(
//   range: number,
//   attempts: number,
//   cluesProvided: boolean
// ): number {
//   let difficultyScore = range * (1 + 1 / attempts);

//   if (cluesProvided) {
//     difficultyScore *= 0.8;
//   }

//   difficultyScore = Math.max(1, Math.min(10, difficultyScore));

//   return difficultyScore;
// }

export function calculateGuessSimilarity(guess: string, prompt: string) {
  return guess == prompt;
}
