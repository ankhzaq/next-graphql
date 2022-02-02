import { NavBar } from '../components/NavbBar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';

const Index = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null as null | string });
  const [{ data, fetching }] = usePostsQuery({
    variables
  });

  if (!fetching && !data) {
    return <div> you got query failed for some reason</div>;
  }

  return (
    <Layout>
      <Flex>
        <Heading>LiReedit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">
            create post
          </Link>
        </NextLink>
      </Flex>

      <br />
      <Stack spacing={8}>
        {!data && fetching ? (
          <div>Loading...</div>
        ) : data!.posts.map(p => (
          <Box key={p.id} p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">{p.title}</Heading>
            <Text t={4}>{p.textSnippet}</Text>
          </Box>
        ))}
      </Stack>
      { data ?<Flex m="auto" my={8}>
        <Button onClick={() => {
          setVariables({
            limit: variables.limit,
            cursor: data.posts[data.posts.length - 1].createdAt
          });}
        } isLoading={fetching}>load more...</Button>
      </Flex> : null}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
