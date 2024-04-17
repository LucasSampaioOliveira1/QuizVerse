import { Button } from "@/components/ui/button";
import { ClerkLoaded, ClerkLoading, SignUpButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
      <div className="relative w-[240px] h-[240px] lg:w-[424px] lg:h-[424px] mb-8 lg:mb-0">
        <Image src="quizverse.svg" fill alt="quizverse"/>
      </div>
      <div className="flex flex-col items-center gap-y-8">
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px] text-center">Teste seus conhecimentos, desafie sua mente e divirta-se com nossos quizzes!</h1>
          <div>
            <ClerkLoading>
              <Loader className="h-5 w-5 text-muted-foreground animate-spin"/>
            </ClerkLoading>

            <ClerkLoaded>

              <SignedOut>

                <SignUpButton mode="modal" afterSignInUrl="/learn" afterSignUpUrl="/learn">
                  <Button size="lg" variant="secondary" className="w-full">Iniciar</Button>
                </SignUpButton>

                <SignInButton mode="modal" afterSignInUrl="/learn" afterSignUpUrl="/learn">
                  <Button size="lg" variant="primaryOutline" className="w-full">Já tenho uma conta</Button>
                </SignInButton>

              </SignedOut>

              <SignedIn>
                <Button className="w-full" size="lg" variant="secondary" asChild>
                  <Link href="/learn">
                    Continuar Jogando e Aprendendo
                  </Link>
                </Button>
              </SignedIn>

            </ClerkLoaded>
          </div>
      </div>
    </div>
  );
}
