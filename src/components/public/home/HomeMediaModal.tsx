import { useEffect } from "react";

import PublicSvgIcon from "../PublicSvgIcon";

interface HomeMediaModalProps {
  open: boolean;
  title: string;
  videoUrl?: string;
  posterUrl?: string;
  onClose: () => void;
}

function HomeMediaModal({
  open,
  title,
  videoUrl,
  posterUrl,
  onClose,
}: HomeMediaModalProps) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Close video"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <section className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-slate-950 px-4 py-3 text-white sm:px-5">
          <p className="truncate font-semibold">{title}</p>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <PublicSvgIcon name="X" className="h-5 w-5" />
          </button>
        </div>

        <div className="aspect-video bg-slate-950">
          {videoUrl ? (
            <video
              src={videoUrl}
              poster={posterUrl}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                <PublicSvgIcon
                  name="Youtube"
                  className="h-8 w-8"
                />
              </span>
              <p className="mt-5 text-lg font-semibold">
                Video will be available soon
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/65">
                Add the final video through the Home Content Manager.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomeMediaModal;
