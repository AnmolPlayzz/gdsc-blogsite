import { Google } from "arctic";

const url = process.env.APP_URL ?? "";

export const google = new Google(
    process.env.GOOGLE_CLIENT_ID ?? "",
    process.env.GOOGLE_CLIENT_SECRET ?? "",
    url + "/login/google/callback"
);