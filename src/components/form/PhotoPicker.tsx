import { Camera, ImagePlus, X } from "lucide-react";
import { useRef } from "react";
import { useI18n } from "../../i18n";

interface Props {
  value?: string;
  onChange: (url?: string) => void;
  tone: "lost" | "found";
}

export function PhotoPicker({ value, onChange, tone }: Props) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const zone =
    tone === "lost"
      ? "from-primary-soft to-sky-100 border-primary/30 text-primary"
      : "from-indigo-100 to-violet-100 border-indigo/30 text-indigo";
  // Helper text tinted from the zone hue, kept above 4.5:1.
  const helper = tone === "lost" ? "text-primary-dark" : "text-indigo-700";

  if (value) {
    return (
      <div className="relative h-44 overflow-hidden rounded-2xl ring-1 ring-black/5">
        <img
          src={value}
          alt={t("report.photo.selected")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-3 bottom-3 flex justify-between">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-navy shadow-md"
          >
            <Camera size={14} /> {t("report.photo.change")}
          </button>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            aria-label={t("report.photo.remove")}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-navy shadow-md"
          >
            <X size={16} />
          </button>
        </div>
        <HiddenInput inputRef={inputRef} onChange={onChange} />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={`flex h-36 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-gradient-to-br transition active:scale-[0.99] ${zone}`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
        <ImagePlus size={20} />
      </span>
      <span className="text-sm font-semibold">{t("report.photo.add")}</span>
      <span className={`text-xs ${helper}`}>{t("report.photo.helper")}</span>
      <HiddenInput inputRef={inputRef} onChange={onChange} />
    </button>
  );
}

function HiddenInput({
  inputRef,
  onChange,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (url?: string) => void;
}) {
  return (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onChange(URL.createObjectURL(file));
        e.target.value = "";
      }}
    />
  );
}
