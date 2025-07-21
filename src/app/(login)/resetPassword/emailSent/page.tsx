"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PiWarningCircle } from "react-icons/pi";

export default function EmailSent() {
  const router = useRouter();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Verifique seu e-mail</CardTitle>
        <CardDescription>
          Enviamos um link de redefinição de senha para o seu e-mail. Pode levar
          alguns segundos para chegar.
        </CardDescription>

        <div className="mt-3 flex flex-row items-start gap-3 rounded-xl border p-4">
          <PiWarningCircle size={28} />
          <div className="flex-1">
            <h2 className="mb-1 text-base font-semibold">Dica importante</h2>
            <p className="text-xs leading-relaxed text-zinc-50/50">
              O e-mail pode cair nas abas de{" "}
              <span className="font-semibold">Promoções</span> ou{" "}
              <span className="font-semibold">Spam</span>. Dê uma olhadinha por
              lá também!
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Link href="/signIn" passHref>
          <Button asChild type="submit" className="w-full">
            <span>Voltar ao login</span>
          </Button>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-center">
        <span className="text-muted-foreground text-sm">
          Ainda não recebeu o e-mail?{" "}
          <span
            onClick={() => router.back()}
            className="cursor-pointer font-semibold"
          >
            Tentar novamente
          </span>
        </span>
      </CardFooter>
    </Card>
  );
}
