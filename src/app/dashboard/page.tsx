"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

export default function Dashboard() {
  const { user, loading } = useProtectedRoute();

  const [openDialogSettings, setOpenDialogSettings] = useState(false);
  const [openDialogAddNote, setOpenDialogAddNotes] = useState(false);

  if (loading) return <p>Carregando...</p>;
  if (!user) return null;

  return (
    <div>
      <Header
        openDialogSettings={() => setOpenDialogSettings(true)}
        openDialogAddNote={() => setOpenDialogAddNotes(true)}
      />
      <div className="mx-auto my-12 max-w-6xl px-5">
        <div className="grid auto-rows-[250px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col rounded-md outline-none">
            <CardHeader>
              <CardTitle>Treino upper/lower</CardTitle>
              <CardDescription>Nesse treino, vamos focar em...</CardDescription>
            </CardHeader>
            <CardFooter>
              <CardDescription>16/07/2025</CardDescription>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Dialog open={openDialogAddNote} onOpenChange={setOpenDialogAddNotes}>
        <form>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Nota</DialogTitle>
              <DialogDescription>
                Crie uma nota e comece já a escrever!
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="nameNote">Nome do Nota</Label>
                <Input
                  id="nameNote"
                  placeholder="Treino upper/lower"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Nesse treino, vamos focar em..."
                  className="h-28"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
      <Dialog open={openDialogSettings} onOpenChange={setOpenDialogSettings}>
        <form>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar perfil</DialogTitle>
              <DialogDescription>
                Edite os dados do seu perfil
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-6">
              <div className="grid items-center justify-center gap-2">
                <Label htmlFor="avatar" className="justify-center">
                  Avatar
                </Label>

                <Avatar id="avatar" className="size-28">
                  <AvatarImage src="https://github.com/0kira-vgl.png" />
                  <AvatarFallback>MT</AvatarFallback>
                </Avatar>

                <Button variant="link">Alterar Avatar</Button>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Matheus Tiburcio" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input id="newPassword" type="password" required />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
