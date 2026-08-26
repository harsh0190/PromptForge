import React from "react";


const LoginLeft = () => {
  return (
    <div className="flex lg:w-2/5 bg-[url('/bg-img.png')] bg-cover bg-center bg-no-repeat flex-col justify-between p-12 shrink-0 select-none">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="Logo" className="size-9.5" />
        <span className="text-4xl font-medium text-white">PromptForge</span>
      </div>
      <div>
        <h2 className="text-3xl text-white font-medium leading-snug mb-3 tracking-tight">
          Build your presence on web
        </h2>
        <p className="text-zinc-300">
          Describe what you need, preview instantly, and customize your site in
          real-time.
        </p>
        <p className="text-zinc-300 text-sm mt-12">
          Copyright {new Date().getFullYear()} PromptForge. All rights reserved.
        </p>
    
      </div>
    </div>
  );
};

export default LoginLeft;
