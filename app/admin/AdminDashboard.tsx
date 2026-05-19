"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import {
  createProjectAction,
  deleteProjectAction,
  logoutAction,
  type ProjectState,
} from "@/app/actions";
import type { Project } from "@/lib/types";
import { useRouter } from "next/navigation";

const initialState: ProjectState = {};

interface Props {
  projects: Project[];
}

export default function AdminDashboard({ projects }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(
    createProjectAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setImagePreview(null);
      router.refresh();
    }
  }, [state.success, router]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete project "${title}"?`)) return;
    await deleteProjectAction(id);
    router.refresh();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p className="section-label">// admin panel</p>
          <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>
            Project Manager
          </h1>
          <p style={{ marginTop: "0.4rem", fontSize: "0.9rem" }}>
            {projects.length} project{projects.length !== 1 ? "s" : ""} published
          </p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="btn" style={{ marginTop: "0.25rem" }}>
            Sign out
          </button>
        </form>
      </div>

      {/* ── Add project form ── */}
      <div>
        <p className="section-label">// add new project</p>
        <form
          ref={formRef}
          action={formAction}
          encType="multipart/form-data"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            maxWidth: 760,
          }}
        >
          {/* Title */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="title">Project title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="My Awesome Project"
              required
            />
          </div>

          {/* Redirect URL */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="redirect_url">Redirect URL</label>
            <input
              id="redirect_url"
              name="redirect_url"
              type="url"
              placeholder="https://example.com"
              required
            />
          </div>

          {/* Image upload */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="image">Project image (optional)</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              style={{ padding: "0.5rem 0.875rem" }}
            />
            {imagePreview && (
              <div style={{ marginTop: "0.75rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: 240,
                    aspectRatio: "16/9",
                    objectFit: "cover",
                    border: "1px solid var(--border)",
                    display: "block",
                  }}
                />
              </div>
            )}
          </div>

          {/* Feedback */}
          {state.error && (
            <div
              style={{
                gridColumn: "1 / -1",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                color: "#f87171",
                borderLeft: "2px solid #f87171",
                paddingLeft: "0.75rem",
              }}
            >
              {state.error}
            </div>
          )}

          {state.success && (
            <div
              style={{
                gridColumn: "1 / -1",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                color: "#4ade80",
                borderLeft: "2px solid #4ade80",
                paddingLeft: "0.75rem",
              }}
            >
              Project added successfully.
            </div>
          )}

          {/* Submit */}
          <div style={{ gridColumn: "1 / -1" }}>
            <button
              type="submit"
              className="btn btn-solid"
              disabled={isPending}
            >
              {isPending ? "Saving…" : "Add project →"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Existing projects ── */}
      <div>
        <p className="section-label">// existing projects</p>
        {projects.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "var(--text-dim)",
              paddingTop: "1rem",
            }}
          >
            No projects yet.
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              background: "var(--border)",
              border: "1px solid var(--border)",
            }}
          >
            {projects.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto auto",
                  alignItems: "center",
                  gap: "1.25rem",
                  padding: "1rem 1.25rem",
                  background: "var(--bg)",
                }}
              >
                {/* Thumbnail */}
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt={p.title}
                    style={{
                      width: 64,
                      height: 40,
                      objectFit: "cover",
                      border: "1px solid var(--border)",
                      display: "block",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 64,
                      height: 40,
                      background: "var(--bg-subtle)",
                      border: "1px solid var(--border)",
                      flexShrink: 0,
                    }}
                  />
                )}

                {/* Info */}
                <div style={{ overflow: "hidden" }}>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--text)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      color: "var(--text-dim)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.redirect_url}
                  </div>
                </div>

                {/* Date */}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: "var(--text-dim)",
                    flexShrink: 0,
                  }}
                >
                  {new Date(p.created_at).toLocaleDateString("en-GB")}
                </span>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(p.id, p.title)}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    color: "#f87171",
                    background: "transparent",
                    border: "1px solid #7f1d1d",
                    padding: "0.3rem 0.65rem",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#7f1d1d40";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
