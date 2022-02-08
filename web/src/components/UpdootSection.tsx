import React from 'react';
import { Box, Flex, Heading, IconButton, Text } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { PostsQuery } from '../generated/graphql';

interface UpdootSectionProps {
  p: PostsQuery['posts']['posts'][0]
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ p }) => {
  return (
    <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
      <Flex direction="column" alignItems="center" mr={4}>
        <IconButton
          aria-label='updoot post'
          icon={<ChevronUpIcon />}
          size="24px"
        />
        {p.points}
        <IconButton
          aria-label='downdoot post'
          icon={<ChevronDownIcon />}
          size="24px"
        />
      </Flex>
      <Box>
        <Heading fontSize="xl">{p.title}</Heading>
        <Text>Posted by {p.creator.username}</Text>
        <Text t={4}>{p.textSnippet}</Text>
      </Box>
    </Flex>
  );
}
