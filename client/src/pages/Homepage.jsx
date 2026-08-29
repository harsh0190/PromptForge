import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import PromptInput from "../components/PromptInput";
import { useNavigate } from "react-router-dom";
import { Trash2Icon } from "lucide-react";

const Homepage = () => {
  const navigate = useNavigate();
  const {
    user,
    projects,
    loadingProjects,
    generatingProject,
    loadProjects,
    handleGenerate,
    handleDelete,
    logout,
  } = useAppContext();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

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
          <button
            onClick={logout}
            className="py-1.5 px-3 border border-white/20 text-white hover:bg-white/10 test-xs rounded-md cursor-pointer bg-transparent"
          >
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
              onSubmit={handleGenerate}
              loading={generatingProject}
              placeholder="Create a portfolio website..."
              variant="glass"
              autoFocus
            />
          </div>

          {/* All Projects */}
          {!loadingProjects && projects.length > 0 && (
            <div className="mt-12 w-full">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/30">
                <p className="text-xs font-medium uppercase text-zinc-100 tracking-widest">
                  All Projects
                </p>
                <span className="text-xs font-normal text-zinc-100">
                  {projects.length}{" "}
                  {projects.length === 1 ? "Project" : "Projects"}
                </span>
              </div>

              <div className="space-y-2 max-h[80vh] overflow-y-auto pr-1">
                {projects.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 flex items-center justify-between group hover:border-white/30 hover:bg-white/10 cursor-pointer backdrop-blur-md transition-all"
                    onClick={() => navigate(`/builder/${p._id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {p.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(p._id);
                        }}
                        className="border border-white/10 text-zinc-200 hover:text-red-400 hover:border-white/40 p-1.5 rounded-md cursor-pointer transition-opacity"
                      >
                        <Trash2Icon size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
