import React from "react";
import { useAppContext } from "../context/AppContext";
import PromptInput from "../components/PromptInput";

const Homepage = () => {
  const { user } = useAppContext();
  return (
    <div className="h-screen overflow-y-scroll text-white font-sans bg-[url('/bg-img.png')] bg-cover bg-center bg-no-repeat ">
      {/* Nav */}
      <nav className="stick top-0 z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="size-6" />
          <span className="text-xl font-semibold tracking-tight">
            PromptForge
          </span>
        </div>
        <div className=" flex items-center gap-4 text-sm font-medium text-zinc-300">
          <span>{user?.name}</span>
          <button className="py-1.5 px-3 border border-white/20 text-white hover:bg-white/10 test-xs rounded-md cursor-pointer bg-transparent">
            Sign Out
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20 mt-8 xl:mt-28">
        <div className="w-full max-w-2xl flex flex-col items-center">
          {/* Title */}
          <h1 className="text-center text-4xl md:text-6xl font-medium mt-4 max-w-2xl text-white">
            Let's build your app together!
          </h1>
          <p className="text-center text-sm md:text-base mt-4 max-w-xl text-white/65 leading-relaxed">
            Describe your idea and watch AI design, structure & launch your
            website instantly!
          </p>
          {/* Prompt input */}
          <div className="w-full mt-6">
            <PromptInput
              onSubmit={() => {}}
              loading={false}
              placeholder="Create a portfolio website..."
              variant="glass"
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
