import { toast } from "sonner";
import { db } from "./firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export type Note = {
  id: string;
  name: string;
  description: string;
  createdAt?: {
    toDate: () => Date;
  };
};

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

// recebe o `uid` do usuário e retorna uma Promise com um array de notas
export async function getNotes(uid: string): Promise<Note[]> {
  try {
    // cria uma referência para a subcoleção "notes" dentro do documento do usuário no firestore
    const notesRef = collection(db, "users", uid, "notes");
    // faz a leitura (get) de todos os documentos dentro dessa subcoleção
    const snapshot = await getDocs(notesRef);

    // mapeia cada documento do snapshot para o formato `Note`
    const notes: Note[] = snapshot.docs.map((doc: DocumentData) => {
      // extrai os dados do documento (name, description, etc.)
      const data = doc.data();

      // retorna um objeto no formato `Note`
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        createdAt: data.createdAt,
      };
    });

    return notes;
  } catch (error) {
    toast.error("Erro ao buscar notas.");
    throw error;
  }
}

// recebe o uid do usuário, o id da nota, o novo nome e a nova descrição
export async function editNote(
  uid: string, // ID do usuário
  noteId: string, // ID da nota a ser editada
  name: string, // Novo nome da nota
  description: string, // Nova descrição da nota
) {
  // cria uma referência para o documento da nota específica dentro da coleção "notes" do usuário
  const noteRef = doc(db, "users", uid, "notes", noteId);
  // atualiza o documento da nota com os novos valores de nome e descrição
  await updateDoc(noteRef, { name, description });
}

export async function deleteNote(uid: string, noteId: string) {
  // cria uma referência para o documento da nota específica dentro da coleção "notes" do usuário
  const noteRef = doc(db, "users", uid, "notes", noteId);
  await deleteDoc(noteRef);
}
