import moment from "moment";
import { useFirestore } from "vuefire";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Query,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import type { Response } from "~/types/query.type";

type operationString = "<" | "<=" | "==" | "<" | "<=" | "!=";
type collectionName =
  | "collect-egg"
  | "accounting"
  | "food"
  | "selling"
  | "selling-price"
  | "eggs-sum";

export default defineNuxtPlugin((_app) => {
  const db = useFirestore();
  const { $auth, $router } = useNuxtApp();

  const checking = async () => {
    const tk = await $auth.checkToken();
    if (!tk) {
      $router.push("/");
    }
  };

  return {
    provide: {
      query: {
        get: async (
          collectionName: collectionName,
          key?: string,
          optStr?: operationString,
          value?: string,
        ): Promise<Response[]> => {
          try {
            await checking();
            const cl = collection(db, collectionName);
            let qr: Query;
            if (key && optStr && value) {
              qr = query(cl, where(key, optStr, value));
            } else {
              qr = query(cl);
            }
            const result = await getDocs(qr);
            const data = result.docs.map((e) => ({
              id: e.id,
              data: e.data(),
            }));
            return data;
          } catch (_err) {
            throw new Error("ไม่สามารถเข้าถึง Database ได้");
          }
        },
        post: async (
          collectionName: collectionName,
          value: { [key: string]: any },
        ): Promise<void> => {
          try {
            await checking();
            const cl = collection(db, collectionName);
            await addDoc(cl, value);
          } catch (_err) {
            throw new Error("ไม่สามารถเข้าถึง Database ได้");
          }
        },
        update: async (
          collectionName: collectionName,
          id: string,
          value: { [key: string]: any },
        ): Promise<void> => {
          try {
            await checking();
            await updateDoc(doc(db, collectionName, id), value);
          } catch (_err) {
            throw new Error("ไม่สามารถเข้าถึง Database ได้");
          }
        },
        delete: async (
          collectionName: collectionName,
          id: string,
        ): Promise<void> => {
          try {
            await checking();
            await deleteDoc(doc(db, collectionName, id));
          } catch (_err) {
            throw new Error("ไม่สามารถเข้าถึง Database ได้");
          }
        },
      },
      db: {
        getLastSum: async (): Promise<Response[]> => {
          type EggsSum = {
            from_yesterday: number[];
            sum_collect: number[];
            sum_sell: number[];
            record_date: string;
          };
          try {
            await checking();
            const cl = collection(db, "eggs-sum");
            const qr = query(cl);

            const result = await getDocs(qr);
            if (result.docs.length) {
              const date_result = result.docs.map((e) => {
                const egg = e.data() as EggsSum;
                const date = moment(egg.record_date, "DD/MM/YYYY").toDate();
                return date;
              });
              const newest_date = moment(
                date_result.reduce((a, b) => (a > b ? a : b)),
              ).format("DD/MM/YYYY");
              const data = result.docs.find((e) => {
                const d = e.data() as EggsSum;
                return d.record_date === newest_date;
              });
              if (data) {
                return [
                  {
                    id: data.id,
                    data: data.data(),
                  },
                ];
              } else {
                return [];
              }
            } else {
              return [];
            }
          } catch (_err) {
            throw new Error("ไม่สามารถเข้าถึง Database ได้");
          }
        },
      },
    },
  };
});
