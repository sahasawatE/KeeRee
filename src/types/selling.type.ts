type SellingSchema = {
  date: string;
  eggs: { price: number; amount: number }[];
  price_from: string;
};

type SumSchema = {
  sum_sell: number[];
  sum_collect: number[];
  from_yesterday: number[];
  record_date: string;
  trash_eggs: number;
};

type SumDetails = {
  sell: number[];
  collect: number[];
  yesterday: number[];
};

export type { SellingSchema, SumSchema, SumDetails };
