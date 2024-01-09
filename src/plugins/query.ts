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

type operationString = "<" | "<=" | "==" | "<" | "<=" | "!=";
type collectionName = "collect-egg" | "accounting" | "food";

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
        ) => {
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
        ) => {
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
        ) => {
          try {
            await checking();
            await updateDoc(doc(db, collectionName, id), value);
          } catch (_err) {
            throw new Error("ไม่สามารถเข้าถึง Database ได้");
          }
        },
        delete: async (collectionName: collectionName, id: string) => {
          try {
            await checking();
            await deleteDoc(doc(db, collectionName, id));
          } catch (_err) {
            throw new Error("ไม่สามารถเข้าถึง Database ได้");
          }
        },
      },
    },
  };
});
