import type {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import Link from "next/link";
import type { EventFormValues } from "@/lib/validations/event.schema";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { FieldLabel, FieldError } from "@/components/ui/Field";

interface SubmitEventStep3Props {
  register: UseFormRegister<EventFormValues>;
  errors: FieldErrors<EventFormValues>;
  values: EventFormValues;
  setValue: UseFormSetValue<EventFormValues>;
}

export function SubmitEventStep3({
  register,
  errors,
  values,
  setValue,
}: SubmitEventStep3Props) {
  return (
    <div className="flex flex-col gap-[22px]">
      <div>
        <FieldLabel htmlFor="org">Nom ou organisation *</FieldLabel>

        <Input
          id="org"
          {...register("org")}
          placeholder="Ex : Cotonou Sound Lab"
          error={errors.org?.message}
        />

        <FieldError>{errors.org?.message}</FieldError>
      </div>

      <div>
        <FieldLabel>Téléphone WhatsApp de contact *</FieldLabel>

        <PhoneInput
          {...register("phone")}
          value={values.phone ?? ""}
          error={errors.phone?.message}
        />

        <FieldError>{errors.phone?.message}</FieldError>
      </div>

      <div>
        <FieldLabel htmlFor="email" optional>
          Email de contact
        </FieldLabel>

        <Input
          id="email"
          {...register("email")}
          placeholder="contact@exemple.com"
          error={errors.email?.message}
        />

        <FieldError>{errors.email?.message}</FieldError>
      </div>

      <div>
        <FieldLabel htmlFor="orgFb" optional>
          Page Facebook de l&apos;organisateur
        </FieldLabel>

        <Input
          id="orgFb"
          {...register("orgFb")}
          placeholder="https://facebook.com/votre-page"
          error={errors.orgFb?.message}
        />

        <FieldError>{errors.orgFb?.message}</FieldError>
      </div>

      <Checkbox
        checked={!!values.consent1}
        onChange={(c) =>
          setValue("consent1", c as true, { shouldValidate: true })
        }
      >
        J&apos;atteste que cet événement est réel, public et se déroule à
        Cotonou. Je comprends que les fausses soumissions entraînent un
        bannissement.
      </Checkbox>

      <FieldError>{errors.consent1?.message}</FieldError>

      <Checkbox
        checked={!!values.consent2}
        onChange={(c) =>
          setValue("consent2", c as true, { shouldValidate: true })
        }
      >
        J&apos;accepte la{" "}
        <Link href="/politique-de-confidentialite" className="text-brand">
          politique de confidentialité
        </Link>{" "}
        et les{" "}
        <Link href="/conditions-utilisation" className="text-brand">
          conditions d&apos;utilisation
        </Link>
        .
      </Checkbox>

      <FieldError>{errors.consent2?.message}</FieldError>
    </div>
  );
}
