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

    localStorage.setItem(
        "user",
        JSON.stringify(dataResponse.data)
    );

    return dataResponse;
}

// /api/user/signin

export async function SignIn(data: any)
{
    const response = await fetch(
        `${API_URL}/api/user/signin`,
        {
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

    localStorage.setItem(
        "user",
        JSON.stringify(dataResponse.data)
    );

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

    console.log("BODY:", dataResponse);

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
        `${API_URL}/api/user/profile/${data}`,
        {
            method: "GET",
        }
    );

    const dataResponse = await response.json();
    
    console.log("BODY:", dataResponse);


    if (!response.ok)
    {
        throw new Error(dataResponse?.message || "Failed to fetch profile");
    }

    return dataResponse;
}