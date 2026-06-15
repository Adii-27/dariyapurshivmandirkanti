import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Music2 } from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { Section, SectionHeading } from "@/components/site/Section";
import { createSeoHead, SEO_PAGES } from "@/lib/seo";

const PLAYLIST_URL = "https://open.spotify.com/playlist/2WnKf0Y1GYbtnJOkQtmalX";
const PLAYLIST_EMBED_URL =
  "https://open.spotify.com/embed/playlist/2WnKf0Y1GYbtnJOkQtmalX?utm_source=generator";

export const Route = createFileRoute("/sangeet")({
  head: () => createSeoHead(SEO_PAGES.sangeet),
  component: SangeetPage,
});

function SangeetPage() {
  return (
    <div className="min-h-dvh bg-background">
      <Navbar />

      <main className="overflow-hidden">
        <Section
          id="sangeet"
          className="bg-gradient-to-b from-secondary/70 via-background to-background pb-14 pt-36 sm:pb-16 sm:pt-40"
        >
          <SectionHeading eyebrow="Devotional Music" title="Sangeet 🎵">
            Listen to Shiv Bhajans, Stotrams, Mantras, and Devotional Music.
          </SectionHeading>
          <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
            A collection of devotional music dedicated to Lord Shiva and spiritual practice.
          </p>
        </Section>

        <Section className="pt-10 sm:pt-14">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <article className="interactive-surface flex flex-col justify-center rounded-3xl border border-border bg-card p-6 shadow-sacred hover:border-gold/50 hover:shadow-glow sm:p-9">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-saffron/10 text-saffron-deep">
                <Music2 className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-ink">
                Dariyapur Shiv Mandir Kanti
              </h2>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-saffron-deep">
                Official Devotional Music Playlist
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Listen to Shiv Bhajans, Mantras, Stotrams and Sacred Music.
              </p>
              <div className="mt-7">
                <a
                  href={PLAYLIST_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="interactive-surface inline-flex min-h-11 items-center justify-center gap-2 rounded-full gradient-saffron px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sacred"
                >
                  Open Playlist in Spotify
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </article>

            <DeferredSpotifyEmbed />
          </div>
        </Section>

        <Section className="pt-8 sm:pt-10">
          <blockquote className="interactive-surface mx-auto max-w-3xl rounded-3xl border border-gold/30 bg-card px-5 py-10 text-center shadow-sacred hover:border-gold/50 hover:shadow-glow sm:px-12 sm:py-12">
            <p className="font-hindi text-3xl font-semibold text-saffron-deep sm:text-4xl">
              “नाद ही ब्रह्म है”
            </p>
            <p className="mt-5 font-display text-xl text-ink sm:text-2xl">
              Music is a path to devotion and inner peace.
            </p>
          </blockquote>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

function DeferredSpotifyEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "200px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden rounded-3xl border border-border bg-card shadow-sacred"
    >
      {shouldLoad ? (
        <iframe
          title="Dariyapur Shiv Mandir devotional music playlist"
          src={PLAYLIST_EMBED_URL}
          width="100%"
          height="352"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="block h-[352px] w-full border-0"
        />
      ) : (
        <div
          className="grid h-[352px] place-items-center bg-secondary/50 text-saffron-deep"
          aria-label="Spotify playlist preview loading"
        >
          <Music2 className="h-7 w-7" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
