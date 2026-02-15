import React, { useState } from 'react';
import { Lock, User, X } from 'lucide-react';

interface DrAgathaLoginProps {
  onSuccess: () => void;
  onClose: () => void;
}

const DrAgathaLogin: React.FC<DrAgathaLoginProps> = ({ onSuccess, onClose }) => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    setTimeout(() => {
      if (usuario === 'momo' && senha === '29072025') {
        onSuccess();
      } else {
        setErro('Usuário ou senha incorretos.');
      }
      setCarregando(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 safe-area-x overflow-y-auto">
      <div className="bg-brand-50 w-full max-w-md rounded-2xl shadow-xl border border-brand-200 overflow-hidden">
        <div className="bg-brand-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-serif font-medium text-gold-500">Dra. Ágatha - Área Restrita</h2>
          <button
            onClick={onClose}
            className="text-gold-400 hover:text-gold-300 p-1 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label htmlFor="dr-usuario" className="block text-sm font-medium text-brand-700 flex items-center gap-2">
              <User className="w-4 h-4 text-gold-600" />
              Usuário
            </label>
            <input
              id="dr-usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Digite seu usuário"
              required
              className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="dr-senha" className="block text-sm font-medium text-brand-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gold-600" />
              Senha
            </label>
            <input
              id="dr-senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
              className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
              autoComplete="current-password"
            />
          </div>

          {erro && (
            <p className="text-red-600 text-sm">{erro}</p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DrAgathaLogin;
