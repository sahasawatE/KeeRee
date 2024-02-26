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
import { useStore } from "~/stores";

type operationString = "<" | "<=" | "==" | "<" | "<=" | "!=";
type collectionName =
  | "collect-egg"
  | "accounting"
  | "food"
  | "selling"
  | "selling-price"
  | "eggs-sum"
  | "chicken"
  | "cycle-date";

export default defineNuxtPlugin((_app) => {
  const db = useFirestore();
  const store = useStore();
  const { $auth, $router, $dialog } = useNuxtApp();

  const checking = async () => {
    const tk = await $auth.checkToken();
    if (!tk) {
      $router.push("/");
    }
  };

  const handler = {
    get: async (
      collectionName: collectionName,
      key?: string,
      optStr?: operationString,
      value?: string,
    ): Promise<Response[]> => {
      try {
        await checking();
        await checkCycle();
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
      } catch (err) {
        throw new Error((err as string) || "ไม่สามารถเข้าถึง Database ได้");
      }
    },
    post: async (
      collectionName: collectionName,
      value: { [key: string]: any },
    ): Promise<void> => {
      try {
        await checking();
        await checkCycle("post");
        const cl = collection(db, collectionName);
        await addDoc(cl, value);
      } catch (err) {
        throw new Error((err as string) || "ไม่สามารถเข้าถึง Database ได้");
      }
    },
    update: async (
      collectionName: collectionName,
      id: string,
      value: { [key: string]: any },
    ): Promise<void> => {
      try {
        await checking();
        await checkCycle("update");
        await updateDoc(doc(db, collectionName, id), value);
      } catch (err) {
        throw new Error((err as string) || "ไม่สามารถเข้าถึง Database ได้");
      }
    },
    delete: async (
      collectionName: collectionName,
      id: string,
    ): Promise<void> => {
      try {
        await checking();
        // await checkCycle();
        await deleteDoc(doc(db, collectionName, id));
      } catch (err) {
        throw new Error((err as string) || "ไม่สามารถเข้าถึง Database ได้");
      }
    },
  };

  const checkCycle = async (method = "") => {
    try {
      const today = moment().format("DD/MM/YYYY");
      const cl = collection(db, "cycle-date");
      const qr = query(cl);
      const result = await getDocs(qr);
      const data = result.docs.map((e) => ({
        id: e.id,
        data: e.data(),
      }));

      if (!data.length) {
        await addDoc(cl, {
          date: today,
        });
        store.setCanReset(false);
      } else {
        const cy = data[0].data as { date: string };
        if (
          moment(cy.date, "DD/MM/YYYY").add(3, "month").format("DD/MM/YYYY") ===
          today
        ) {
          store.setCanReset(true);
          if (method === "update" || method === "post") {
            throw String("กรุณาดาวน์โหลดข้อมูล และ reset ระบบ");
          } else {
            $dialog.toast.warning("กรุณาดาวน์โหลดข้อมูล และ reset ระบบ");
          }
        }
      }
    } catch (err) {
      throw String(err);
    }
  };

  const deleteCollection = async (collectionName: collectionName) => {
    try {
      await checking();
      const id = (await handler.get(collectionName)).map((e) => e.id);

      await Promise.all(
        id.map(async (e) => await handler.delete(collectionName, e)),
      );
    } catch (_err) {
      throw String("ไม่สามารถเข้าถึง Database ได้");
    }
  };

  return {
    provide: {
      query: handler,
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
            throw String("ไม่สามารถเข้าถึง Database ได้");
          }
        },
        async reset() {
          try {
            const collections = [
              "accounting",
              "chicken",
              "collect-egg",
              "eggs-sum",
              "food",
              "selling",
              "selling-price",
              "cycle-date",
            ] as collectionName[];

            await Promise.all(
              collections.map(async (e) => await deleteCollection(e)),
            );
          } catch (err) {
            throw String(err);
          }
        },
      },
    },
  };
});
