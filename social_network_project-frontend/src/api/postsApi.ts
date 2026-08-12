const API_URL = "https://socialmedia-bbf3gnguh9hbdyh9.canadacentral-01.azurewebsites.net";
// /api/home/posts

let postsCache: any[] | null = null;

export async function GetPostsHome(page = 1, pageSize = 5)
{
    if (postsCache)
    {
        return { data: postsCache };
    }

    const response = await fetch(
        `${API_URL}/api/home/posts/${page}/?pageSize=${pageSize}`,
        {
            method: "GET",
        }
    );

    const dataResponse = await response.json();
    
    // console.log("BODY:", dataResponse);

    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch posts");
    }

    return dataResponse;
}

// /api/post/getOwn/{userId}

export async function GetOwn(data: any)
{
    const response = await fetch(
        `${API_URL}/api/post/getOwn/${data}`,
        {
            method: "GET",
        }
    );

    const dataResponse = await response.json();


    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch own");
    }

    return dataResponse;
}

// /api/home/posts/private/{page?}/?pageSize={pageSize}

let postsCacheRace: any[] | null = null;

export async function GetPostsRace(page = 1, pageSize = 5)
{
    if (postsCacheRace)
    {
        return { data: postsCacheRace };
    }

    const response = await fetch(
        `${API_URL}/api/home/posts/private/${page}/?pageSize=${pageSize}`,
        {
            credentials: "include",
            method: "GET",
        }
    );

    const dataResponse = await response.json();


    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch posts");
    }

    return dataResponse;
}

// /api/home/post/add

export async function AddPostApi(data: any)
{
    const formData = new FormData();

    formData.append("UserId", data.UserId);
    formData.append("Title", data.Title);
    formData.append("Bio", data.Bio);

    if (data.PostImage) {
        formData.append("PostImage", data.PostImage);
    }

    data.Interests.forEach((x: string, index: number) =>
    {
        formData.append(`Interests[${index}]`, x);
    });

    const response = await fetch(
        `${API_URL}/api/post/add`,
        {
            method: "POST",
            body: formData,
            credentials: "include",
        }
    );

    const dataResponse = await response.json();
    
    console.log("STATUS:", response.status);
    console.log("BODY:", dataResponse);

    if(!response.ok)
    {
        throw new Error("Post failed");
    }

    return dataResponse;
}

// /api/post/{postId}/likes

export async function GetPostLikes(data: any)
{
    const response = await fetch(
        `${API_URL}/api/post/${data}/likes`,
        {
            credentials: "include",
            method: "GET",
        }
    );

    const dataResponse = await response.json();

    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch likes");
    }

    return dataResponse.data;
}

// /api/post/toggleLike/{postId}
export async function LikePost(data: any)
{
    const response = await fetch(
        `${API_URL}/api/post/toggleLike/${data}`,
        {
            credentials: "include",
            method: "POST",
        }
    );

    const dataResponse = await response.json();

    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch like");
    }

    return dataResponse.data;
}

// /api/post/{postId}/saves
export async function GetPostSaves(data: any)
{
    const response = await fetch(
        `${API_URL}/api/post/${data}/saves`,
        {
            credentials: "include",
            method: "GET",
        }
    );

    const dataResponse = await response.json();

    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch saves");
    }

    return dataResponse.data;
}

// /api/post/toggleSave/{postId}
export async function SavePost(data: any)
{
    const response = await fetch(
        `${API_URL}/api/post/toggleSave/${data}`,
        {
            credentials: "include",
            method: "POST",
        }
    );

    const dataResponse = await response.json();

    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch save");
    }

    return dataResponse.data;
}

// /api/comment/add
export async function AddComment(PostId: string, Bio: string)
{
    const formData = new FormData();

    formData.append("PostId", PostId);
    formData.append("Bio", Bio);
    console.log(formData);
    
    const response = await fetch(
        `${API_URL}/api/comment/add`,
        {
            credentials: "include",
            method: "POST",
            body: formData,
        }
    );

    const dataResponse = await response.json();

    console.log("send comm BODY:", dataResponse);


    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch comment add");
    }

    return dataResponse.data;
}


// /api/user/likedPosts/{page?}/?pageSize={pageSize}
export async function GetLikedPosts(page = 1, pageSize = 5)
{

    const response = await fetch(
        `${API_URL}/api/user/likedPosts/${page}/?pageSize=${pageSize}`,
        {
            credentials: "include",
            method: "GET",
        }
    );

    const dataResponse = await response.json();
    
    // console.log("BODY:", dataResponse);

    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch liked posts");
    }

    return dataResponse;
}


// /api/user/savedPosts/{page?}/?pageSize={pageSize}
export async function GetSavedPosts(page = 1, pageSize = 5)
{

    const response = await fetch(
        `${API_URL}/api/user/savedPosts/${page}/?pageSize=${pageSize}`,
        {
            credentials: "include",
            method: "GET",
        }
    );

    const dataResponse = await response.json();
    
    // console.log("BODY:", dataResponse);

    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch saved posts");
    }

    return dataResponse;
}


// /api/post/getUserPosts/{userId}/{page?}/?pageSize={pageSize}
export async function GetUserPosts(id: string, page = 1, pageSize = 5)
{
    const response = await fetch(
        `${API_URL}/api/post/getUserPosts/${id}/${page}/?pageSize=${pageSize}`,
        {
            credentials: "include",
            method: "GET",
        }
    );

    const dataResponse = await response.json();
    
    console.log("GetUserPosts:", dataResponse);

    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch user posts");
    }

    return dataResponse;
}

// /api/post/edit
// body (formData): {
//   string PostId
//   string? Title
//   IFormFile? PostImage
//   string? Bio
//   string[]? Interests 
//   bool? IsPrivate
// }
export async function EditPostApi({PostId, Title, PostImage, Bio, Interests, IsPrivate } : 
    {
        PostId: string;
        Title?: string;
        PostImage?: File | null;
        Bio?: string;
        Interests?: string[];
        IsPrivate?: boolean;
    }
)
{
    const formData = new FormData();

    formData.append("PostId", PostId);
    if(Title) {
        formData.append("Title", Title);
    }
    if (PostImage !== undefined) {
        if (PostImage === null) {
            formData.append("PostImage", "");
        } else {
            formData.append("PostImage", PostImage);
        }
    }
    if(Bio) {
        formData.append("Bio", Bio);
    }
    if(Interests) {
        Interests.forEach((x: string, index: number) =>
        {
            formData.append(`Interests[${index}]`, x);
        });
    }
    if(IsPrivate) {
        formData.append("IsPrivate", IsPrivate.toString());
    }


    const response = await fetch(
        `${API_URL}/api/post/edit`,
        {
            method: "PUT",
            body: formData,
            credentials: "include",
        }
    );

    const dataResponse = await response.json();
    
    console.log("BODY EDIT POST:", dataResponse);

    if(!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to edit post");
    }

    return dataResponse;
}

// /api/post/{postId}/delete
export async function DeletePost(id: string)
{
    const response = await fetch(
        `${API_URL}/api/post/${id}/delete`,
        {
            credentials: "include",
            method: "DELETE",
        }
    );

    const dataResponse = await response.json();
    
    console.log("DELETE POST:", dataResponse);

    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to delete post");
    }

    return dataResponse;
}