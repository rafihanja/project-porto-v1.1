import { formatNumberInput } from "@/lib/format";

type CurrencyInputProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  helper?: string;
  compactHelper?: boolean;
  onChange: (value: string) => void;
};

export function CurrencyInput({
  id,
  label,
  value,
  placeholder,
  helper,
  compactHelper = false,
  onChange
}: CurrencyInputProps) {
  return (
    <label
      className={`field input-card ${compactHelper ? "compact-helper" : ""}`}
      htmlFor={id}
    >
      <span className="field-label">{label}</span>
      <div className="currency-input">
        <span aria-hidden="true">Rp</span>
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(formatNumberInput(event.target.value))}
        />
      </div>
      {helper ? <small>{helper}</small> : null}
    </label>
  );
}
