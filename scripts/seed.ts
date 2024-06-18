import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, {schema});

const main = async () => {
    try {
        console.log("Seeding database");

        await db.delete(schema.quizes);
        await db.delete(schema.userProgress);
        await db.delete(schema.units);
        await db.delete(schema.lessons);
        await db.delete(schema.challenges);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challengeProgress);


        await db.insert(schema.quizes).values([
            {
                id: 1,
                title: "Países",
                imageSrc: "/brasil.svg",
            },
            {
                id: 2,
                title: "Personagens",
                imageSrc: "/personagem.svg",
            },
            {
                id: 3,
                title: "Jogos",
                imageSrc: "/jogos.svg",
            },
            {
                id: 4,
                title: "Comidas",
                imageSrc: "/comida.svg",
            },
            {
                id: 5,
                title: "Cidades",
                imageSrc: "/cidade.svg",
            },
            {
                id: 6,
                title: "Jogadores de Futebol",
                imageSrc: "/jogador.svg",
            },
        ]);


        await db.insert(schema.units).values([
            {
                id: 1,
                quizId: 1,
                title: "Países",
                description: "Aprendendo o básico sobre Países",
                order: 1
            }
        ]);


        await db.insert(schema.lessons).values([
            {
                id: 1,
                unitId: 1,
                order: 1,
                title: "Bandeiras",
            },

            {
                id: 2,
                unitId: 1,
                order: 2,
                title: "Localizações",
            },
        ]);


        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonId: 1,
                type: "SELECT",
                order: 1,
                question: "Essa bandeira e de qual País ?"
            },
        ]);


        await db.insert(schema.challengeOptions).values([
            {
                id: 1,
                challengeId: 1,
                imageSrc: "/brasil.svg",
                correct: true,
                text: "Brasil",
                audioSrc: "",
            },

            {
                id: 2,
                challengeId: 1,
                imageSrc: "/paises/canada.svg",
                correct: false,
                text: "Canadá",
                audioSrc: "",
            },

            {
                id: 3,
                challengeId: 1,
                imageSrc: "/paises/estados-unidos.svg",
                correct: false,
                text: "EUA",
                audioSrc: "",
            }
        ])

        console.log("Seeding finished");
    } catch (error) {
        console.log(error);
        throw new Error("Falid to seed the database");
    }
};

main();