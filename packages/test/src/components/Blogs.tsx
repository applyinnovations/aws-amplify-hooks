import React, { useCallback } from "react";
import { API, graphqlOperation } from "aws-amplify";

import { useSubscription } from "./useSubscription";

import { Blog } from "../models";
import {
  createBlog,
  createPost,
  deleteBlog,
  updateBlog,
  updatePost,
} from "../graphql/mutations";

interface BlogsProps {}

export const Blogs: React.FC<BlogsProps> = () => {
  const { data = [] } = useSubscription({
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
  console.log("this is the data", data);
  const onUpdateItem = useCallback(async (item) => {
    await API.graphql({
      query: updateBlog,
      variables: {
        input: {
          name: `${item?.name}_1`,
          id: item?.id,
        },
      },
    });
  }, []);

  const onAddPost = useCallback(async (item) => {
    await API.graphql({
      query: createPost,
      variables: {
        input: {
          title: `new Post`,
          blogPostsId: item?.id,
        },
      },
    });
  }, []);

  const onDelete = useCallback(async (item) => {
    await API.graphql({
      query: deleteBlog,
      variables: {
        input: {
          id: item?.id,
        },
      },
    });
  }, []);
  return (
    <div>
      <button onClick={oncreateBlog}>Create Blog</button>

      {data?.length &&
        data?.map((item) => (
          <div style={{ marginBottom: 20 }}>
            {Object.keys(item)?.map((key: string) => {
              return (
                <div>
                  {key}: {JSON.stringify(item?.[key])}
                </div>
              );
            })}
            <button onClick={() => onUpdateItem(item)}>Update Blog</button>
            <button onClick={() => onAddPost(item)}>Create Post</button>
            <button onClick={() => onDelete(item)}>Delete Post</button>
          </div>
        ))}
    </div>
  );
};
