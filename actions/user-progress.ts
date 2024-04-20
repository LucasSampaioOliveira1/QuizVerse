"use server";


import { auth, currentUser } from "@clerk/nextjs";
import { getQuizById, getUserProgress } from "@/db/queries";
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const upsertUserProgress = async (quizId: number) => {
    const { userId } = await auth();
    const user = await currentUser();


    if (!userId || !user) {
        throw new Error("não autorizado");
    }


    const quiz = await getQuizById(quizId);


    if (!quiz) {
        throw new Error("Quiz não encontrado")
    }


    // Todo: Enable once units and lessons are added, ptbr= Ative quando as unidades e lições forem adicionadas
    // if (!quiz.units.length || !quiz.units[0].lessons.length) {
    //     throw new Error("Quiz está vazio no momento")
    // } 


    const existingUserProgress = await getUserProgress();

    if (existingUserProgress) {
        await db.update(userProgress).set({
            activeQuizId: quizId,
            userName: user.firstName || "User",
            userImageSrc: user.imageUrl || "/crocodile.svg",
        });

        revalidatePath("/quizes");
        revalidatePath("/home");
        redirect("/home");
    }


    await db.insert(userProgress).values({
        userId,
        activeQuizId: quizId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/crocodile.svg",
    });

    revalidatePath("/quizes");
    revalidatePath("/home");
    redirect("/home");
}