import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import InputField from '../components/InputField';
import { Box, Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useRouter } from 'next/router';
import { useForgotPasswordMutation } from '../generated/graphql';

const forgotPassword: React.FC<{}> = ({ }) => {
  const router = useRouter();
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return(
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ values, handleChange, isSubmitting }) => complete ? (
          <Box>if an account with that email exists, we sent you an email</Box>
        ) :(
          <Form>
            <InputField name="email" placeholder="email" label="email" />
            <Button mt={4} type="submit" isLoading={isSubmitting} variant="teal">Forgot password</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(forgotPassword);
