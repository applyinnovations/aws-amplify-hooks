import React, { useCallback } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { useSubscription } from "./useSubscription";

import { Blog } from "../models";
import { createBlog } from "../graphql/mutations";
import * as queries from "../graphql/queries";
import * as subscriptions from "../graphql/subscriptions";
interface BlogsProps {}

export const Blogs: React.FC<BlogsProps> = () => {
  const { data = [] } = useSubscription({
    model: Blog,
    queryPath: {
      sub: subscriptions,
      queries: queries,
    },
  });
  const oncreateBlog = useCallback(async () => {
    try {
      await API.graphql(
        graphqlOperation(createBlog, {
          input: {
            name: "peter",
          },
        })
      );
    } catch (e) {
      console.log("mutation error", e);
    }
  }, []);
  console.log("this is the data", data);
  return (
    <div>
      <button onClick={oncreateBlog}>Create Blog</button>
      This is blogs
      {data?.length && data?.map((item) => <div>{item.id}</div>)}
    </div>
  );
};
