import React from 'react';
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { Form, Formik } from 'formik';
import InputField from '../../../components/InputField';
import { Box, Button } from '@chakra-ui/react';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import { usePostsQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';
import { useGetIntId } from '../../../utils/useGetIntId';

export const EditPost = ({ }) => {
  const router = useRouter();
  const intId = useGetIntId();
  const [{ data, fetching }] = useGetPostFromUrl();
  const [, updatePost] = useUpdatePostMutation()
  if (fetching) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <div>Could not find post</div>
      </Layout>
    );
  }
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values, { setErrors }) => {
          await updatePost({ id: intId, ...values });
          router.back();
        }}
      >
        {({ values, handleChange, isSubmitting }) =>(
          <Form>
            <InputField name="title" placeholder="title" label="title" />
            <Box mt={4}>
              <InputField name="text" placeholder="text..." label="Body" textarea />
            </Box>
            <Button mt={4} type="submit" isLoading={isSubmitting} variant="teal">Edit Post</Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient)(EditPost);
