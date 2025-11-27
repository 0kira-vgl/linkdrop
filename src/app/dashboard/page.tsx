"use client";

import { Header } from "@/components/header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  deleteNote,
  editNote,
  getNotes,
  Note,
  saveNote,
} from "@/firebase/firestore";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Toaster } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { GoPlus } from "react-icons/go";
import Image from "next/image";
import NoteImg from "@/assets/note.svg";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { HiPencilAlt } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { FaRegFolderOpen } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export default function Dashboard() {
  const { user, loading } = useProtectedRoute();

  const [noteName, setNoteName] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [loadingCreategNote, setLoadingCreategNote] = useState(false);
  const [loadingEditNote, setLoadingEditNote] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null); // estado pra saber qual nota está sendo editada
  const [loadingDeleteNote, setLoadingDeleteNote] = useState(false);

  const [openDialogSettings, setOpenDialogSettings] = useState(false);
  const [openDialogAddNote, setOpenDialogAddNote] = useState(false);
  const [openDialogEditNote, setOpenDialogEditNote] = useState(false);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  async function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    setLoadingCreategNote(true);

    if (!user) return null;

    try {
      await saveNote(user.uid, noteName, noteDescription);
      toast.success("Nota criada com sucesso!");
      setNoteName("");
      setNoteDescription("");
      setOpenDialogAddNote(false); // fecha o dialog

      // atualiza as notas após criar uma nova
      const updatedNotes = await getNotes(user.uid);
      setNotes(updatedNotes);
    } catch {
      toast.error("Erro ao salvar nota.");
    } finally {
      setLoadingCreategNote(false);
    }
  }

  async function handleEditNote(e: React.FormEvent) {
    e.preventDefault();
    setLoadingEditNote(true);

    if (!user || !noteToEdit) return;

    try {
      await editNote(user.uid, noteToEdit.id, noteName, noteDescription);
      toast.success("Nota editada com sucesso!");
      setNoteName("");
      setNoteDescription("");
      setNoteToEdit(null);
      setOpenDialogEditNote(false);

      const updatedNotes = await getNotes(user.uid);
      setNotes(updatedNotes);
    } catch {
      toast.error("Erro ao editar nota.");
    } finally {
      setLoadingEditNote(false);
    }
  }

  async function handleDeleteNote(noteId: string) {
    setLoadingDeleteNote(true);

    if (!user) return;

    try {
      await deleteNote(user.uid, noteId);
      toast.success("Nota excluída com sucesso!");

      // atualiza a lista depois de excluir
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch {
      toast.error("Erro ao excluir nota.");
    } finally {
      setLoadingDeleteNote(false);
    }
  }

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

  async function fetchUserCredentials() {
    // pega a autenticação do firebase
    const auth = getAuth();
    // pega o usuário que está logado
    const user = auth.currentUser;

    // se não tiver usuário logado, para aqui
    if (!user) return;

    // cria uma referência ao documento do usuário no banco
    const docRef = doc(db, "users", user.uid);
    // busca os dados desse documento
    const docSnap = await getDoc(docRef);

    // se encontrou o documento, pega o nome e salva no estado
    if (docSnap.exists()) {
      const data = docSnap.data();
      setName(data.name);
    }

    // seta o email do usuário no estado
    setEmail(user.email ?? "");
  }

  useEffect(() => {
    fetchNotes();
    fetchUserCredentials();
  }, [user]);

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <AiOutlineLoading3Quarters className="animate-spin opacity-50" />
      </div>
    );
  if (!user) return null;

  return (
    <div>
      <Header
        openDialogSettings={() => setOpenDialogSettings(true)}
        openDialogAddNote={() => setOpenDialogAddNote(true)}
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
                <ContextMenu key={note.id}>
                  <ContextMenuTrigger asChild>
                    <Card
                      className="flex cursor-pointer flex-col justify-between rounded-md outline-none select-none md:select-auto"
                      onClick={() => console.log("note clicked")}
                    >
                      <CardHeader>
                        <CardTitle
                          className="mb-1.5 line-clamp-2"
                          title={note.name}
                        >
                          {note.name}
                        </CardTitle>
                        <CardDescription
                          className="line-clamp-6 break-words whitespace-normal"
                          title={note.description}
                        >
                          {note.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <CardDescription>
                          {note.createdAt?.toDate
                            ? new Date(
                                note.createdAt.toDate(),
                              ).toLocaleDateString()
                            : "Data desconhecida"}
                        </CardDescription>
                      </CardFooter>
                      <AlertDialog>
                        <ContextMenuContent className="w-48">
                          <ContextMenuItem>
                            Abrir
                            <ContextMenuShortcut>
                              <FaRegFolderOpen />
                            </ContextMenuShortcut>
                          </ContextMenuItem>
                          <ContextMenuItem
                            onClick={() => {
                              setNoteToEdit(note);
                              setNoteName(note.name);
                              setNoteDescription(note.description);
                              setOpenDialogEditNote(true);
                            }}
                          >
                            Editar
                            <ContextMenuShortcut>
                              <HiPencilAlt />
                            </ContextMenuShortcut>
                          </ContextMenuItem>
                          <AlertDialogTrigger asChild>
                            <ContextMenuItem variant="destructive">
                              Excluir
                              <ContextMenuShortcut>
                                <MdDelete className="text-destructive" />
                              </ContextMenuShortcut>
                            </ContextMenuItem>
                          </AlertDialogTrigger>
                        </ContextMenuContent>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Tem certeza que deseja excluir?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              A nota{" "}
                              <span className="font-bold">{note.name}</span>{" "}
                              será excluída permanentemente e não poderá ser
                              recuperada. Pense bem antes de dizer adeus...
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={loadingDeleteNote}>
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className={buttonVariants({
                                variant: "destructive",
                              })}
                              onClick={() => handleDeleteNote(note.id)}
                              disabled={loadingDeleteNote}
                            >
                              <Loader2Icon
                                className={twMerge(
                                  loadingDeleteNote
                                    ? "block animate-spin"
                                    : "hidden",
                                )}
                              />
                              {loadingDeleteNote ? "Excluindo..." : "Excluir"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </Card>
                  </ContextMenuTrigger>
                </ContextMenu>
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
                      onClick={() => setOpenDialogAddNote(true)}
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
      <Dialog open={openDialogAddNote} onOpenChange={setOpenDialogAddNote}>
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
                  placeholder="Título da sua próxima grande ideia"
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
                  placeholder="Pensamentos soltos começam aqui..."
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
      <Dialog open={openDialogEditNote} onOpenChange={setOpenDialogEditNote}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditNote} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Editar Nota</DialogTitle>
              <DialogDescription>
                Mudou de ideia? Sem problema, edite à vontade!
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="nameNote">Nome do Nota</Label>
                <Input
                  id="nameNote"
                  placeholder="Nada aqui... que tal mudar isso?"
                  required
                  disabled={loadingEditNote}
                  value={noteName}
                  onChange={(e) => setNoteName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Ei, você apagou tudo? Escreve algo novo!"
                  className="h-28"
                  required
                  disabled={loadingEditNote}
                  value={noteDescription}
                  onChange={(e) => setNoteDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={loadingEditNote}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loadingEditNote}>
                <Loader2Icon
                  className={twMerge(
                    loadingEditNote ? "block animate-spin" : "hidden",
                  )}
                />
                {loadingEditNote ? "Editando..." : "Editar"}
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
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={email}
                  required
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder={name} required />
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
