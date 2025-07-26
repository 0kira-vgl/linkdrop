import { toast } from "sonner";
import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export async function saveUserToFirestore(
  uid: string,
  name: string,
  email: string,
) {
  try {
    await setDoc(doc(db, "users", uid), {
      name,
      email,
      uid,
    });
  } catch (error) {
    toast.error(
      "Não foi possível salvar seus dados. Tente novamente mais tarde.",
    );
    throw error;
  }
}
