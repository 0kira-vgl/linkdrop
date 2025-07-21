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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  async function handleRegister() {
    try {
      await register(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setErro(getFirebaseErrorMessage(err.code));
      } else {
        setErro("Erro inesperado. Tente novamente.");
      }
    }
  }

  async function handleLoginWithGoogle() {
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setErro(getFirebaseErrorMessage(err.code));
      } else {
        setErro("Erro inesperado. Tente novamente.");
      }
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
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={handleRegister}>
          Criar
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleLoginWithGoogle}
        >
          Login with Google
        </Button>
      </CardFooter>
      {erro && <p>{erro}</p>}
    </Card>
  );
}
