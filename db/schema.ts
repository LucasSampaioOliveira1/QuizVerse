import { boolean, integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const quizes = pgTable("quizes", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    imageSrc: text("image_src").notNull(),
});


export const quizesRelations = relations(quizes, ({ many }) => ({
    userProgress: many(userProgress),
    units: many(units),
}));


export const units = pgTable("units", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(), //Unit 1
    description: text("description").notNull(), // Learn the basics of Países
    quizId: integer("quiz_id").references(() => quizes.id, { onDelete: "cascade"}).notNull(),
    order: integer("order").notNull(),
});


export const unitsRelations = relations(units, ({ many, one }) => ({
    quiz: one(quizes, {
        fields: [units.quizId],
        references: [quizes.id]
    }),
    lessons: many(lessons),
}));


export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    unitId: integer("unit_id").references(() => units.id, { onDelete: "cascade"}).notNull(),
    order: integer("order").notNull(),
});


export const lessonsRelations = relations(lessons, ({ one, many}) => ({
    unit: one(units, {
        fields: [lessons.unitId],
        references: [units.id],
    }),
    challenges: many(challenges),
}));



export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);



export const challenges = pgTable("challenges", {
    id: serial("id").primaryKey(),
    lessonId: integer("lesson_id").references(() => lessons.id, {onDelete: "cascade"}).notNull(),
    type: challengesEnum("type").notNull(),
    question: text("question").notNull(),
    order: integer("order").notNull(),
});


export const challengesRelations = relations(challenges, ({ one, many}) => ({
    lessons: one(lessons, {
        fields: [challenges.lessonId],
        references: [lessons.id],
    }),
    challengeOptions: many(challengeOptions),
    challengeProgress: many(challengeProgress),
}));


export const challengeOptions = pgTable("challengeOptions", {
    id: serial("id").primaryKey(),
    challengeId: integer("challenge_id").references(() => challenges.id, {onDelete: "cascade"}).notNull(),
    text: text("text").notNull(),
    correct: boolean("correct").notNull(),
    imageSrc: text("image_src"),
    audioSrc: text("audio_src")
});


export const challengeOptionsRelations = relations(challengeOptions, ({ one }) => ({
    challenge: one(challenges, {
        fields: [challengeOptions.challengeId],
        references: [challenges.id],
    }),
}));


export const challengeProgress = pgTable("challengeProgress", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(), //TODO: Confirm this doesn't break, ptbr = Confirme que isso não quebra
    challengeId: integer("challenge_id").references(() => challenges.id, {onDelete: "cascade"}).notNull(),
    completed: boolean("completed").notNull().default(false),
});


export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
    challenge: one(challenges, {
        fields: [challengeProgress.challengeId],
        references: [challenges.id],
    }),
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