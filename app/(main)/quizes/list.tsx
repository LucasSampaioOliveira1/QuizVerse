"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { quizes, userProgress } from "@/db/schema";
import { Card } from "./card";
import { toast } from "sonner";
import { upsertUserProgress } from "@/actions/user-progress";

type Props = {
    quizes: typeof quizes.$inferSelect[];
    activeQuizId?: typeof userProgress.$inferSelect.activeQuizId;
};

export const List = ({ quizes, activeQuizId }: Props) => {

    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const onClick = (id: number) => {
        if (pending) return;

        if (id === activeQuizId) {
            return router.push("/home");
        }

        startTransition(() => {
            upsertUserProgress(id)
                .catch(() => toast.error("Algo deu errado."))
        });
    };

    return (
        <div className="pt-6 grid grid-cols-2 lg:grid-cols[repeat(auto-fill,minmax(210px,1fr))] gap-4">
            {quizes.map((quiz) => (
                <Card 
                    key={quiz.id}
                    id={quiz.id}
                    title={quiz.title}
                    imageSrc={quiz.imageSrc}
                    onClick={onClick}
                    disabled={pending}
                    active={quiz.id === activeQuizId}
                />
            ))}
        </div>
    );
};