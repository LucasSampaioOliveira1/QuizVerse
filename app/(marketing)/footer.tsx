import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
    return(
        <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
            <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src="/flor1.svg" alt="flor1" height={30} width={30} className="mr-4 rounded-md"/>
                    Países
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src="/arvore2.svg" alt="arvore2" height={25} width={25} className="mr-4 rounded-md"/>
                    Personagens
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src="/flor1.svg" alt="flor1" height={30} width={30} className="mr-4 rounded-md"/>
                    Famosos
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src="/arvore2.svg" alt="arvore2" height={25} width={25} className="mr-4 rounded-md"/>
                    Jogos
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src="/flor1.svg" alt="flor1" height={30} width={30} className="mr-4 rounded-md"/>
                    Comidas
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image src="/arvore2.svg" alt="arvore2" height={25} width={25} className="mr-4 rounded-md"/>
                    Cidades
                </Button>
            </div>
        </footer>
    );
};