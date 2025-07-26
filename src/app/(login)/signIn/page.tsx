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
import { login, loginWithGoogle } from "@/firebase/authentication";
import { getFirebaseErrorMessage } from "@/firebase/firebaseErrors";
import { FirebaseError } from "firebase/app";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function SignIn() {
  const router = useRouter();

  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoadingLogin(true);
    try {
      await login(email, password);
      router.push("/dashboard");
      // não reseta o loading aqui, pois a tela será desmontada
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        toast.error(getFirebaseErrorMessage(err.code));
      } else {
        toast.error("Erro inesperado. Tente novamente.");
      }
      setIsLoadingLogin(false); // só reseta o loading se der erro
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
        <CardTitle>Faça login na sua conta</CardTitle>
        <CardDescription>
          Digite seu e-mail abaixo para fazer login na sua conta
        </CardDescription>
        <CardAction>
          <Link href="/signUp">
            <Button variant="link" className="cursor-pointer">
              Cadastrar-se
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <form onSubmit={handleLogin} className="space-y-6">
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={isLoadingLogin || isLoadingGoogle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <a
                  href="/resetPassword"
                  className="ml-auto inline-block text-sm font-medium underline-offset-4 hover:underline"
                >
                  Esqueceu sua senha?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                disabled={isLoadingLogin || isLoadingGoogle}
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
            disabled={isLoadingLogin || isLoadingGoogle}
          >
            <Loader2Icon
              className={twMerge(
                isLoadingLogin ? "block animate-spin" : "hidden",
              )}
            />
            {isLoadingLogin ? "Entrando..." : "Login"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={isLoadingLogin || isLoadingGoogle}
            onClick={handleLoginWithGoogle}
          >
            <Loader2Icon
              className={twMerge(
                isLoadingGoogle ? "block animate-spin" : "hidden",
              )}
            />
            Login com Google
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
