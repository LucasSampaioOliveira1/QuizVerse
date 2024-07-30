import { cache } from "react";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { userProgress, quizes, units, challengeProgress, lessons, challenges } from "@/db/schema";
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


export const getQuizProgress = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();

    if (!userId || !userProgress?.activeQuizId) {
        return null;
    }

    const unitsInActiveQuiz = await db.query.units.findMany({
        orderBy: (units, { asc }) => [asc(units.order)],
        where: eq(units.quizId, userProgress.activeQuizId),
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                with: {
                    unit: true,
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId),
                            },
                        },
                    },
                },
            },
        },
    });

    const firstUncompletedLesson = unitsInActiveQuiz
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
        //TODO: If something does not work, check the last if clause
        return lesson.challenges.some((challenge) => {
            return !challenge.challengeProgress 
            || challenge.challengeProgress.length === 0
            || challenge.challengeProgress.some((progress) => progress.completed === false)
        });
    });

    return {
        activeLesson: firstUncompletedLesson,
        activeLessonId: firstUncompletedLesson?.id,
    };
});


export const getLesson = cache(async (id?: number) => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const quizProgress = await getQuizProgress();

    const lessonId = id || quizProgress?.activeLessonId;

    if (!lessonId) {
        return null;
    }

    const data = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            challenges: {
                orderBy: (challenges, { asc }) => [asc(challenges.order)],
                with: {
                    challengeOptions: true,
                    challengeProgress: {
                        where: eq(challengeProgress.userId, userId),
                    },
                },
            },
        },
    });

    if (!data || !data.challenges) {
        return null;
    }

    const normalizeChallenges = data.challenges.map((challenge) => {
         //TODO: If something does not work, check the last if clause
        const completed = challenge.challengeProgress 
        && challenge.challengeProgress.length > 0
        && challenge.challengeProgress.every((progress) => progress.completed)

        return { ...challenge, completed};
    });

    return { ...data, challenges: normalizeChallenges};
});

export const getLessonPercentage = cache(async () => {
    const quizProgress = await getQuizProgress();

    if (!quizProgress?.activeLessonId) {
        return 0;
    }


    const lesson = await getLesson(quizProgress.activeLessonId);

    if (!lesson) {
        return 0;
    }

    const allCompletedChallenges = lesson.challenges
    .filter((challenge) => challenge.completed);
    const percentage = Math.round(
        (allCompletedChallenges.length / lesson.challenges.length) * 100,
    );

    return percentage;
});