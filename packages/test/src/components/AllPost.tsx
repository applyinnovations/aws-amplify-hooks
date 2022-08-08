import { BaseQuery } from "../DeltaSync";
import { graphql } from "graphql";

const AllPosts = ({ postsList }: { postsList: any[] }) => (
  <div>{JSON.stringify(postsList, null, 2)}</div>
);

// @ts-ignore
export default graphql(BaseQuery, {
  options: {
    fetchPolicy: "cache-only",
  },
  // @ts-ignore
  props: ({ data }) => ({
    postsList: data.listPosts || [],
  }),
})(AllPosts);
