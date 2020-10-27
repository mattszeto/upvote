import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/core";
import NextLink from "next/link";
import React, { useState } from "react";
import { YupSection } from "../components/YupSection";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { useWindowDimensions } from "../utils/useWindowDimensions";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const { width, height } = useWindowDimensions();
  const [{ data, error, fetching }] = usePostsQuery({
    variables,
  });
  const [{ data: meData }] = useMeQuery({});

  if (!fetching && !data) {
    return <div>{error?.message}</div>;
  }

  return (
    <Layout>
      <Flex align="center" ml={8}>
        <Heading fontSize="24px">Home</Heading>
        {!meData?.me ? null : (
          <NextLink href="/create-post">
            <IconButton
              as={Link}
              mr={4}
              ml="auto"
              aria-label="Create Post"
              icon="add"
              size="sm"
              variantColor="teal"
              isRound={true}
            />
          </NextLink>
        )}
      </Flex>

      <br />
      {!data && fetching ? (
        <Icon name="spinner" />
      ) : (
        <Stack spacing={4}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Flex
                key={p.id}
                p={4}
                m={1}
                shadow="md"
                borderWidth="1px"
                borderRadius="md">
                <YupSection post={p} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Button
                      pt={2}
                      as={Link}
                      variant="link"
                      variantColor="darkbrown">
                      <Heading fontSize="md">{p.title}</Heading>
                    </Button>
                  </NextLink>
                  <Text fontSize="xs" pl={2} opacity={0.8}>
                    user/{p.creator.username}
                  </Text>
                  <Flex>
                    <Text
                      fontSize="14px"
                      mt={2}
                      fontWeight="medium"
                      w={width <= 350 ? "50%" : "70%"}>
                      {p.textSnippet}
                      {/* if snippet doesnt show all text, then display '...' to indicate more text*/}
                      {p.text.length > p.textSnippet.length ? "..." : null}
                    </Text>
                    <Box pt={8} ml="auto">
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

      <Flex>
        {data && data.posts.hasMore ? (
          <Flex flex={1} alignContent="center" my={4}>
            <Button
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                });
              }}
              isLoading={fetching}>
              Load More
            </Button>
          </Flex>
        ) : null}
        <Link
          my={4}
          ml="auto"
          href="https://github.com/mattszeto/upvote"
          fontSize="11px"
          opacity={0.8}>
          view on
          <Icon
            m={2}
            aria-label="Github"
            name={"github" as any}
            fontSize="20px"
          />
        </Link>
      </Flex>
    </Layout>
  );
};
// ssr = server-side rendering
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
