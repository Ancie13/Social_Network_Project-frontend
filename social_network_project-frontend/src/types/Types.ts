export type User = {
    id:string;
    nickname:string;
    login:string;
    email:string;
    bio:string;
    race:Race;
    imageUrl:string;
    posts:string;
    isFollowing:boolean;
    interests:TagType[];
    lastLoginAt?:string;
    deletedAt?:string;
    registeredAt:string;
};

export type Comment = {
    id: string;
    userId: string;
    postId: string;
    likesQnt: number;
    isLiked: boolean;
    createdAt: string;
    bio: string;
};

export type TagType = {
    id: string;
    name: string;
    color: string;
};

export type PostProps = {
    id: string;
    userId: string;
    text: string;
    imageUrl?: string | null;
    description?: string;
    tags: interes[];
    onClick?: () => void;
    comments: Comment[] | [];
    myId: string;
};

export type PostPropsModal = {
    open: boolean;
    onClose: () => void;
    id: string;
    text: string;
    imageUrl?: string | null;
    description?: string;
    tags: interes[];
    user?: User;
    comments: Comment[] | [];
};

export type Race = {
    id: string;
    name:string;
    themeColorHex:string;
};

export type interes = {
  id: string;
  name: string;
  emoji: string;
  color: string;
};