import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { GoPlus } from "react-icons/go";
import { HiPencil } from "react-icons/hi";

export function Header() {
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
        <Button variant="outline" className="cursor-pointer">
          <GoPlus className="size-6" />
          Add Link
        </Button>

        <Button variant="outline" className="cursor-pointer">
          <HiPencil className="size-6" />
          Edit Link
        </Button>
      </div>
    </div>
  );
}
