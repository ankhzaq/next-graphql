import React, { InputHTMLAttributes } from 'react';
import {  useField } from 'formik';
import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  placeholder: string;
  textarea?: boolean;
};

// '' => false
// 'error message stuff' => true

export const InputField: React.FC<InputFieldProps> = ({ label, size: _, textarea, ...props }) => {
  let InputOrTextArea = Input;
  if (textarea) { // @ts-ignore
    InputOrTextArea = Textarea;
  }
  const [field, { error }] = useField(props);
  return(
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextArea {...field} {...props} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>

  );
}

export default InputField;
