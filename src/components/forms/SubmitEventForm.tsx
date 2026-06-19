"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import {
  eventSchema,
  type EventFormValues,
} from "@/lib/validations/event.schema";
import { submitEvent } from "@/lib/actions/events";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { SubmitEventStepIndicator } from "@/components/forms/SubmitEventStepIndicator";
import { SubmitEventStep1 } from "@/components/forms/SubmitEventStep1";
import { SubmitEventStep2 } from "@/components/forms/SubmitEventStep2";
import { SubmitEventStep3 } from "@/components/forms/SubmitEventStep3";

const STEP_FIELDS: (keyof EventFormValues)[][] = [
  ["title", "category", "description", "priceType", "amount", "link"],
  ["dateStart", "timeStart", "dateEnd", "timeEnd", "address", "quartier"],
  ["org", "phone", "email", "orgFb", "consent1", "consent2"],
];

export function SubmitEventForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [image, setImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      description: "",
      amount: "",
      link: "",
      email: "",
      orgFb: "",
    },
  });

  const values = watch();

  const next = async () => {
    const valid = await trigger(
      STEP_FIELDS[step - 1] as (keyof EventFormValues)[],
    );
    if (valid) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0 });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (typeof value === "string") formData.append(key, value);
    });
    if (imageFile) formData.append("image", imageFile);

    const result = await submitEvent(formData);
    if (!result.ok) {
      toast({ variant: "error", title: "Soumission impossible", description: result.error });
      return;
    }
    router.push("/soumettre/confirmation");
  });

  const onImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-7 shadow-card"
    >
      <SubmitEventStepIndicator step={step} />

      {step === 1 && (
        <SubmitEventStep1
          register={register}
          errors={errors}
          values={values}
          setValue={setValue}
          image={image}
          onImage={onImage}
          onRemoveImage={() => {
            setImage("");
            setImageFile(null);
          }}
        />
      )}

      {step === 2 && (
        <SubmitEventStep2
          register={register}
          errors={errors}
          values={values}
          setValue={setValue}
        />
      )}

      {step === 3 && (
        <SubmitEventStep3
          register={register}
          errors={errors}
          values={values}
          setValue={setValue}
        />
      )}

      <div className="mt-7 flex items-center justify-between gap-3 border-t border-gray-100 pt-[22px]">
        {step > 1 ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => s - 1)}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Précédent
          </Button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <Button type="button" onClick={next}>
            Suivant <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        ) : (
          <Button type="submit" loading={isSubmitting}>
            Soumettre l&apos;événement <Send className="h-4 w-4" aria-hidden />
          </Button>
        )}
      </div>
    </form>
  );
}
