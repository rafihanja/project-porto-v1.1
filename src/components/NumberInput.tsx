type NumberInputProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  unit?: string;
  helper?: string;
  onChange: (value: string) => void;
};

export function NumberInput({
  id,
  label,
  value,
  placeholder,
  unit,
  helper,
  onChange
}: NumberInputProps) {
  return (
    <label className="field input-card compact-helper" htmlFor={id}>
      <span className="field-label">{label}</span>
      <div className="number-input">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value.replace(",", "."))}
        />
        {unit ? <span aria-hidden="true">{unit}</span> : null}
      </div>
      {helper ? <small>{helper}</small> : null}
    </label>
  );
}
