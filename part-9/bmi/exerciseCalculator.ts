/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
enum ratingDescription {
  BAD = 'You are below your target',
  NORMAL = 'Not too bad but could be better',
  GOOD = 'Great job - Keep going',
}

interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface Error {
  error: string;
}

interface ratingInterface {
  rating: number;
  ratingDescription: ratingDescription;
}

interface ParseResult {
  dailyExercises: number[];
  target: number;
}

const calculateAverage = (arrayOfNumber: Array<number>): number => {
  return (
    arrayOfNumber.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    ) / arrayOfNumber.length
  );
};

const isSuccess = (target: number, arrayOfNumber: Array<number>): boolean => {
  return target < calculateAverage(arrayOfNumber) ? true : false;
};

const ratingCalculator = (target: number, average: number): ratingInterface => {
  const lowSuccess = target * 0.8;
  const highSuccess = target * 1.2;

  switch (true) {
    case average < lowSuccess:
      return {
        rating: 1,
        ratingDescription: ratingDescription.BAD,
      };
    case average > highSuccess:
      return {
        rating: 3,
        ratingDescription: ratingDescription.GOOD,
      };
    default:
      return {
        rating: 2,
        ratingDescription: ratingDescription.NORMAL,
      };
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseExercise = (body: any): ParseResult => {
  const { daily_exercises, target } = body;

  if (!daily_exercises || !target) {
    throw new Error('Parameters missing');
  }

  if (daily_exercises.some(isNaN)) {
    throw new Error('Malformatted parameters');
  }

  return {
    dailyExercises: daily_exercises.map(Number),
    target: Number(target),
  };
};

const exerciseCalculator = (body: Body): ExerciseResult | Error => {
  try {
    const { dailyExercises, target } = parseExercise(body);

    const periodLength = dailyExercises.length;
    const trainingDays = dailyExercises.filter((a) => a != 0).length;

    const ratingObject = ratingCalculator(
      target,
      calculateAverage(dailyExercises),
    );

    return {
      periodLength,
      trainingDays,
      success: isSuccess(target, dailyExercises),
      rating: ratingObject.rating,
      ratingDescription: ratingObject.ratingDescription,
      target,
      average: calculateAverage(dailyExercises),
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export default exerciseCalculator;
