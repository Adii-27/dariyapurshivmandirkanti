import { motion } from "framer-motion";
import { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  hindi,
  children,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  hindi?: string;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`mx-auto min-w-0 max-w-3xl ${align === "center" ? "text-center" : "text-left"}`}
    >
      {eyebrow && (
        <div
          className={`mb-4 inline-flex max-w-full items-center gap-2 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="h-px w-4 shrink-0 bg-saffron-deep/60 sm:w-6" />
          <span className="min-w-0 break-words text-[11px] font-semibold uppercase tracking-[0.18em] text-saffron-deep sm:text-xs sm:tracking-[0.25em]">
            {eyebrow}
          </span>
          <span className="h-px w-4 shrink-0 bg-saffron-deep/60 sm:w-6" />
        </div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="break-words font-display text-[clamp(2.25rem,10vw,3rem)] font-semibold leading-[1.08] text-ink sm:text-5xl"
      >
        {title}
      </motion.h2>
      {hindi && <p className="font-hindi mt-3 text-xl text-saffron-deep sm:text-2xl">{hindi}</p>}
      {children && (
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {children}
        </p>
      )}
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative py-20 sm:py-24 lg:py-28 ${className}`}>
      <div className="mx-auto min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
