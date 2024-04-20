"use client";

import { quizes } from "@/db/schema";
import { Card } from "./card";

type Props = {
    quizes: typeof quizes.$inferSelect[];
    activeQuizId: number;
};

export const List = ({ quizes, activeQuizId }: Props) => {
    return (
        <div className="pt-6 grid grid-cols-2 lg:grid-cols[repeat(auto-fill,minmax(210px,1fr))] gap-4">
            {quizes.map((quiz) => (
                <Card 
                    key={quiz.id}
                    id={quiz.id}
                    title={quiz.title}
                    imageSrc={quiz.imageSrc}
                    onClick={() => {}}
                    disabled={false}
                    active={quiz.id === activeQuizId}
                />
            ))}
        </div>
    );
};