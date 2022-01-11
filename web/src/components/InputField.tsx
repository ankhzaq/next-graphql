import React, { InputHTMLAttributes } from 'react';
import { Formik, Form, useField } from 'formik';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string,
  placeholder: string
};

// '' => false
// 'error message stuff' => true

export const InputField: React.FC<InputFieldProps> = (props) => {
  const [field, { error }] = useField(props);
  return(
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <Input placeholder={props.placeholder} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>

  );
}

export default InputField;
