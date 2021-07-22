/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
interface Result {
  height: number;
  weight: number;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseQuery = (query: any): Result => {
  const weight = query.weight;
  const height = query.height;

  if (!weight || !height || isNaN(Number(weight)) || isNaN(Number(height))) {
    throw new Error('Malformatted parameters');
  }

  return {
    weight,
    height,
  };
};

const calculateBmi = (height: number, weight: number): string => {
  const heightInMeters = height / 100;
  const bmi: number = weight / (heightInMeters * heightInMeters);

  switch (true) {
    case bmi < 15:
      return 'Very severely underweight';
    case bmi < 16:
      return 'Severely underweight';
    case bmi < 18.5:
      return 'Underweight';
    case bmi < 25:
      return 'Normal (healthy weight)';
    case bmi < 30:
      return 'Overweight';
    case bmi < 35:
      return 'Obese Class I (Moderately obese)';
    case bmi < 40:
      return 'Obese Class II (Severely obese)';
    case bmi > 40:
      return 'Obese Class III (Very severely obese)';
    default:
      return 'Something went wrong, please try again';
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBMI = (query: any) => {
  try {
    const { weight, height } = parseQuery(query);
    const bmi = calculateBmi(height, weight);

    return {
      weight,
      height,
      bmi,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export default getBMI;
