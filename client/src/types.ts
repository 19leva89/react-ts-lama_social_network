export type ErrorWithMessage = {
  status: number;
  data: {
    msg: string;
  };
};

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  name: string;
  coverPicture?: string;
  profilePicture?: string;
  city?: string;
  website?: string;
}

export interface UserPost {
  id: number;
  description?: string;
  img?: string;
  userId: number;
  createdAt: string;
  profilePicture?: string;
  name?: string;
}

export interface UserComment {
  id: number;
  description: string;
  userId: number;
  postId: number;
  createdAt: string;
  profilePicture?: string;
  name?: string;
}

export interface UserLike {
  id: number;
  userId: number;
  postId: number;
}

export interface UserStory {
  id: number;
  img: string;
  name: string;
  userId: number;
}

export interface UserRelationship {
  id: number;
  followerUserId: number;
  followedUserId: number;
}
