import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { GoPlus } from "react-icons/go";
import { HiOutlineCog6Tooth } from "react-icons/hi2";

type ActionsProps = {
  openDialogAddNote?: () => void;
  openDialogSettings?: () => void;
};

export function Header({
  openDialogAddNote,
  openDialogSettings,
}: ActionsProps) {
  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-2.5">
        <Avatar className="size-11">
          <AvatarImage src="https://github.com/0kira-vgl.png" />
          <AvatarFallback>MT</AvatarFallback>
        </Avatar>
        <h1 className="text-lg font-medium">Olá, Matheus!</h1>
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
