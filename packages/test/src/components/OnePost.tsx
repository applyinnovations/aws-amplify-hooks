import { GetItem } from "../DeltaSync";
import { graphql } from "graphql";
import { Post } from "models";

const OnePost = ({ post }: { post: Post }) => (
  <div>{JSON.stringify(post, null, 2)}</div>
);

// @ts-ignore
export default graphql(GetItem, {
  options: ({ id }: { id: string }) => ({
    variables: { id },
    fetchPolicy: "cache-only",
  }),
  // @ts-ignore
  props: ({ data: { getPost } }) => ({
    post: getPost,
  }),
})(OnePost);
