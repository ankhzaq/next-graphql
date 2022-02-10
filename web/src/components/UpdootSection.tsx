import React, { useState } from 'react';
import { Box, Flex, Heading, IconButton, Text } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { PostSnippetFragment, PostsQuery, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
  post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading');
  const [, vote] = useVoteMutation();
  console.log("post: ", post);
  return (
    <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
      <Flex direction="column" alignItems="center" mr={4}>
        <IconButton
          aria-label='updoot post'
          colorScheme={post.voteStatus === 1 ? 'green' : ''}
          icon={<ChevronUpIcon />}
          isLoading={loadingState === 'updoot-loading'}
          onClick={async () => {
            if (post.voteStatus !== 1) {
              setLoadingState('updoot-loading');
              await vote({ postId: post.id, value: 1 });
              setLoadingState('not-loading');
            }
          }}
          size="24px"
        />
        {post.points}
        <IconButton
          aria-label='downdoot post'
          colorScheme={post.voteStatus === -1 ? 'red' : ''}
          icon={<ChevronDownIcon />}
          isLoading={loadingState === 'downdoot-loading'}
          onClick={async () => {
            if (post.voteStatus === 1) {
              setLoadingState('downdoot-loading');
              await vote({ postId: post.id, value: -1 });
              setLoadingState('not-loading');
            }
          }}
          size="24px"
        />
      </Flex>
      <Box>
        <Heading fontSize="xl">{post.title}</Heading>
        <Text>Posted by {post.creator.username}</Text>
        <Text t={4}>{post.textSnippet}</Text>
      </Box>
    </Flex>
  );
}
