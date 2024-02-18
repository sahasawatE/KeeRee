type RowData = {
  in: string;
  out: string;
};

type ChickenSchema = {
  date: string;
  row: {
    a: RowData;
    b: RowData;
    c: RowData;
    d: RowData;
  };
};

export type { RowData, ChickenSchema };
