"use client";

import { createContext, useEffect, useState, useContext } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

type AuthContextType = {
  user: User | null; // usuario logado ou null
  loading: boolean;
  logout: () => void; // funcao para sair da conta
};

// cria o contexto de autenticacao com valores padrao
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
});

// componente que vai envolver toda a aplicacao e fornecer os dados de autenticacao
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // estado para guardar o usuario logado
  const [user, setUser] = useState<User | null>(null);
  // estado para saber se esta carregando
  const [loading, setLoading] = useState(true);

  // useeffect roda quando o componente e montado
  useEffect(() => {
    // fica ouvindo se o usuario logou ou saiu
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // atualiza o usuario
      setLoading(false); // fala que terminou de carregar
    });

    // limpa o listener quando o componente for destruido
    return () => unsubscribe();
  }, []);

  // funcao para deslogar o usuario
  const logout = async () => {
    await signOut(auth);
  };

  // fornece os dados e funcoes para os componentes filhos
  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// hook para facilitar o uso do contexto de autenticacao
export const useAuth = () => useContext(AuthContext);
