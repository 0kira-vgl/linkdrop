import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="container flex flex-col items-center gap-2 py-8 text-center md:py-16 lg:py-20 xl:gap-4">
        <div className="flex-col items-center justify-center">
          <h1 className="text-primary leading-tighter mb-1 text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
            Construa seu Hub Pessoal
          </h1>
          <p className="text-foreground max-w-3xl text-base text-balance sm:text-lg">
            Uma plataforma open source para criar e compartilhar sua página de
            links personalizada. Rápido, acessível e fácil de usar com qualquer
            stack.
          </p>
        </div>

        <div className="flex gap-2.5">
          <Link
            className={buttonVariants({
              size: "lg",
            })}
            href="/dashboard"
          >
            <span className="text-base">Começar</span>
          </Link>

          <a
            href="https://github.com/0kira-vgl/linkdrop"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
            })}
          >
            <span className="text-base">GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
}
