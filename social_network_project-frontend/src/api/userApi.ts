const API_URL = "https://socialmedia-bbf3gnguh9hbdyh9.canadacentral-01.azurewebsites.net";

export async function SignUp(data: any)
{
    const formData = new FormData();
    
    console.log(data)
    formData.append("Login", data.Login);
    formData.append("Email", data.Email);
    formData.append("Base64Password", data.Base64Password);

    formData.append("Nickname", data.Nickname);
    formData.append("RaceId", data.RaceId.toString());

    if(data.Avatar)
    {
        formData.append("Avatar", data.Avatar);
    }

    data.Interests.forEach((x: string, index: number) =>
    {
        formData.append(`Interests[${index}]`, x);
    });

    const response = await fetch(
        `${API_URL}/api/user/signup`,
        {
            credentials: "include",
            method: "POST",
            body: formData
        }
    );

    const dataResponse = await response.json();
    
    console.log("STATUS:", response.status);
    console.log("BODY:", dataResponse);

    if(!response.ok)
    {
        throw new Error("Registration failed");
    }


    if (dataResponse?.status?.isOk && dataResponse?.data)
    {
        // sessionStorage.setItem(
        //     "user",
        //     JSON.stringify(dataResponse.data)
        // );
    }
    else
    {
        console.log("Already signed in or login failed");
    }

    return dataResponse;
}

// /api/user/signin

export async function SignIn(data: any)
{
    const response = await fetch(
        `${API_URL}/api/user/signin`,
        {
            credentials: "include",
            method: "POST",
            headers: {
                Authorization: data
            }
        }
    );

    const dataResponse = await response.json();

    console.log("STATUS:", response.status);
    console.log("BODY:", dataResponse);

    if(!response.ok)
    {
        throw new Error("Logining failed");
    }

    // localStorage.setItem(
    //     "user",
    //     JSON.stringify(dataResponse.data)
    // );

    return dataResponse;
}


// /api/user/users/find

export async function GetSearch(value: string)
{
    const response = await fetch(
        `${API_URL}/api/user/users/find/${value}`,
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

// /api/reference/additionalSignUpInfo

export async function GetAdditionalInfo()
{
    const response = await fetch(
        `${API_URL}/api/reference/additionalSignUpInfo`,
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

    localStorage.setItem(
        "addInfo",
        JSON.stringify(dataResponse)
    );

    return dataResponse;
}

// /api/user/profile/{userId}

export async function GetUserProfile(data: any)
{
    const response = await fetch(
        `${API_URL}/api/user/profileById/${data}`,
        {
            credentials: "include",
            method: "GET",
        }
    );

    const dataResponse = await response.json();
    
    // console.log("BODY:", dataResponse);


    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch profile");
    }

    return dataResponse.data;
}

export async function GetUserProfileByLogin(data: any)
{
    const response = await fetch(
        `${API_URL}/api/user/profileByLogin/${data}`,
        {
            credentials: "include",
            method: "GET",
        }
    );

    const dataResponse = await response.json();
    
    // console.log("BODY:", dataResponse);


    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch profile");
    }

    return dataResponse.data;
}

// /api/user/{userId}/followers

export async function GetUserFollowers(data: any)
{
    const response = await fetch(
        `${API_URL}/api/user/${data}/followers`,
        {
            credentials: "include",
            method: "GET",
        }
    );

    const dataResponse = await response.json();
    
    // console.log("get followers BODY:", dataResponse);


    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch profile");
    }

    return dataResponse.data;
}

// /api/user/{userId}/following

export async function GetUserFollowing(data: any)
{
    const response = await fetch(
        `${API_URL}/api/user/${data}/following`,
        {
            credentials: "include",
            method: "GET",
        }
    );

    const dataResponse = await response.json();
    
    // console.log("get following BODY:", dataResponse);


    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch profile");
    }

    return dataResponse.data;
}

// /api/user/toggleFollow/{userId}
export async function FollowUser(data: any)
{
    const response = await fetch(
        `${API_URL}/api/user/toggleFollow/${data}`,
        {
            credentials: "include",
            method: "POST",
        }
    );

    const dataResponse = await response.json();
    
    console.log("follow BODY:", dataResponse);


    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch profile");
    }

    return dataResponse.data;
}

