import { cache } from "react";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { userProgress, quizes, units, lessons, challengeProgress } from "@/db/schema";
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


export const getUnits = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();


    if(!userId || !userProgress?.activeQuizId) {
        return [];
    }

    //TODO: confirm whether order is needed
    const data = await db.query.units.findMany({
        where: eq(units.quizId, userProgress.activeQuizId),
        with: {
            lessons: {
                with: {
                    challenges: {
                        with: {
                            challengeProgress:{
                                where: eq(
                                    challengeProgress.userId,
                                    userId,
                                ),
                            },
                        },
                    },
                },
            },
        },
    });


    const normalizeData = data.map((unit) => {
        const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
            const allCompletedChallenges = lesson.challenges.every((challenge) => {
                return challenge.challengeProgress
                && challenge.challengeProgress.length > 0
                && challenge.challengeProgress.every((progress) => progress.completed);
            });

            return { ...lesson, completed: allCompletedChallenges};
        });

        return { ...unit, lessons: lessonsWithCompletedStatus};
    });

    return normalizeData;

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