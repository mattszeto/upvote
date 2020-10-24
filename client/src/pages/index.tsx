import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";
import NextLink from "next/link";
import React, { useState } from "react";
import { YupSection } from "../components/YupSection";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, error, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <div>{error?.message}</div>;
  }

  return (
    <Layout>
      <Flex align="center" ml={10}>
        <Heading fontSize="24px" fontFamily="monospace">
          Home
        </Heading>
        <NextLink href="/create-post">
          <Button as={Link} mr={4} ml="auto">
            Create Post
          </Button>
        </NextLink>
      </Flex>

      <br />
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Flex
                key={p.id}
                p={4}
                m={4}
                shadow="md"
                borderWidth="1px"
                borderRadius="md">
                <YupSection post={p} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Link>
                      <Heading fontSize="xl" fontFamily="monospace">
                        {p.title}
                      </Heading>
                    </Link>
                  </NextLink>
                  <Text fontSize="13px" fontFamily="monospace">
                    posted by {p.creator.username}
                  </Text>
                  <Flex align="center">
                    <Text mt={4} fontFamily="monospace">
                      {p.textSnippet}
                    </Text>

                    <Box ml="auto">
                      <EditDeletePostButtons
                        id={p.id}
                        creatorId={p.creator.id}
                      />
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}>
            Load More
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};
// ssr = server-side rendering
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
