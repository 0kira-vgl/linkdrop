import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { GoPlus } from "react-icons/go";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type ActionsProps = {
  openDialogAddNote?: () => void;
  openDialogSettings?: () => void;
};

export function Header({
  openDialogAddNote,
  openDialogSettings,
}: ActionsProps) {
  const [name, setName] = useState<string>("");

  async function fetchUserName() {
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
  }

  useEffect(() => {
    fetchUserName();
  }, []);

  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-2.5">
        <Avatar className="size-10 md:size-11">
          <AvatarImage src="https://github.com/0kira-vgl.png" />
        </Avatar>

        {name ? (
          <h1 className="text-lg font-medium">
            Olá, <span>{name}</span>!
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
      </div>
    </div>
  );
}
