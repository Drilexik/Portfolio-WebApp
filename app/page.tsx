/**
 * app/page.tsx — Public portfolio home page.
 *
 * Server Component: fetches projects directly from PostgreSQL via raw SQL.
 * No client-side JS required for the initial render.
 */

import { query } from "@/lib/db";
import type { Project } from "@/lib/types";
import styles from "./page.module.css";

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getProjects(): Promise<Project[]> {
  try {
    const { rows } = await query<Project>(
      "SELECT id, title, image_url, redirect_url, created_at FROM projects ORDER BY created_at DESC"
    );
    return rows;
  } catch (err) {
    console.error("[page] Failed to fetch projects:", err);
    return [];
  }
}

// ─── Static data ──────────────────────────────────────────────────────────────

const SKILLS = [
  "Next.js",
  "React",
  "HTML",
  "CSS",
  "JavaScript",
  "Lua",
  "Python",
  "Node.js",
  "C",
];

const SOCIALS = [
  {
    label: "GitHub",
    handle: "drilexik",
    href: "https://github.com/drilexik",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    handle: "Filip Šimkovič",
    href: "https://www.linkedin.com/in/filip-%C5%A1imkovi%C4%8D-5663173b6/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <main className={styles.main}>
      {/* ── Nav ── */}
      <nav className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <span className={`mono ${styles.logo}`}>drilex.cz</span>
          <a href="mailto:contact@drilex.cz" className="btn">
            contact@drilex.cz
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="container">
          <p className="section-label">// introduction</p>
          <h1 className={styles.heroHeading}>
            Drilex<span className={styles.cursor}>_</span>
          </h1>
          <p className={styles.heroSub}>
            Full Stack Developer. Building products for the web — from database
            to deployment.
          </p>
          <div className={styles.heroActions}>
            <a href="#projects" className="btn btn-solid">
              View Projects
            </a>
            <a href="#skills" className="btn">
              Skills &amp; Stack
            </a>
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="skills" className={styles.section}>
        <div className="container">
          <p className="section-label">// skills &amp; stack</p>
          <div className={styles.skillsGrid}>
            {SKILLS.map((skill) => (
              <div key={skill} className={styles.skillChip}>
                <span className={styles.skillDot} />
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className={styles.section}>
        <div className="container">
          <p className="section-label">// projects</p>
          {projects.length === 0 ? (
            <p className={styles.emptyState}>
              No projects yet — check back soon.
            </p>
          ) : (
            <div className={styles.projectsGrid}>
              {projects.map((project) => (
                <a
                  key={project.id}
                  href={project.redirect_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.projectCard}
                >
                  {project.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className={styles.projectImage}
                    />
                  ) : (
                    <div className={styles.projectImagePlaceholder}>
                      <span className="mono" style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>
                        no preview
                      </span>
                    </div>
                  )}
                  <div className={styles.projectBody}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <span className={styles.projectLink}>
                      {project.redirect_url.replace(/^https?:\/\//, "")}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ marginLeft: 4 }}
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Socials ── */}
      <section id="socials" className={styles.section}>
        <div className="container">
          <p className="section-label">// find me online</p>
          <div className={styles.socials}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialCard}
              >
                <span className={styles.socialIcon}>{s.icon}</span>
                <div>
                  <div className={styles.socialLabel}>{s.label}</div>
                  <div className={styles.socialHandle}>{s.handle}</div>
                </div>
                <svg
                  className={styles.socialArrow}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className={styles.section}>
        <div className="container">
          <p className="section-label">// contact</p>
          <div className={styles.contactBlock}>
            <h2 className={styles.contactHeading}>Let's work together.</h2>
            <p>
              Have a project in mind or just want to say hello? Drop me an email
              and I'll get back to you.
            </p>
            <a href="mailto:contact@drilex.cz" className={`btn btn-solid ${styles.contactBtn}`}>
              contact@drilex.cz
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <span className="mono" style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>
            © {new Date().getFullYear()} Drilex — Filip Šimkovič
          </span>
          <span className="mono" style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>
            Built with Next.js
          </span>
        </div>
      </footer>
    </main>
  );
}
