import React from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonsProps {
  creatorId: number,
  id: number
}

const EditDeletePostButtonsProps: React.FC<EditDeletePostButtonsProps> = ({ creatorId, id }) => {
  const [, deletePost] = useDeletePostMutation();
  const [{ data: meData }] = useMeQuery();
  if (meData?.me?.id !== creatorId) return null;
  return (
    <Box ml="auto">
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton mr={4} icon={<EditIcon/>} aria-label="Delete post" />
      </NextLink>

      <IconButton icon={<DeleteIcon/>} aria-label="Edit post" onClick={() => {
        deletePost({ id });
      }} colorScheme="red"/>
    </Box>
  );
}

export default EditDeletePostButtonsProps;
