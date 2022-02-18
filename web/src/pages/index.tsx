import { NavBar } from '../components/NavbBar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Heading, Icon, IconButton, Link, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { UpdootSection } from '../components/UpdootSection';

const Index = () => {
  const [variables, setVariables] = useState({ limit: 15, cursor: null as null | string });
  const [{ data, error, fetching }] = usePostsQuery({
    variables
  });

  if (!fetching && !data) {
    return (<div>
      <div> you got query failed for some reason</div>
      <div>{error?.message}</div>
    </div>);
  }

  return (
    <Layout>
      <br />
      <Stack spacing={8}>
        {!data && fetching ? (
          <div>Loading...</div>
        ) : data!.posts.posts.map(post => !post ? null : (
          <UpdootSection post={post} />
        ))}
      </Stack>
      { data && data.posts.hasMore ?<Flex m="auto" my={8}>
        <Button onClick={() => {
          setVariables({
            limit: variables.limit,
            cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
          });}
        } isLoading={fetching}>load more...</Button>
      </Flex> : null}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
