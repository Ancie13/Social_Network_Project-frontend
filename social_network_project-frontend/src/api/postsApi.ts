const API_URL = "https://socialmedia-bbf3gnguh9hbdyh9.canadacentral-01.azurewebsites.net";
// /api/home/posts

let postsCache: any[] | null = null;

export async function GetPostsHome()
{
    if (postsCache)
    {
        return { data: postsCache };
    }

    const response = await fetch(
        `${API_URL}/api/home/posts`,
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
    
    console.log("BODY:", dataResponse);


    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch own");
    }

    return dataResponse;
}

// /api/home/posts/private/{page?}/?pageSize={pageSize}

let postsCacheRace: any[] | null = null;

export async function GetPostsRace()
{
    if (postsCacheRace)
    {
        return { data: postsCacheRace };
    }

    const response = await fetch(
        `${API_URL}/api/home/posts/private`,
        {
            method: "GET",
        }
    );

    const dataResponse = await response.json();
    
    console.log("BODY:", dataResponse);


    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch posts");
    }

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
            body: formData
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