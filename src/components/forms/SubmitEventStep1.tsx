import type {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { ImagePlus, Trash2 } from "lucide-react";
import type { EventFormValues } from "@/lib/validations/event.schema";
import { CATEGORY_NAMES, CATEGORIES } from "@/lib/constants/categories";
import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { FieldLabel, FieldError } from "@/components/ui/Field";

interface SubmitEventStep1Props {
  register: UseFormRegister<EventFormValues>;
  errors: FieldErrors<EventFormValues>;
  values: EventFormValues;
  setValue: UseFormSetValue<EventFormValues>;
  image: string;
  onImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function SubmitEventStep1({
  register,
  errors,
  values,
  setValue,
  image,
  onImage,
  onRemoveImage,
}: SubmitEventStep1Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <FieldLabel htmlFor="title">Titre de l&apos;événement *</FieldLabel>

        <Input
          id="title"
          {...register("title")}
          maxLength={100}
          placeholder="Ex : Concert Afro Nuit Live"
          error={errors.title?.message}
        />

        <div className="mt-1.5 flex justify-between">
          <FieldError>{errors.title?.message}</FieldError>

          <span className="ml-auto text-xs text-gray-500">
            {values.title?.length ?? 0}/100
          </span>
        </div>
      </div>

      <div>
        <FieldLabel>Catégorie *</FieldLabel>

        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORY_NAMES.map((name) => {
            const selected = values.category === name;

            return (
              <button
                type="button"
                key={name}
                onClick={() =>
                  setValue("category", name, { shouldValidate: true })
                }
                className={cn(
                  "flex items-center gap-2.5 rounded-[10px] border-[1.5px] px-3.5 py-3 text-left",
                  selected
                    ? "border-brand bg-[#F0FDF4]"
                    : "border-gray-200 bg-white",
                )}
              >
                <Icon
                  name={CATEGORIES[name].icon}
                  className={cn(
                    "h-5 w-5",
                    selected ? "text-brand" : "text-gray-500",
                  )}
                  aria-hidden
                />

                <span className="text-sm font-semibold text-gray-900">
                  {name}
                </span>
              </button>
            );
          })}
        </div>

        <FieldError>{errors.category?.message}</FieldError>
      </div>

      <div>
        <FieldLabel htmlFor="description">Description *</FieldLabel>

        <textarea
          id="description"
          {...register("description")}
          maxLength={500}
          placeholder="Décrivez votre événement (minimum 50 caractères)…"
          className="min-h-[110px] w-full resize-y rounded-lg border-[1.5px] border-gray-200 p-3.5 text-base leading-relaxed outline-none focus:border-brand focus:shadow-[0_0_0_3px_rgba(22,163,74,0.12)]"
        />

        <div className="mt-1.5 flex justify-between">
          <FieldError>{errors.description?.message}</FieldError>

          <span
            className={cn(
              "ml-auto text-xs",
              (values.description?.length ?? 0) < 50
                ? "text-amber-500"
                : "text-gray-500",
            )}
          >
            {values.description?.length ?? 0}/500 · min. 50
          </span>
        </div>
      </div>

      <div>
        <FieldLabel>Prix *</FieldLabel>

        <div className="flex gap-2.5">
          {(["gratuit", "payant"] as const).map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setValue("priceType", p, { shouldValidate: true })}
              className={cn(
                "h-11 flex-1 rounded-lg border-[1.5px] text-sm font-semibold text-gray-900",
                values.priceType === p
                  ? "border-brand bg-[#F0FDF4]"
                  : "border-gray-200 bg-white",
              )}
            >
              {p === "gratuit" ? "Gratuit" : "Payant"}
            </button>
          ))}
        </div>

        {values.priceType === "payant" && (
          <div className="mt-2.5 flex h-11 items-stretch overflow-hidden rounded-lg border-[1.5px] border-gray-200">
            <input
              {...register("amount")}
              inputMode="numeric"
              placeholder="Montant"
              className="flex-1 border-none px-3.5 text-base outline-none"
            />

            <div className="flex items-center border-l border-gray-200 bg-gray-50 px-3.5 text-sm text-gray-700">
              FCFA
            </div>
          </div>
        )}

        <FieldError>{errors.priceType?.message}</FieldError>
      </div>

      <div>
        <FieldLabel>Affiche / image</FieldLabel>

        {image ? (
          <div className="flex items-center gap-3.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="Aperçu de l'affiche sélectionnée"
              className="h-[120px] w-[120px] rounded-[10px] border border-gray-200 object-cover"
            />

            <button
              type="button"
              onClick={onRemoveImage}
              className="inline-flex items-center gap-1.5 rounded-pill border-[1.5px] border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-500"
            >
              <Trash2 className="h-[15px] w-[15px]" aria-hidden /> Supprimer
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-7 text-center">
            <ImagePlus
              className="h-8 w-8 text-gray-500"
              strokeWidth={1.5}
              aria-hidden
            />

            <span className="text-sm font-semibold text-gray-700">
              Glissez une image ou cliquez pour parcourir
            </span>

            <span className="text-xs text-gray-500">
              JPG, PNG, WEBP · max 5MB
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={onImage}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div>
        <FieldLabel htmlFor="link" optional>
          Lien Facebook ou site web
        </FieldLabel>

        <Input
          id="link"
          {...register("link")}
          placeholder="https://facebook.com/votre-evenement"
          error={errors.link?.message}
        />

        <FieldError>{errors.link?.message}</FieldError>
      </div>
    </div>
  );
}
