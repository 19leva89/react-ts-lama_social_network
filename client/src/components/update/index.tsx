import { FC, useState, ChangeEvent, MouseEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { makeRequest } from "../../axios";
import { User } from "../../types";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type Props = {
  setOpenUpdate: (open: boolean) => void;
  user: User;
};

const Update: FC<Props> = ({ setOpenUpdate, user }) => {
  // console.log("setOpenUpdate:", setOpenUpdate)

  const [cover, setCover] = useState<File | null>(null);
  const [profile, setProfile] = useState<File | null>(null);
  const [texts, setTexts] = useState({
    email: user.email,
    password: user.password,
    name: user.name,
    city: user.city,
    website: user.website,
  });

  const upload = async (file: File) => {
    // console.log(file);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.error("Upload error:", err);
      return "";
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (user: Partial<User>) => {
      return makeRequest.put("/users", user);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    //TODO: find a better way to get image URL

    let coverUrl = cover ? await upload(cover) : user.coverPicture;
    let profileUrl = profile ? await upload(profile) : user.profilePicture;

    mutation.mutate({ ...texts, coverPicture: coverUrl, profilePicture: profileUrl });
    setOpenUpdate(false);
    setCover(null);
    setProfile(null);
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update your profile</h1>

        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover picture</span>
              <div className="imgContainer">
                <img
                  src={cover ? URL.createObjectURL(cover) : "/upload/" + user.coverPicture}
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>

            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files) {
                  setCover(e.target.files[0]);
                }
              }}
            />

            <label htmlFor="profile">
              <span>Profile picture</span>
              <div className="imgContainer">
                <img
                  src={profile ? URL.createObjectURL(profile) : "/upload/" + user.profilePicture}
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>

            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files) {
                  setProfile(e.target.files[0]);
                }
              }}
            />
          </div>

          <label>Email</label>

          <input type="text" value={texts.email} name="email" onChange={handleChange} />

          <label>Password</label>

          <input type="text" value={texts.password} name="password" onChange={handleChange} />

          <label>Name</label>

          <input type="text" value={texts.name} name="name" onChange={handleChange} />

          <label>Country / City</label>

          <input type="text" name="city" value={texts.city} onChange={handleChange} />

          <label>Website</label>

          <input type="text" name="website" value={texts.website} onChange={handleChange} />

          <button onClick={handleClick}>Update</button>
        </form>

        <button className="close" onClick={() => setOpenUpdate(false)}>
          X
        </button>
      </div>
    </div>
  );
};

export default Update;
