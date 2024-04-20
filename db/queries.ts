import { cache } from "react";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { userProgress, quizes } from "@/db/schema";
import db from "@/db/drizzle";


export const getUserProgress = cache(async () => {
    const { userId } = await auth();

    if(!userId) {
        return null;
    }

    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
        with: {
            activeQuiz: true,
        },
    });

    return data;
});

export const getQuizes = cache(async () => {
    const data = await db.query.quizes.findMany();

    return data;
});


export const getQuizById = cache(async (quizId: number) => {
    const data = await db.query.quizes.findFirst({
        where: eq(quizes.id, quizId),

        // Todo: Populate units and lessons,  ptbr = Preencher unidades e lições
    });

    return data;
});