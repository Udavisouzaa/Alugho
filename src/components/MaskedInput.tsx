'use client'

import { useState } from 'react'

type MaskedInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  maskType: 'cpf' | 'phone'
}

export default function MaskedInput({ maskType, defaultValue = '', ...props }: MaskedInputProps) {
  const [value, setValue] = useState(defaultValue as string)

  const applyMask = (val: string) => {
    let unmasked = val.replace(/\D/g, '')
    
    if (maskType === 'cpf') {
      if (unmasked.length > 11) unmasked = unmasked.slice(0, 11)
      return unmasked
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    }
    
    if (maskType === 'phone') {
      if (unmasked.length > 11) unmasked = unmasked.slice(0, 11)
      return unmasked
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1')
    }

    return unmasked
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(applyMask(e.target.value))
    if (props.onChange) {
      props.onChange(e)
    }
  }

  return (
    <input
      {...props}
      value={value}
      onChange={handleChange}
    />
  )
}
