"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginWithGoogle, register } from "@/firebase/authentication";
import { getFirebaseErrorMessage } from "@/firebase/firebaseErrors";
import { FirebaseError } from "firebase/app";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { saveUserToFirestore } from "@/firebase/firestore";

export default function SignUp() {
  const router = useRouter();

  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setIsLoadingRegister(true);
    try {
      // cria o usuário com email e senha no firebase authentication
      const userCredential = await register(email, password);

      // pega os dados do usuário que acabou de ser criado (como uid e email)
      const user = userCredential.user;

      // salva os dados do usuário (uid, apelido e email) no cloud firestore
      await saveUserToFirestore(user.uid, name, email);

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        toast.error(getFirebaseErrorMessage(err.code));
      } else {
        toast.error("Erro inesperado. Tente novamente.");
      }
      setIsLoadingRegister(false); // só reseta o loading se der erro
    }
  }

  async function handleLoginWithGoogle() {
    setIsLoadingGoogle(true);
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        toast.error(getFirebaseErrorMessage(err.code));
      } else {
        toast.error("Erro inesperado. Tente novamente.");
      }
      setIsLoadingGoogle(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Crie já sua conta</CardTitle>
        <CardDescription>
          Digite seus dados abaixo para criar sua conta
        </CardDescription>
        <CardAction>
          <Link href="/signIn">
            <Button variant="link" className="cursor-pointer">
              Já tem conta?
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <form onSubmit={handleRegister} className="space-y-6">
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Apelido</Label>
              <Input
                id="name"
                placeholder="Como devemos te chamar?"
                required
                disabled={isLoadingRegister || isLoadingGoogle}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={isLoadingRegister || isLoadingGoogle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                disabled={isLoadingRegister || isLoadingGoogle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Toaster richColors />
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoadingRegister || isLoadingGoogle}
          >
            <Loader2Icon
              className={twMerge(
                isLoadingRegister ? "block animate-spin" : "hidden",
              )}
            />
            {isLoadingRegister ? "Criando..." : "Criar"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={isLoadingRegister || isLoadingGoogle}
            onClick={handleLoginWithGoogle}
          >
            <Loader2Icon
              className={twMerge(
                isLoadingGoogle ? "block animate-spin" : "hidden",
              )}
            />
            Criar com Google
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
