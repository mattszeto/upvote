import { Flex, IconButton } from "@chakra-ui/core";
import React, { useState } from "react";
import {
  PostSnippetFragment,
  PostsQuery,
  useVoteMutation,
} from "../generated/graphql";

interface YupSectionProps {
  post: PostSnippetFragment;
}

export const YupSection: React.FC<YupSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "yup-loading" | "down-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" mr={4}>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState("yup-loading");
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoadingState("not-loading");
        }}
        variantColor={post.voteStatus === 1 ? "blue" : undefined}
        isLoading={loadingState === "yup-loading"}
        aria-label="yup"
        icon="chevron-up"
        size="md"
        variant="ghost"
      />
      {post.points}
      <IconButton
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState("down-loading");
          await vote({
            postId: post.id,
            value: -1,
          });

          setLoadingState("not-loading");
        }}
        variantColor={post.voteStatus === -1 ? "orange" : undefined}
        isLoading={loadingState === "down-loading"}
        aria-label="down"
        icon="chevron-down"
        size="md"
        variant="ghost"
      />
    </Flex>
  );
};
