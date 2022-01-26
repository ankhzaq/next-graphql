import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import InputField from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useCreatePostMutation } from '../generated/graphql';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import Layout from '../components/Layout';

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, createPost] = useCreatePostMutation();
 return (
   <Layout variant="small">
     <Formik
       initialValues={{ title: "", text: "" }}
       onSubmit={async (values, { setErrors }) => {
         const { error} = await createPost({ input: values });
         if (error) {
           // error because user is not authenticated
           console.log("error: ", error);
           router.push("/login")
         } else router.push('/');
       }}
     >
       {({ values, handleChange, isSubmitting }) =>(
         <Form>
           <InputField name="title" placeholder="title" label="title" />
           <Box mt={4}>
             <InputField name="text" placeholder="text..." label="Body" textarea />
           </Box>
           <Button mt={4} type="submit" isLoading={isSubmitting} variant="teal">Create Post</Button>
         </Form>
       )}
     </Formik>
   </Layout>
 );
}

export default withUrqlClient(createUrqlClient)(CreatePost);
