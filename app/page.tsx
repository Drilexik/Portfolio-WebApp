export const dynamic = "force-dynamic";

import { query } from "@/lib/db";
import type { Project } from "@/lib/types";

async function getProjects(): Promise<Project[]> {
  try {
    const { rows } = await query<Project>(
      "SELECT id, title, image_url, redirect_url, created_at FROM projects ORDER BY created_at DESC"
    );
    return rows;
  } catch (err) {
    console.error("[page] fetch projects failed:", err);
    return [];
  }
}

const SKILLS = [
  { name: "Next.js",    icon: "⬡" },
  { name: "React",      icon: "◎" },
  { name: "Node.js",    icon: "⬡" },
  { name: "TypeScript", icon: "◈" },
  { name: "JavaScript", icon: "◈" },
  { name: "Python",     icon: "◎" },
  { name: "Lua",        icon: "◇" },
  { name: "HTML",       icon: "◇" },
  { name: "CSS",        icon: "◇" },
  { name: "C",          icon: "◆" },
];

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-[#07070a] text-[#f0f0ff]">

      {/* ── Grid background ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── Purple radial glow top ── */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center top, rgba(124,58,237,0.12) 0%, transparent 70%)",
        }}
      />

      {/* ══════════════════════════════════════
          NAV
      ══════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 border-b border-[#1e1e2a] bg-[#07070a]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://upload.drilex.cz/logo.png"
              alt="Drilex logo"
              className="h-7 w-auto"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <span className="font-mono text-sm font-medium text-[#f0f0ff] tracking-wider">
              drilex<span className="text-[#7c3aed]">.cz</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#projects" className="font-mono text-xs text-[#9090b0] hover:text-[#9d5cff] transition-colors tracking-wider hidden sm:block">
              projects
            </a>
            <a href="#skills" className="font-mono text-xs text-[#9090b0] hover:text-[#9d5cff] transition-colors tracking-wider hidden sm:block">
              skills
            </a>
            <a href="mailto:contact@drilex.cz" className="btn-solid text-[0.7rem] py-2 px-4">
              <span>contact</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative pt-28 pb-32 px-8">
        <div className="max-w-6xl mx-auto relative z-10">

          {/* Status badge */}
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#9090b0] border border-[#1e1e2a] bg-[#111118] px-4 py-2 mb-10 animate-[fadeUp_0.6s_ease_both]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            available for new projects
          </div>

          {/* Main heading */}
          <h1 className="font-sans font-extrabold leading-[0.95] tracking-[-0.05em] mb-8 animate-[fadeUp_0.7s_0.1s_ease_both] opacity-0 [animation-fill-mode:forwards]">
            <span className="block text-[clamp(4rem,12vw,9rem)] text-[#f0f0ff]">Drilex</span>
            <span className="block text-[clamp(1.5rem,4vw,3.5rem)] text-[#44445a] font-light tracking-tight">
              Full Stack Developer
              <span className="text-[#7c3aed] animate-[blink_1.1s_step-end_infinite]">_</span>
            </span>
          </h1>

          <p className="text-[#9090b0] text-lg max-w-xl leading-relaxed mb-12 animate-[fadeUp_0.7s_0.2s_ease_both] opacity-0 [animation-fill-mode:forwards]">
            Building products for the web — from database schema to production deployment.
            Clean code, sharp design, zero compromise.
          </p>

          <div className="flex flex-wrap gap-4 animate-[fadeUp_0.7s_0.3s_ease_both] opacity-0 [animation-fill-mode:forwards]">
            <a href="#projects" className="btn-solid">
              <span>View Projects</span>
              <span className="ml-1">→</span>
            </a>
            <a href="mailto:contact@drilex.cz" className="btn-primary">
              <span>contact@drilex.cz</span>
            </a>
          </div>

          {/* Floating stat cards */}
          <div className="flex flex-wrap gap-4 mt-20 animate-[fadeUp_0.7s_0.4s_ease_both] opacity-0 [animation-fill-mode:forwards]">
            {[
              { label: "Stack", value: "Full" },
              { label: "Projects", value: `${projects.length}+` },
              { label: "Status", value: "Open" },
            ].map((stat) => (
              <div key={stat.label} className="border border-[#1e1e2a] bg-[#111118] px-6 py-4 min-w-[100px]">
                <div className="font-mono text-[0.65rem] text-[#44445a] tracking-widest uppercase mb-1">{stat.label}</div>
                <div className="font-sans font-bold text-2xl text-[#f0f0ff]">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SKILLS
      ══════════════════════════════════════ */}
      <section id="skills" className="py-24 px-8 border-t border-[#1e1e2a] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="section-tag">skills &amp; stack</div>
          <h2 className="font-extrabold text-[clamp(2rem,5vw,3.5rem)] tracking-tight mb-12">
            What I build with<span className="text-[#7c3aed]">.</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-[#1e1e2a] border border-[#1e1e2a]">
            {SKILLS.map((skill, i) => (
              <div
                key={skill.name}
                className="group bg-[#07070a] hover:bg-[#111118] p-6 flex flex-col gap-3 transition-all duration-300 cursor-default relative overflow-hidden"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.05) 0%, transparent 100%)" }}
                />
                <span className="text-[#7c3aed] text-xl relative z-10">{skill.icon}</span>
                <span className="font-mono text-sm text-[#f0f0ff] group-hover:text-white transition-colors relative z-10 font-medium">
                  {skill.name}
                </span>
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#7c3aed] group-hover:w-full transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROJECTS
      ══════════════════════════════════════ */}
      <section id="projects" className="py-24 px-8 border-t border-[#1e1e2a] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="section-tag">projects</div>
              <h2 className="font-extrabold text-[clamp(2rem,5vw,3.5rem)] tracking-tight">
                Selected work<span className="text-[#7c3aed]">.</span>
              </h2>
            </div>
            <span className="font-mono text-xs text-[#44445a]">{projects.length} published</span>
          </div>

          {projects.length === 0 ? (
            <div className="border border-dashed border-[#1e1e2a] p-16 text-center">
              <p className="font-mono text-sm text-[#44445a]">// no projects yet — check back soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1e1e2a]">
              {projects.map((project, i) => (
                <a
                  key={project.id}
                  href={project.redirect_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#07070a] hover:bg-[#111118] flex flex-col transition-all duration-300 relative overflow-hidden"
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#7c3aed] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                  {/* Image */}
                  <div className="aspect-video overflow-hidden bg-[#0f0f14] relative">
                    {project.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-mono text-xs text-[#44445a]">no preview</span>
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-[#7c3aed]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-[#f0f0ff] group-hover:text-white transition-colors leading-tight">
                        {project.title}
                      </h3>
                      <svg
                        className="w-4 h-4 text-[#44445a] group-hover:text-[#9d5cff] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0 mt-0.5"
                        fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                      >
                        <line x1="7" y1="17" x2="17" y2="7"/>
                        <polyline points="7 7 17 7 17 17"/>
                      </svg>
                    </div>
                    <p className="font-mono text-[0.68rem] text-[#44445a] truncate">
                      {project.redirect_url.replace(/^https?:\/\//, "")}
                    </p>
                    <div className="mt-auto pt-3 border-t border-[#1e1e2a] flex items-center justify-between">
                      <span className="font-mono text-[0.6rem] text-[#44445a]">
                        {new Date(project.created_at).toLocaleDateString("en-GB", { year: "numeric", month: "short" })}
                      </span>
                      <span className="font-mono text-[0.6rem] text-[#7c3aed] opacity-0 group-hover:opacity-100 transition-opacity">
                        visit →
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SOCIALS + CONTACT
      ══════════════════════════════════════ */}
      <section id="contact" className="py-24 px-8 border-t border-[#1e1e2a] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact CTA */}
            <div>
              <div className="section-tag">contact</div>
              <h2 className="font-extrabold text-[clamp(2rem,5vw,3.5rem)] tracking-tight mb-6">
                Let's build<br />
                something<span className="text-[#7c3aed]">.</span>
              </h2>
              <p className="text-[#9090b0] text-base leading-relaxed mb-8 max-w-sm">
                Have a project in mind or want to collaborate? I'm open to new opportunities.
              </p>
              <a href="mailto:contact@drilex.cz" className="btn-solid">
                <span>contact@drilex.cz</span>
                <span>→</span>
              </a>
            </div>

            {/* Socials */}
            <div>
              <div className="section-tag">find me online</div>
              <div className="flex flex-col gap-px">
                {[
                  {
                    label: "GitHub",
                    handle: "@drilexik",
                    href: "https://github.com/drilexik",
                    desc: "Open source & projects",
                  },
                  {
                    label: "LinkedIn",
                    handle: "Filip Šimkovič",
                    href: "https://www.linkedin.com/in/filip-%C5%A1imkovi%C4%8D-5663173b6/",
                    desc: "Professional network",
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-6 border border-[#1e1e2a] bg-[#07070a] hover:bg-[#111118] hover:border-[#2d2d40] transition-all duration-300 relative overflow-hidden"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#7c3aed] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"
                    />
                    <div className="pl-2">
                      <div className="font-bold text-sm text-[#f0f0ff] mb-1">{social.label}</div>
                      <div className="font-mono text-xs text-[#9090b0]">{social.handle}</div>
                      <div className="font-mono text-[0.65rem] text-[#44445a] mt-1">{social.desc}</div>
                    </div>
                    <svg
                      className="w-4 h-4 text-[#44445a] group-hover:text-[#9d5cff] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    >
                      <line x1="7" y1="17" x2="17" y2="7"/>
                      <polyline points="7 7 17 7 17 17"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="border-t border-[#1e1e2a] py-8 px-8 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://upload.drilex.cz/logo.png"
              alt="Drilex"
              className="h-5 w-auto opacity-40"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <span className="font-mono text-xs text-[#44445a]">
              © {new Date().getFullYear()} Drilex — Filip Šimkovič
            </span>
          </div>
          <span className="font-mono text-xs text-[#44445a]">Built with Next.js + PostgreSQL</span>
        </div>
      </footer>

    </div>
  );
}
