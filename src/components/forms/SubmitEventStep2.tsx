import type {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import type { EventFormValues } from "@/lib/validations/event.schema";
import { QUARTIERS } from "@/lib/constants/quartiers";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FieldLabel, FieldError } from "@/components/ui/Field";

interface SubmitEventStep2Props {
  register: UseFormRegister<EventFormValues>;
  errors: FieldErrors<EventFormValues>;
  values: EventFormValues;
  setValue: UseFormSetValue<EventFormValues>;
}

export function SubmitEventStep2({
  register,
  errors,
  values,
  setValue,
}: SubmitEventStep2Props) {
  return (
    <div className="flex flex-col gap-[22px]">
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <FieldLabel htmlFor="dateStart">Date de début *</FieldLabel>

          <Input
            id="dateStart"
            type="date"
            {...register("dateStart")}
            error={errors.dateStart?.message}
          />

          <FieldError>{errors.dateStart?.message}</FieldError>
        </div>

        <div>
          <FieldLabel htmlFor="timeStart">Heure de début *</FieldLabel>

          <Input
            id="timeStart"
            type="time"
            {...register("timeStart")}
            error={errors.timeStart?.message}
          />

          <FieldError>{errors.timeStart?.message}</FieldError>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <FieldLabel htmlFor="dateEnd" optional>
            Date de fin
          </FieldLabel>

          <Input id="dateEnd" type="date" {...register("dateEnd")} />
        </div>

        <div>
          <FieldLabel htmlFor="timeEnd" optional>
            Heure de fin
          </FieldLabel>

          <Input id="timeEnd" type="time" {...register("timeEnd")} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="address">Adresse / Lieu *</FieldLabel>

        <Input
          id="address"
          {...register("address")}
          placeholder="Ex : Le Repaire de Bacchus, Rue 12.34"
          error={errors.address?.message}
        />

        <FieldError>{errors.address?.message}</FieldError>
      </div>

      <div>
        <FieldLabel htmlFor="quartier">Quartier *</FieldLabel>

        <Select
          placeholder="Sélectionnez un quartier"
          options={QUARTIERS}
          value={values.quartier ?? ""}
          onChange={(e) =>
            setValue("quartier", e.target.value, { shouldValidate: true })
          }
          error={errors.quartier?.message}
        />

        <FieldError>{errors.quartier?.message}</FieldError>
      </div>
    </div>
  );
}
