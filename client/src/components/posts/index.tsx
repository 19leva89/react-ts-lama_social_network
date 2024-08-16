import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { UserPost } from "../../types";

import Post from "../post";

type Props = {
  userId: number | undefined;
};

const Posts: FC<Props> = ({ userId }) => {
  const { isLoading, error, data } = useQuery<UserPost[]>({
    queryKey: ["posts", userId],
    queryFn: () =>
      makeRequest.get("/posts?userId=" + userId).then((res) => {
        return res.data;
      }),
  });

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data?.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
