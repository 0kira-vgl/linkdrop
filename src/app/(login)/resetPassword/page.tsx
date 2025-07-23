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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/firebase/authentication";
import { getFirebaseErrorMessage } from "@/firebase/firebaseErrors";
import { FirebaseError } from "firebase/app";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function ResetPassword() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");

  async function handleResetPassword() {
    setIsLoading(true);
    try {
      await resetPassword(email);
      router.push("/resetPassword/emailSent");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setErro(getFirebaseErrorMessage(err.code));
      } else {
        setErro("Erro inesperado. Tente novamente.");
      }
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Esqueceu sua senha?</CardTitle>
        <CardDescription>
          Digite seu e-mail para rececer o link de redefinição de senha.
        </CardDescription>
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
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          onClick={handleResetPassword}
        >
          <Loader2Icon
            className={twMerge(isLoading ? "block animate-spin" : "hidden")}
          />
          Enviar código
        </Button>
      </CardFooter>
      {erro && <p>{erro}</p>}
    </Card>
  );
}
