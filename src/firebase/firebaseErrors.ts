export function getFirebaseErrorMessage(code: string) {
  const messages: Record<string, string> = {
    "auth/email-already-in-use": "Este e-mail já está em uso.",
    "auth/invalid-email": "E-mail inválido.",
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/weak-password": "Senha muito fraca. Use pelo menos 6 caracteres.",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
    "auth/popup-closed-by-user": "Login cancelado pelo usuário.",
    "auth/popup-blocked": "O pop-up foi bloqueado pelo navegador.",
    "auth/invalid-credential": "Email ou senha inválidos.",
  };

  return messages[code] || "Erro inesperado. Tente novamente.";
}
