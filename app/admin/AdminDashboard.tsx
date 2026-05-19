"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { createProjectAction, deleteProjectAction, logoutAction, type ProjectState } from "@/app/actions";
import type { Project } from "@/lib/types";
import { useRouter } from "next/navigation";

const initialState: ProjectState = {};

export default function AdminDashboard({ projects }: { projects: Project[] }) {
  const router   = useRouter();
  const formRef  = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(createProjectAction, initialState);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setPreview(null);
      router.refresh();
    }
  }, [state.success, router]);

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await deleteProjectAction(id);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#07070a] text-[#f0f0ff]">

      {/* ── Nav ── */}
      <nav className="border-b border-[#1e1e2a] bg-[#07070a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-sm">
            <span className="text-[#9090b0]">drilex<span className="text-[#7c3aed]">.cz</span></span>
            <span className="text-[#44445a]">/</span>
            <span className="text-[#7c3aed]">admin</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="font-mono text-xs text-[#44445a] hover:text-[#9090b0] transition-colors">
              ← site
            </a>
            <form action={logoutAction}>
              <button type="submit" className="btn-primary py-1.5 px-4 text-[0.65rem]">
                <span>Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12 flex flex-col gap-14">

        {/* ── Header ── */}
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.18em] uppercase text-[#7c3aed] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
            admin panel
          </div>
          <h1 className="font-extrabold text-4xl tracking-tight">
            Project Manager
          </h1>
          <p className="text-[#9090b0] text-sm mt-2 font-mono">
            {projects.length} project{projects.length !== 1 ? "s" : ""} in database
          </p>
        </div>

        {/* ── Add project ── */}
        <div>
          <h2 className="font-bold text-lg mb-6 flex items-center gap-3">
            <span className="text-[#7c3aed]">+</span> Add new project
          </h2>

          <form ref={formRef} action={formAction} encType="multipart/form-data"
            className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">

            <div className="md:col-span-2">
              <label className="block font-mono text-[0.65rem] tracking-widest uppercase text-[#9090b0] mb-2">
                Project title
              </label>
              <input name="title" type="text" placeholder="My Awesome Project" required
                className="w-full bg-[#111118] border border-[#1e1e2a] text-[#f0f0ff] font-mono text-sm px-4 py-3 outline-none focus:border-[#7c3aed] transition-colors placeholder:text-[#44445a]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-mono text-[0.65rem] tracking-widest uppercase text-[#9090b0] mb-2">
                Redirect URL
              </label>
              <input name="redirect_url" type="url" placeholder="https://example.com" required
                className="w-full bg-[#111118] border border-[#1e1e2a] text-[#f0f0ff] font-mono text-sm px-4 py-3 outline-none focus:border-[#7c3aed] transition-colors placeholder:text-[#44445a]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-mono text-[0.65rem] tracking-widest uppercase text-[#9090b0] mb-2">
                Project image (optional — max 8 MB)
              </label>
              <input
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setPreview(file ? URL.createObjectURL(file) : null);
                }}
                className="w-full bg-[#111118] border border-[#1e1e2a] text-[#9090b0] font-mono text-xs px-4 py-3 outline-none focus:border-[#7c3aed] transition-colors file:mr-4 file:py-1 file:px-3 file:border file:border-[#2d2d40] file:bg-[#0f0f14] file:text-[#9090b0] file:font-mono file:text-xs file:cursor-pointer"
              />
              {preview && (
                <div className="mt-3 border border-[#1e1e2a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="w-48 aspect-video object-cover block" />
                </div>
              )}
            </div>

            {state.error && (
              <div className="md:col-span-2 border-l-2 border-red-500 pl-3 font-mono text-xs text-red-400">
                {state.error}
              </div>
            )}
            {state.success && (
              <div className="md:col-span-2 border-l-2 border-emerald-500 pl-3 font-mono text-xs text-emerald-400">
                ✓ Project added successfully.
              </div>
            )}

            <div className="md:col-span-2">
              <button type="submit" disabled={isPending} className="btn-solid">
                <span>{isPending ? "Saving…" : "Add project"}</span>
                {!isPending && <span>→</span>}
              </button>
            </div>
          </form>
        </div>

        {/* ── Project list ── */}
        <div>
          <h2 className="font-bold text-lg mb-6 flex items-center gap-3">
            <span className="text-[#7c3aed]">≡</span> Existing projects
          </h2>

          {projects.length === 0 ? (
            <p className="font-mono text-xs text-[#44445a] py-8 border border-dashed border-[#1e1e2a] text-center">
              // no projects yet
            </p>
          ) : (
            <div className="flex flex-col gap-px bg-[#1e1e2a] border border-[#1e1e2a]">
              {projects.map((p) => (
                <div key={p.id}
                  className="grid items-center gap-4 p-4 bg-[#07070a] hover:bg-[#111118] transition-colors"
                  style={{ gridTemplateColumns: "56px 1fr auto auto" }}
                >
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt={p.title}
                      className="w-14 h-9 object-cover border border-[#1e1e2a] block flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-9 bg-[#0f0f14] border border-[#1e1e2a] flex-shrink-0" />
                  )}

                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[#f0f0ff] truncate">{p.title}</div>
                    <div className="font-mono text-[0.65rem] text-[#44445a] truncate mt-0.5">
                      {p.redirect_url}
                    </div>
                  </div>

                  <span className="font-mono text-[0.6rem] text-[#44445a] flex-shrink-0 hidden sm:block">
                    {new Date(p.created_at).toLocaleDateString("en-GB")}
                  </span>

                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="font-mono text-[0.65rem] text-red-400 border border-red-900/40 px-3 py-1.5 hover:bg-red-900/20 transition-colors flex-shrink-0"
                  >
                    delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
