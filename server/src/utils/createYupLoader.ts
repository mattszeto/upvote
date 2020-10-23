import DataLoader from "dataloader";
import { Yup } from "../entities/Yup";

// [{postId: 5, userId: 10}]
// [{postId: 5, userId: 10, value: 1}]
export const createYupLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Yup | null>(
    async (keys) => {
      const yups = await Yup.findByIds(keys as any);
      const yupIdsToYup: Record<string, Yup> = {};
      yups.forEach((yup) => {
        yupIdsToYup[`${yup.userId}|${yup.postId}`] = yup;
      });

      return keys.map((key) => yupIdsToYup[`${key.userId}|${key.postId}`]);
    }
  );
