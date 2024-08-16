import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { makeRequest } from "../../axios";
import { UserRelationship } from "../../types";
import { AuthContext, AuthContextType } from "../../context/authContext";

import Posts from "../../components/posts";
import Update from "../../components/update";

import XIcon from "@mui/icons-material/X";
import PlaceIcon from "@mui/icons-material/Place";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext) as AuthContextType;

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => makeRequest.get("/users/find/" + userId).then((res) => res.data),
  });

  const { isLoading: rIsLoading, data: relationshipData } = useQuery({
    queryKey: ["relationship", userId],
    queryFn: () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => res.data),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (following: Partial<UserRelationship>) => {
      if (following) {
        return makeRequest.delete("/relationships?userId=" + userId);
      }
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["relationship"] });
    },
  });

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser?.id));
  };

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={"/upload/" + data.coverPicture} alt="" className="cover" />
            <img src={"/upload/" + data.profilePicture} alt="" className="profilePicture" />
          </div>

          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="https://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>

                <a href="https://instagram.com">
                  <InstagramIcon fontSize="large" />
                </a>

                <a href="https://x.com">
                  <XIcon fontSize="large" />
                </a>

                <a href="https://www.linkedin.com">
                  <LinkedInIcon fontSize="large" />
                </a>

                <a href="https://www.pinterest.com">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>

              <div className="center">
                <span>{data.name}</span>

                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>

                  <div className="item">
                    <LanguageIcon />
                    <span>{data.website}</span>
                  </div>
                </div>
                {rIsLoading ? (
                  "loading"
                ) : userId === currentUser?.id ? (
                  <button onClick={() => setOpenUpdate(true)}>Update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser?.id) ? "Following" : "Follow"}
                  </button>
                )}
              </div>

              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>

            <Posts userId={userId} />
          </div>
        </>
      )}

      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
