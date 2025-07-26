import { toast } from "sonner";
import { db } from "./firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

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

export async function saveNote(uid: string, name: string, description: string) {
  const note = {
    name,
    description,
    createdAt: serverTimestamp(),
  };

  try {
    await addDoc(collection(db, "users", uid, "notes"), note);
  } catch (error) {
    toast.error("Erro ao salvar nota.");
    throw error;
  }
}
