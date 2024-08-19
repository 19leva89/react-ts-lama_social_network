import { FC, useContext, useState, MouseEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import moment from "moment";
import { makeRequest } from "../../axios";
import { AuthContext, AuthContextType } from "../../context/authContext";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { UserComment } from "../../types";

type Props = {
  postId: number;
};

const Comments: FC<Props> = ({ postId }) => {
  const { currentUser } = useContext(AuthContext) as AuthContextType;
  const [description, setDescription] = useState<string>("");
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const { isLoading, error, data } = useQuery<UserComment[]>({
    queryKey: ["comments", postId],
    queryFn: () => makeRequest.get("/comments?postId=" + postId).then((res) => res.data),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment: Partial<UserComment>) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => {
      return makeRequest.delete("/comments/" + commentId);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutation.mutate({ description, postId });
    setDescription("");
  };

  const handleDelete = (commentId: number) => {
    deleteMutation.mutate(commentId);
  };

  const handleMenuToggle = (commentId: number) => {
    setMenuOpenId((prevMenuOpenId) => (prevMenuOpenId === commentId ? null : commentId));
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser?.profilePicture} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data?.map((comment) => (
            <div className="comment" key={comment.id}>
              <img src={"/upload/" + comment.profilePicture} alt="" />
              <div className="comment__info">
                <span>{comment.name}</span>
                <p>{comment.description}</p>
              </div>
              <span className="comment__date">{moment(comment.createdAt).fromNow()}</span>

              {comment.userId === currentUser?.id && (
                <>
                  <MoreHorizIcon onClick={() => handleMenuToggle(comment.id)} />
                  {menuOpenId === comment.id && (
                    <DeleteForeverIcon
                      onClick={() => handleDelete(comment.id)}
                      style={{ cursor: "pointer", color: "#f0544f" }}
                    />
                  )}
                </>
              )}
            </div>
          ))}
    </div>
  );
};

export default Comments;
