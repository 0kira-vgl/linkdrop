"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
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
  CardTitle,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getNotes, Note, saveNote } from "@/firebase/firestore";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Toaster } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { GoPlus } from "react-icons/go";
import Image from "next/image";
import NoteImg from "@/assets/note.svg";

export default function Dashboard() {
  const { user, loading } = useProtectedRoute();

  const [noteName, setNoteName] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [loadingCreategNote, setLoadingCreategNote] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);

  const [openDialogSettings, setOpenDialogSettings] = useState(false);
  const [openDialogAddNote, setOpenDialogAddNotes] = useState(false);

  async function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    setLoadingCreategNote(true);

    if (!user) return null;

    try {
      await saveNote(user.uid, noteName, noteDescription);
      toast.success("Nota criada com sucesso!");
      setNoteName("");
      setNoteDescription("");
      setOpenDialogAddNotes(false); // fecha o dialog

      // atualiza as notas após criar uma nova
      const updatedNotes = await getNotes(user.uid);
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      toast.error("Erro ao salvar nota.");
    } finally {
      setLoadingCreategNote(false);
    }
  }

  useEffect(() => {
    async function fetchNotes() {
      if (!user) return;

      try {
        // chama a função que busca as notas do Firestore, passando o UID do usuário
        const userNotes = await getNotes(user.uid);

        // atualiza o estado com as notas encontradas
        setNotes(userNotes);
      } catch (error) {
        console.error("Erro ao carregar notas:", error);
      } finally {
        setLoadingNotes(false);
      }
    }

    fetchNotes();
  }, [user]);

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
          {loadingNotes ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            <>
              {notes.map((note) => (
                <Card
                  key={note.id}
                  className="flex flex-col justify-between rounded-md outline-none"
                >
                  <CardHeader>
                    <CardTitle>{note.name}</CardTitle>
                    <CardDescription>{note.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-4">
                    <CardDescription>
                      {note.createdAt?.toDate
                        ? new Date(note.createdAt.toDate()).toLocaleDateString()
                        : "Data desconhecida"}
                    </CardDescription>
                  </CardFooter>
                </Card>
              ))}
              {notes.length === 0 && (
                <div className="col-span-full flex min-h-[60vh] w-full flex-col items-center justify-center">
                  <Image
                    alt="notes images"
                    width={120}
                    height={120}
                    src={NoteImg}
                    quality={100}
                    className="size-36 md:size-48"
                  />
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <h1 className="text-muted-foreground mx-auto mb-2.5 max-w-xs text-center text-sm leading-tight">
                      Você ainda não tem notas criadas. Clique no botão
                      &quot;Criar Nota&quot; para começar!
                    </h1>
                    <Button
                      variant="outline"
                      onClick={() => setOpenDialogAddNotes(true)}
                    >
                      <GoPlus className="size-6" />
                      Criar Nota
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Dialog open={openDialogAddNote} onOpenChange={setOpenDialogAddNotes}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreateNote} className="space-y-4">
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
                  disabled={loadingCreategNote}
                  value={noteName}
                  onChange={(e) => setNoteName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Nesse treino, vamos focar em..."
                  className="h-28"
                  required
                  disabled={loadingCreategNote}
                  value={noteDescription}
                  onChange={(e) => setNoteDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={loadingCreategNote}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loadingCreategNote}>
                <Loader2Icon
                  className={twMerge(
                    loadingCreategNote ? "block animate-spin" : "hidden",
                  )}
                />
                {loadingCreategNote ? "Criando..." : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
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

      <Toaster richColors />
    </div>
  );
}
