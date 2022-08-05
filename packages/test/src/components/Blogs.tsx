import React, { useCallback } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { useSubscription } from "./useSubscription";

import { Blog } from "../models";
import { createBlog } from "../common/mutations";
interface BlogsProps {}

export const Blogs: React.FC<BlogsProps> = () => {
  const { data } = useSubscription({
    model: Blog,
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
  return (
    <div>
      <button onClick={oncreateBlog}>Create Blog</button>
      This is blogs
      {JSON.stringify(data)}
    </div>
  );
};
