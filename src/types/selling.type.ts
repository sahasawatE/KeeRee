type SellingSchema = {
  date: string;
  eggs: { price: number; amount: number }[];
};

type SumSchema = {
  sum_sell: number[];
  sum_collect: number[];
  from_yesterday: number[];
  redord_date: string;
};

type SumDetails = {
  sell: number[];
  collect: number[];
  yesterday: number[];
};

export type { SellingSchema, SumSchema, SumDetails };
