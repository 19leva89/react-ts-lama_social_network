import { FC, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { AuthContext, AuthContextType } from "../../context/authContext";
import { makeRequest } from "../../axios";
import { UserStory } from "../../types";

const Stories: FC = () => {
  const { currentUser } = useContext(AuthContext) as AuthContextType;

  const { isLoading, error, data } = useQuery<UserStory[]>({
    queryKey: ["stories"],
    queryFn: () => makeRequest.get("/stories").then((res) => res.data),
  });

  //TODO Add story using react-query mutations and use upload function.

  return (
    <div className="stories">
      <div className="story">
        <img src={"/upload/" + currentUser?.profilePicture} alt="" />
        <span>{currentUser?.name}</span>
        <button>+</button>
      </div>

      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data?.map((story) => (
            <div className="story" key={story.id}>
              <img src={"/upload/" + story.img} alt="" />
              <span>{story.name}</span>
            </div>
          ))}
    </div>
  );
};

export default Stories;
