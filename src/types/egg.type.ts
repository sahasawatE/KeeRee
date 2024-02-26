type EggSchema = {
  amount: {
    a: number;
    b: number;
    c: number;
    d: number;
  };
  egg_number: number[];
  weight_avg: number;
  weight_sum: number;
  trash_eggs: number;
  date: string;
};

export type { EggSchema };
