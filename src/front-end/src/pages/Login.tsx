import React from 'react';
import { FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const TailwindCustomStyles = () => (
  <style>
    {`
      @layer utilities {
        .animate-move-gradient {
          animation: moveGradient 20s ease infinite;
          background-size: 200% 200%;
        }
        @keyframes moveGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .bg-glass {
          background: rgba(30, 41, 59, 0.75);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(99, 102, 241, 0.18);
          box-shadow: 0 8px 32px 0 rgba(0,0,0,0.18);
        }
        .input-glass {
          background: rgba(255,255,255,0.08);
          border-bottom: 1px solid rgba(99,102,241,0.16);
        }
        .input-glass:focus {
          background: rgba(255,255,255,0.16);
          border-bottom-color: rgba(99,102,241,0.24);
        }
        .custom-checkbox {
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.18);
        }
        .custom-checkbox-checked {
          background-color: #6366f1;
          border-color: #6366f1;
        }
        .login-gradient {
          background-image: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
        }
        .btn-glow {
          box-shadow: 0 0 16px 0 rgba(99,102,241,0.5), 0 2px 10px 0 rgba(59,130,246,0.25);
        }
        .btn-social {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-social:hover {
          transform: translateY(-4px) scale(1.08);
          box-shadow: 0 4px 18px rgba(59,130,246,0.18), 0 1px 4px rgba(0,0,0,0.10);
        }
      }
    `}
  </style>
);

export default function Login() {
  const [remember, setRemember] = React.useState(false);

  return (
    <>
      <TailwindCustomStyles />
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center font-sans
          bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 animate-move-gradient"
      >
        {/* Logo acima do card */}
        <h1
          className="mb-2 text-[44px] sm:text-[54px] font-light font-georgia tracking-[6px] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 drop-shadow-lg animate-fade-in-up"
          style={{ fontFamily: 'Georgia, serif', letterSpacing: '6px' }}
        >
          POSTFOLIO
        </h1>
        {/* Card de login */}
        <div className="w-full max-w-[370px] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.28)] bg-glass px-8 py-10 animate-fade-in-up">
          <h2 className="text-center text-[24px] mb-8 tracking-[2px] font-semibold text-blue-100 drop-shadow-[0_1px_5px_rgba(0,0,0,0.25)]">
            Bem-vindo!
          </h2>
          <form>
            {/* Usuário */}
            <div className="mb-6">
              <label htmlFor="username" className="text-[14px] mb-1 block text-blue-100">
                Usuário
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  placeholder="Insira seu nome de usuário"
                  className="w-full py-3 pl-11 pr-4 rounded-lg border border-transparent input-glass text-white text-[15px] outline-none transition-all duration-300 placeholder:text-white/70"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 pointer-events-none">
                  <i className="fa-solid fa-user"></i>
                </span>
              </div>
            </div>

            {/* Senha */}
            <div className="mb-6">
              <label htmlFor="password" className="text-[14px] mb-1 block text-blue-100">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="Insira sua senha"
                  className="w-full py-3 pl-11 pr-4 rounded-lg border border-transparent input-glass text-white text-[15px] outline-none transition-all duration-300 placeholder:text-white/70"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 pointer-events-none">
                  <i className="fa-solid fa-lock"></i>
                </span>
              </div>
            </div>

            {/* Esqueci minha senha */}
            <div className="text-right mb-6">
              <a
                href="#"
                className="text-indigo-300 text-[13px] transition-colors duration-300 hover:text-white"
              >
                Esqueci minha senha
              </a>
            </div>

            {/* Lembrar de mim */}
            <div className="mb-6">
              <label className="flex items-center text-[14px] cursor-pointer text-blue-100">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember((v) => !v)}
                  className="hidden"
                />
                <span
                  className={`custom-checkbox w-[18px] h-[18px] rounded-[4px] mr-2 inline-flex items-center justify-center transition-all duration-300 ${
                    remember ? 'custom-checkbox-checked' : ''
                  }`}
                >
                  <i
                    className={`fa-solid fa-check text-white text-[12px] transition-transform duration-200 ${
                      remember ? 'scale-100' : 'scale-0'
                    }`}
                  ></i>
                </span>
                Lembrar de mim
              </label>
            </div>

            <button
              type="submit"
              className="login-gradient bg-blue-400 btn-glow w-full py-3 rounded-lg text-white text-[18px] font-extrabold cursor-pointer transition-all duration-300 shadow-[0_4px_20px_rgba(99,102,241,0.24)] hover:-translate-y-1 hover:shadow-[0_7px_28px_rgba(99,102,241,0.30)] hover:brightness-110 active:-translate-y-0.5 border-0 mb-5"
              style={{
                letterSpacing: '1.5px',
                textShadow: '0 2px 10px rgba(59,130,246,0.18)',
              }}
            >
              Entrar
            </button>

            {/* Botões sociais */}
            <div className="flex flex-col gap-2 items-center mt-2">
              <span className="text-indigo-200 text-xs mb-2">ou entre com</span>
              <div className="flex gap-5">
                <button
                  type="button"
                  className="btn-social flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md border-2 border-white hover:bg-blue-100 transition"
                  title="Entrar com Google"
                >
                  <FcGoogle className="text-2xl" />
                </button>
                <button
                  type="button"
                  className="btn-social flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-gray-900 via-gray-800 to-blue-900 shadow-md border-2 border-blue-700 hover:brightness-125 transition"
                  title="Entrar com Github"
                >
                  <FiGithub className="text-2xl text-white" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
