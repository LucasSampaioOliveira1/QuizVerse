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


        console.log("Seeding finished");
    } catch (error) {
        console.log(error);
        throw new Error("Falid to seed the database");
    }
};

main();