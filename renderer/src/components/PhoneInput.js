import React from "react";
import { TextField } from "@mui/material";
import { IMaskInput } from 'react-imask';

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(#0) 00000-0000"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { value } })}
      overwrite
    />
  )
})

export default function PhoneInput({ value, onChange, helperText, className }) {

    return (
        <TextField 
            label="Telefone"
            value={value}
            onChange={onChange}
            error={!!helperText}
            helperText={helperText?.message}
            fullWidth
            className={className}
            slotProps={{
                input: {
                    inputComponent: TextMaskCustom
                }
            }}
        />
    )
}