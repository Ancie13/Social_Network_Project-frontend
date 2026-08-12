import * as signalR from "@microsoft/signalr";


const API_URL = "socialmedia-bbf3gnguh9hbdyh9.canadacentral-01.azurewebsites.net";

export const connection = new signalR.HubConnectionBuilder()
    .withUrl(`https://${API_URL}/hubs/chat`, {
        withCredentials: true,
    })
    .withAutomaticReconnect()
    .build();