// /api/user/getCurrentUser
export async function GetMe()
{
    const response = await fetch(
        `${API_URL}/api/user/getCurrentUser`,
        {
            credentials: "include",
            method: "GET",
        }
    );

    const dataResponse = await response.json();

    console.log("me BODY:", dataResponse);


    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch user");
    }

    return dataResponse.data;
}

// /api/user/signout
export async function Signout()
{
    const response = await fetch(
        `${API_URL}/api/user/signout`,
        {
            credentials: "include",
            method: "POST",
        }
    );

    const dataResponse = await response.json();

    // console.log("signout BODY:", dataResponse);

    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to signout");
    }

    return dataResponse;
}

// /api/user/deleteProfile
export async function DeleteAccount(data: any)
{
    const formData = new FormData();

    formData.append("Base64Password", data); 
    const response = await fetch(
        `${API_URL}/api/user/deleteProfile`,
        {
            credentials: "include",
            method: "DELETE",
            body: formData
        }
    );

    const dataResponse = await response.json();

    console.log("delete BODY:", dataResponse);

    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to delete account");
    }

    return dataResponse;
}

// /api/user/profile/edit
export async function EditProfile({
    Login,
    Nickname,
    Bio,
    Email,
    Avatar,
    OldBase64Password,
    Base64Password,
    Interests,
}: {
    Login?: string;
    Nickname?: string;
    Bio?: string;
    Email?: string;
    Avatar?: File | null;
    OldBase64Password?: string;
    Base64Password?: string;
    Interests?: string[];
}) {
    const formData = new FormData();
    
    if(Login) {
        formData.append("Login", Login); 
    }
    if(Nickname) {
        formData.append("Nickname", Nickname); 
    }
    if(Bio) {
        formData.append("Bio", Bio); 
    }
    if(Email) {
        formData.append("Email", Email); 
    }
    if (Avatar !== undefined) {
        if (Avatar === null) {
            formData.append("Avatar", "");
        } else {
            formData.append("Avatar", Avatar);
        }
    }
    if(OldBase64Password) {
        formData.append("OldBase64Password", OldBase64Password); 
    }
    if(Base64Password) {
        formData.append("Base64Password", Base64Password); 
    }
    if (Interests) {
        Interests.forEach((interest) => {
            formData.append("Interests", interest);
        });
    }

    const response = await fetch(
        `${API_URL}/api/user/profile/edit`,
        {
            credentials: "include",
            method: "PUT",
            body: formData
        }
    );

    const dataResponse = await response.json();
    
    console.log("STATUS:", response.status);
    console.log("BODY:", dataResponse);

    if(!response.ok)
    {
        throw new Error("Registration failed");
    }

    return dataResponse;
}


// signalR_________________________________________________________________________________________

// /api/chat/{targetUserId}/messages/{page?}/?pageSize={pageSize}
export async function GetMessages(
    targetUserId: string,
    page = 1,
    pageSize = 20
) {
    const response = await fetch(
        `${API_URL}/api/chat/${targetUserId}/messages?page=${page}&pageSize=${pageSize}`,
        {
            credentials: "include",
            method: "GET"
        }
    );

    const dataResponse = await response.json();

    console.log("GetMessages BODY:", dataResponse);

    if (!response.ok) {
        throw new Error(
            dataResponse?.message || "Failed to get messages"
        );
    }

    return dataResponse;
}

// /api/chat/send
// body: {
//   string TargetUserId
//   string Text
// }
export async function SendMessage(targetUserId: string, text: string)
{
    const formData = new FormData();

    formData.append("TargetUserId", targetUserId);
    formData.append("Text", text);

    const response = await fetch(
        `${API_URL}/api/chat/send`,
        {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: formData
        }
    );

    const dataResponse = await response.json();

    console.log("SendMessage  BODY:", dataResponse);

    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to send messages");
    }

    return dataResponse;
}

// /api/chat/list
export async function GetChats() {
    const response = await fetch(
        `${API_URL}/api/chat/list`,
        {
            credentials: "include",
            method: "GET"
        }
    );

    const dataResponse = await response.json();

    console.log("Get chats BODY:", dataResponse);

    if (!response.ok) {
        throw new Error(
            dataResponse?.message || "Failed to get chats"
        );
    }

    return dataResponse.data;
}