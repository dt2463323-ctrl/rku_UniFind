import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { Item } from "../../data/types";
import { useI18n } from "../../i18n";
import { Field, inputClass } from "../form/Field";
import { Sheet } from "../Sheet";

type Step = "verify" | "message" | "sending" | "sent";

interface Props {
  item: Item;
  open: boolean;
  onClose: () => void;
}

const MIN_PROOF = 10;

// Found items ask the claimer for a private detail before messaging the finder.
export function ContactSheet({ item, open, onClose }: Props) {
  const { t, item: localize, location } = useI18n();
  const isFound = item.status === "found";
  const [step, setStep] = useState<Step>(isFound ? "verify" : "message");
  const [proof, setProof] = useState("");
  const [proofError, setProofError] = useState("");
  const [message, setMessage] = useState(() => {
    const name = localize(item).name;
    return isFound
      ? t("item.contactSheet.msg.found", {
          name,
          location: location(item.location),
        })
      : t("item.contactSheet.msg.lost", { name });
  });

  const close = () => {
    onClose();
    // Reset after the sheet is gone.
    setTimeout(() => {
      setStep(isFound ? "verify" : "message");
      setProof("");
      setProofError("");
    }, 200);
  };

  const send = () => {
    setStep("sending");
    setTimeout(() => setStep("sent"), 700);
  };

  const title = t(
    step === "verify"
      ? "item.contactSheet.title.verify"
      : step === "sent"
        ? "item.contactSheet.title.sent"
        : "item.contactSheet.title.message",
  );

  return (
    <Sheet open={open} title={title} onClose={close}>
      {step === "verify" && (
        <div className="space-y-4">
          <p className="flex gap-2.5 rounded-xl bg-primary-soft p-3 text-sm leading-relaxed text-primary-dark">
            <ShieldCheck size={18} className="mt-0.5 shrink-0" />
            {t("item.contactSheet.verify.intro")}
          </p>
          <Field
            label={t("item.contactSheet.proof.label")}
            htmlFor="proof"
            error={proofError}
          >
            <textarea
              id="proof"
              rows={3}
              value={proof}
              onChange={(e) => {
                setProof(e.target.value);
                if (proofError) setProofError("");
              }}
              placeholder={t("item.contactSheet.proof.placeholder")}
              className={`${inputClass(!!proofError)} resize-none`}
              style={
                { "--tone": "var(--color-primary)" } as React.CSSProperties
              }
            />
          </Field>
          <button
            type="button"
            onClick={() =>
              proof.trim().length < MIN_PROOF
                ? setProofError(t("item.contactSheet.proof.error"))
                : setStep("message")
            }
            className="w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 active:scale-[0.99]"
          >
            {t("item.contactSheet.continue")}
          </button>
        </div>
      )}

      {(step === "message" || step === "sending") && (
        <div
          className="space-y-4"
          style={{ "--tone": "var(--color-primary)" } as React.CSSProperties}
        >
          <Field
            label={t("item.contactSheet.message.label")}
            htmlFor="message"
            hint={t("item.contactSheet.message.hint")}
          >
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${inputClass()} resize-none`}
            />
          </Field>
          <button
            type="button"
            onClick={send}
            disabled={step === "sending" || !message.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 active:scale-[0.99] disabled:opacity-70"
          >
            {step === "sending" && (
              <Loader2 size={16} className="animate-spin" />
            )}
            {step === "sending"
              ? t("item.contactSheet.sending")
              : t("item.contactSheet.send")}
          </button>
        </div>
      )}

      {step === "sent" && (
        <div className="space-y-4 text-center">
          <CheckCircle2 size={48} className="mx-auto text-success" />
          <p className="text-sm leading-relaxed text-muted">
            {isFound
              ? t("item.contactSheet.sent.found")
              : t("item.contactSheet.sent.lost")}
          </p>
          <button
            type="button"
            onClick={close}
            className="w-full rounded-2xl py-3.5 text-sm font-semibold text-navy ring-1 ring-black/10"
          >
            {t("item.contactSheet.done")}
          </button>
        </div>
      )}
    </Sheet>
  );
}
