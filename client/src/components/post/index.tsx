import { FC, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import moment from "moment";
import { makeRequest } from "../../axios";
import { AuthContext, AuthContextType } from "../../context/authContext";

import Comments from "../comments";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { UserLike, UserPost } from "../../types";

type Props = {
  post: UserPost;
};

const Post: FC<Props> = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { currentUser } = useContext(AuthContext) as AuthContextType;

  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () => makeRequest.get("/likes?postId=" + post.id).then((res) => res.data),
  });
  // console.log("client post data:", data)

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (liked: Partial<UserLike>) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => {
      return makeRequest.delete("/posts/" + postId);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser?.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="post__user">
          <div className="post__user--info">
            <Link
              to={`/profile/${post.userId}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img src={"/upload/" + post.profilePicture} alt="" />
            </Link>

            <div className="post__user--details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="post__user--name">{post.name}</span>
              </Link>
              <span className="post__user--date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>

          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser?.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>

        <div className="post__content">
          <p>{post.description}</p>
          <img src={"/upload/" + post.img} alt="" />
        </div>

        <div className="post__info">
          <div className="post__info--item">
            {isLoading ? (
              "loading"
            ) : data.includes(currentUser?.id) ? (
              <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>

          <div className="post__info--item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>

          <div className="post__info--item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
