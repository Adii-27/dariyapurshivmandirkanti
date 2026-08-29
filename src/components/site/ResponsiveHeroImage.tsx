import { HERO_IMAGE_SOURCES } from "@/lib/media";

export type ResponsiveHeroImageProps = {
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
};

export function ResponsiveHeroImage({
  alt,
  className,
  loading = "lazy",
  fetchPriority = "auto",
}: ResponsiveHeroImageProps) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={HERO_IMAGE_SOURCES.webp.srcSet}
        sizes="100vw"
      />
      <source
        type="image/jpeg"
        srcSet={HERO_IMAGE_SOURCES.jpeg.srcSet}
        sizes="100vw"
      />
      <img
        src={HERO_IMAGE_SOURCES.fallback}
        alt={alt}
        width={HERO_IMAGE_SOURCES.width}
        height={HERO_IMAGE_SOURCES.height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
