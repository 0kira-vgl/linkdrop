"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { GoPlus } from "react-icons/go";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { IoExitOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type ActionsProps = {
  openDialogAddNote?: () => void;
  openDialogSettings?: () => void;
};

export function Header({
  openDialogAddNote,
  openDialogSettings,
}: ActionsProps) {
  // hooks devem ficar no topo do componente
  const { user, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState<string>("");

  // Busca o nome do Firestore usando o UID do user do contexto
  async function fetchUserName(uid: string) {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name ?? "");
      } else {
        setName("");
      }
    } catch (err) {
      console.error("Erro ao buscar nome do usuário:", err);
      setName("");
    }
  }

  // Gera iniciais a partir do nome (2 letras)
  function getInitials(name: string) {
    if (!name) return "";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  // handleLogout usa logout e router (hooks já no topo)
  async function handleLogout() {
    try {
      await logout();
      router.push("/"); // redireciona pra home/login
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  }

  // quando o user do contexto mudar, busca o nome no Firestore
  useEffect(() => {
    if (!user) {
      setName("");
      return;
    }
    fetchUserName(user.uid);
  }, [user]);

  return (
    <div className="flex items-center justify-between border-b p-4 select-none md:select-auto">
      <div className="flex items-center gap-2.5">
        <Avatar className="size-10 md:size-11">
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>

        {name ? (
          <h1 className="text-lg font-medium">
            Olá, <span className="font-bold">{name}</span>!
          </h1>
        ) : (
          <Skeleton className="h-8 w-[200px]" />
        )}
      </div>

      <div className="flex gap-2.5">
        <Button
          onClick={openDialogAddNote}
          variant="outline"
          className="size-9 cursor-pointer md:size-auto"
        >
          <GoPlus className="size-6" />
          <span className="hidden md:block">Add Note</span>
        </Button>

        <Button
          onClick={openDialogSettings}
          variant="outline"
          className="size-9 cursor-pointer md:size-auto"
        >
          <HiOutlineCog6Tooth className="size-6" />
          <span className="hidden md:block">Configurações</span>
        </Button>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="text-destructive hover:text-destructive/90 size-9 cursor-pointer md:size-auto"
        >
          <IoExitOutline className="size-6" />
          <span className="hidden md:block">Sair</span>
        </Button>
      </div>
    </div>
  );
}
