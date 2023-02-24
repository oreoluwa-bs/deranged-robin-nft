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
  const freqOne = wordFrequency(guess);
  const freqTne = wordFrequency(prompt);

  const dictionary = {
    ...addWordsToDictionary(freqOne),
    ...addWordsToDictionary(freqTne),
  };

  const vec = {
    vectorA: wordFrequencyToVector(freqOne, dictionary),
    vectorB: wordFrequencyToVector(freqTne, dictionary),
  };

  return cosineSimilarity(vec.vectorA, vec.vectorB);
}

/**
 * Gets the frequency of words in a sentence
 */
export function wordFrequency(sentence: string) {
  const words = sentence.split(" ").filter((item) => item.trim().length > 0);
  const wordFrequency: { [key: string]: number } = {};

  words.forEach((word) => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  return wordFrequency;
}

/**
 * Get a dictionary of words in a sentence
 */
export function addWordsToDictionary(wordFrequency: { [key: string]: number }) {
  let dictionary: { [key: string]: boolean } = {};

  for (const key in wordFrequency) {
    dictionary[key] = true;
  }

  return dictionary;
}

export function wordFrequencyToVector(
  wordFrequency: {
    [key: string]: number;
  },
  dictionary: {
    [key: string]: boolean;
  }
) {
  const wordCountVector = [];

  for (const term in dictionary) {
    wordCountVector.push(wordFrequency[term] || 0);
  }

  return wordCountVector;
}

export function dotProduct(vectorA: number[], vectorB: number[]) {
  let product = 0;

  for (let i = 0; i < vectorA.length; i++) {
    product += vectorA[i] * vectorB[i];
  }

  return product;
}

export function magnitude(vector: number[]) {
  let sum = 0;

  for (let i = 0; i < vector.length; i++) {
    sum += vector[i] * vector[i];
  }
  return Math.sqrt(sum);
}

export function cosineSimilarity(vectorA: number[], vectorB: number[]) {
  return (
    dotProduct(vectorA, vectorB) / (magnitude(vectorA) * magnitude(vectorB))
  );
}
