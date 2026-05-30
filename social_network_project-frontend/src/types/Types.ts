export type User = {
    id:string;
    nickname:string;
    login:string;
    bio:string;
    race:Race;
    imageUrl:string;
    posts:string;
    followers:string;
    following:string;
    interests:TagType[];
    lastLoginAt?:string;
    deletedAt?:string;
    registeredAt:string;
};

export type Comment = {
    id: number;
    text: string;
};

export type TagType = {
    id: string;
    name: string;
    color: string;
};

export type PostProps = {
    id: number;
    userId: string;
    text: string;
    image?: string | null;
    description?: string;
    tags: TagType[];
    onClick?: () => void;
};

export type PostPropsModal = {
    open: boolean;
    onClose: () => void;
    text: string;
    image?: string | null;
    description?: string;
    tags: TagType[];
};

export type Race = {
    id: string;
    name:string;
    themeColorHex:string;
};