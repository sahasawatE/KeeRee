type MenuItem = {
  value: string;
  title: string;
};

type EditData = {
  value: string;
  other: string;
  title: string;
  price: number;
}[];

type ResponseAccItem = {
  other: string;
  price: number;
  title: string;
  value: string;
};

type ResponseAcc = {
  date: string;
  expense: ResponseAccItem[];
  receive: ResponseAccItem[];
};

export type { MenuItem, EditData, ResponseAcc, ResponseAccItem };
