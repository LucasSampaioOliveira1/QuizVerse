import { cache } from "react";

import db from "@/db/drizzle";

export const getQuizes = cache(async () => {
    const data = await db.query.quizes.findMany();

    return data;
});