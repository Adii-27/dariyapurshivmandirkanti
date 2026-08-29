import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const STREET_VIEW_URL = "https://maps.app.goo.gl/vGTVsEXAFpj2MoNJ6";
const STREET_VIEW_EMBED =
  "https://www.google.com/maps/embed?pb=!4v1781246400000!6m8!1m7!1sLlVHTk5CHQ3BMBso2Fd39Q!2m2!1d26.1581116!2d85.3053131!3f254.31!4f0!5f0.7820865974627469";

export type VirtualDarshanModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dialogTitle: string;
  dragToLook: string;
};

export default function VirtualDarshanModal({
  isOpen,
  onOpenChange,
  dialogTitle,
  dragToLook,
}: VirtualDarshanModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="h-[88dvh] w-[calc(100%-1.5rem)] max-w-6xl grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden rounded-2xl border-gold/40 bg-ink p-0 text-cream shadow-glow sm:w-[calc(100%-3rem)]">
        <DialogDescription className="sr-only">
          Interactive Google Street View of Dariyapur Shiv Mandir Kanti.
        </DialogDescription>
        <div className="flex items-center justify-between gap-4 border-b border-cream/10 bg-ink px-4 py-3 pr-14 sm:px-5">
          <DialogTitle asChild>
            <a
              href={STREET_VIEW_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 min-w-0 items-center gap-2 rounded-md font-display text-base font-semibold text-cream transition-colors duration-300 hover:text-gold-soft sm:text-lg"
            >
              <span className="truncate">{dialogTitle}</span>
              <ExternalLink className="h-4 w-4 shrink-0" />
            </a>
          </DialogTitle>
          <span className="hidden text-[10px] font-semibold uppercase tracking-widest text-cream/55 sm:block">
            {dragToLook}
          </span>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-0 flex-1 overflow-hidden bg-black will-change-transform"
        >
          <iframe
            src={STREET_VIEW_EMBED}
            title={dialogTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
