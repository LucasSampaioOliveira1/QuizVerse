import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const quizes = pgTable("quizes", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    imageSrc: text("image_src").notNull(),
});


export const quizesRelations = relations(quizes, ({ many }) => ({
    userProgress: many(userProgress),
}));


export const userProgress = pgTable("user_progress",{
    userId : text("user_id").primaryKey(),
    userName: text("user_name").notNull().default("User"),
    userImageSrc: text("user_image_src").notNull().default("/crocodile.svg"),
    activeQuizId: integer("active_quiz_id").references(() => quizes.id, {onDelete: "cascade"}),
    hearts: integer("hearts").notNull().default(5),
    points: integer("points").notNull().default(0), 
});


export const userProgressRelations = relations(userProgress, ({ one }) =>
({
    activeQuiz: one(quizes, {
    fields: [userProgress.activeQuizId],
    references: [quizes.id]    
    }),
}));