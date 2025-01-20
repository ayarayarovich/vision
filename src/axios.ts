import axios from "axios";
import { DateTime } from "luxon";
import { toast } from "sonner";
import { commands } from "@/bindings";

export const yandexVisionAxios = axios.create({
  baseURL: "https://cors.ayarayarovich.ru/https://ocr.api.cloud.yandex.net",
});

const storage = {
  iam: "",
  exp: "",
};

yandexVisionAxios.interceptors.request.use(
  async (req) => {
    let iam = storage.iam;
    let exp = storage.exp;

    if (!iam || (exp && DateTime.fromISO(exp) <= DateTime.now().plus({ hours: 2 }))) {
      const token = await commands.getIam();
      if (token) {
        iam = token.iamToken;
        exp = token.expiresAt;
      }
    }

    if (!iam || !exp) {
      toast.error("Не удалось получить IAM-токен");
      throw new Error("failed to retrieve iam token");
    }

    storage.iam = iam;
    storage.exp = exp;

    req.headers["Authorization"] = `Bearer ${iam}`;
    req.headers["x-folder-id"] = "b1ganarb4t90avpnb5ma";
    req.headers["x-data-logging-enabled"] = "true";

    return req;
  },
  (e) => Promise.reject(e)
);
