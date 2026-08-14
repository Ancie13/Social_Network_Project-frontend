import { useEffect, useState } from "react";
import { Avatar, Button, Input, Badge } from "antd";

import {
  SearchOutlined,
  SendOutlined,
  SmileOutlined,
  MoreOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import avatarHolder from "../../assets/avatar_holder.jpg";
import "./MessagesStyle.css";
import { useAuth } from "../../api/AuthContext";
import { connection } from "../../api/signalR";
import {
  DeleteChat,
  GetChats,
  GetMessages,
  GetUserProfile,
} from "../../api/userApi";
import { useLocation, useNavigate } from "react-router-dom";
import type { Chat } from "../../types/Types";
import { formatChatDate } from "../../shared/Date/FormatDate";
import EmojiPicker from "emoji-picker-react";
import { AlertModal } from "../../Components/Alert/Alert";

type Message = {
  id: number;
  senderId: string;
  text: string;
  createdAt: string;
};

export default function MessagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [searchText, setSearchText] = useState("");
  const { me } = useAuth();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [showChatOptionsOpen, setShowChatOptionsOpen] = useState(false);

  const [deleteChatOpen, setDeleteChatOpen] = useState(false);
  const [deleteChatSuccessfullyOpen, setDeleteChatSuccessfullyOpen] =
    useState(false);
  const [deleteChatErrorOpen, setDeleteChatErrorOpen] = useState(false);

  const handleDeleteChat = async () => {
    setShowChatOptionsOpen(false);
    if (selectedChat.id) {
      let res = await DeleteChat(selectedChat.id);
      if (res.status.isOk === true) {
        setDeleteChatSuccessfullyOpen(true);
      } else {
        setDeleteChatErrorOpen(true);
      }
    }
  };

  useEffect(() => {
    const chat = location.state?.chat;

    if (!chat) return;

    setChats((prev) => {
      const exists = prev.some((c) => c.user.id === chat.user.id);

      if (exists) {
        return prev;
      }

      return [...prev, chat];
    });

    setSelectedChat((current) => {
      if (current?.user.id === chat.user.id) {
        return current;
      }

      return chat;
    });

    window.history.replaceState({}, document.title);
  }, [location.state, chats]);

  const sortChats = (chats: Chat[]) => {
    return [...chats].sort(
      (a, b) =>
        new Date(b.lastMessageDate).getTime() -
        new Date(a.lastMessageDate).getTime(),
    );
  };

  useEffect(() => {
    if (!me) return;

    const loadChats = async () => {
      try {
        const data = await GetChats();

        const loadedChats: Chat[] = await Promise.all(
          data.map(async (chat: any) => {
            const user = await GetUserProfile(chat.otherUserId);

            return {
              id: chat.chatId,
              user: user,
              lastMessage: chat.lastMessageText ?? "",
              lastMessageDate: chat.lastMessageAt ?? "",
              unread: 0,
            };
          }),
        );

        const sortedChats = sortChats(loadedChats);

        setChats((prev) => {
          const backendChatIds = new Set(sortedChats.map((chat) => chat.id));

          const localChats = prev.filter(
            (chat) => !backendChatIds.has(chat.id),
          );

          return sortChats([...localChats, ...sortedChats]);
        });
      } catch (error) {
        console.error("Failed to load chats:", error);
      }
    };

    loadChats();
  }, [me]);

  useEffect(() => {
    const receiveMessage = (message: Message) => {
      console.log("Received:", message);

      const senderId = message.senderId;

      const isCurrentChat = selectedChat?.user.id === senderId;

      if (isCurrentChat) {
        setMessages((prev) => [...prev, message]);
      }

      setChats((prev) => {
        const chatExists = prev.some((chat) => chat.user.id === senderId);

        if (!chatExists) {
          console.log("Received message from user who is not in chats");

          return prev;
        }

        const updatedChats = prev.map((chat) => {
          if (chat.user.id !== senderId) {
            return chat;
          }

          return {
            ...chat,

            lastMessage: message.text,

            lastMessageDate: message.createdAt,

            unread: isCurrentChat ? 0 : chat.unread + 1,
          };
        });

        return sortChats(updatedChats);
      });
    };

    const messageSent = (message: Message) => {
      console.log("Message sent:", message);

      if (selectedChat && message.senderId === me?.id) {
        setMessages((prev) => [...prev, message]);
      }

      setChats((prev) => {
        const updatedChats = prev.map((chat) => {
          if (chat.user.id !== selectedChat?.user.id) {
            return chat;
          }

          return {
            ...chat,

            lastMessage: message.text,

            lastMessageDate: message.createdAt,

            unread: 0,
          };
        });

        return sortChats(updatedChats);
      });
    };

    connection.on("ReceiveMessage", receiveMessage);

    connection.on("MessageSent", messageSent);

    return () => {
      connection.off("ReceiveMessage", receiveMessage);

      connection.off("MessageSent", messageSent);
    };
  }, [selectedChat, me]);

  useEffect(() => {
    if (!selectedChat) return;

    const loadMessages = async () => {
      try {
        const data = await GetMessages(selectedChat.user.id);

        const loadedMessages = (data.data ?? []).sort(
          (a: Message, b: Message) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

        setMessages(loadedMessages);
      } catch (error) {
        console.error(error);
      }
    };

    loadMessages();
  }, [selectedChat]);

  const sendMessage = async () => {
    if (!me || !selectedChat || !messageText.trim()) return;

    const text = messageText.trim();

    try {
      await connection.invoke("SendPrivateMessage", {
        targetUserId: selectedChat.user.id,
        text: text,
      });

      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.user.nickname.toLowerCase().includes(searchText.toLowerCase()) ||
      chat.user.login.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className={`chatPage ${isMobileChatOpen ? "mobileChatOpen" : ""}`}>
      <aside className="chatSidebar">
        <div className="chatSidebarHeader">
          <h2 className="chatSidebarTitle">Messages</h2>

          {/* <Button
            type="text"
            icon={<MoreOutlined />}
            className="chatHeaderButton"
          /> */}
        </div>

        <div className="chatSearch">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search conversations..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="chatSearchInput"
          />
        </div>

        <div className="chatList">
          {chats.length === 0 && (
            <div className="noChatSelected">
              No chats yet. Start a conversation and connect with someone!
            </div>
          )}
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`chatListItem ${
                selectedChat?.id === chat.id ? "chatListItemActive" : ""
              }`}
              onClick={() => {
                setSelectedChat(chat);
                setChats((prev) =>
                  prev.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c)),
                );
                setIsMobileChatOpen(true);
              }}
            >
              <div className="chatAvatarWrapper">
                <Avatar
                  size={48}
                  src={
                    chat.user.imageUrl
                      ? `${chat.user.imageUrl}?v=${Date.now()}`
                      : avatarHolder
                  }
                  className="chatUserAvatar"
                />
              </div>

              <div className="chatPreview">
                <div className="chatPreviewTop">
                  <span className="chatUserName">{chat.user.nickname}</span>

                  <span className="chatDate">
                    {chat.lastMessageDate ? formatChatDate(chat.lastMessageDate) : null}
                  </span>
                </div>

                <div className="chatPreviewBottom">
                  <span className="chatLastMessage">{chat.lastMessage}</span>

                  {chat.unread > 0 && (
                    <Badge count={chat.unread} className="chatUnread" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT SIDE */}
      <main className="chatWindow">
        {selectedChat ? (
          <>
            <header className="chatWindowHeader">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                className="mobileBackButton"
                onClick={() => {
                  setIsMobileChatOpen(false);
                  setSelectedChat(null);
                }}
              />

              <Avatar
                size={45}
                src={
                  selectedChat.user.imageUrl
                    ? `${selectedChat.user.imageUrl}?v=${Date.now()}`
                    : avatarHolder
                }
                className="chatWindowAvatar"
              />

              <div className="chatWindowUser">
                <div
                  className="chatWindowNickname"
                  onClick={() =>
                    navigate(`/profile/${selectedChat.user.login}`)
                  }
                >
                  {selectedChat.user.nickname}
                </div>

                <div
                  className="chatWindowLogin"
                  onClick={() =>
                    navigate(`/profile/${selectedChat.user.login}`)
                  }
                >
                  @{selectedChat.user.login}
                </div>
              </div>

              <div className="chatOptionsWrapper">
                <Button
                  type="text"
                  icon={<MoreOutlined />}
                  className="chatHeaderButton"
                  onClick={() => setShowChatOptionsOpen((prev) => !prev)}
                />

                {showChatOptionsOpen && (
                  <div className="chatOptionsMenu">
                    <button
                      className="chatOptionDelete"
                      onClick={() => setDeleteChatOpen(true)}
                    >
                      <DeleteOutlined className="deleteLogoChatOption" />
                      <span>Delete chat</span>
                    </button>
                  </div>
                )}
              </div>
            </header>

            <section className="chatMessages">
              <div className="chatMessagesInner">
                {messages.map((message) => {
                  const isMine = message.senderId === me?.id;

                  return (
                    <div
                      key={message.id}
                      className={`chatMessageRow ${
                        isMine ? "chatMessageRowMine" : "chatMessageRowOther"
                      }`}
                    >
                      {!isMine && (
                        <Avatar
                          size={32}
                          src={
                            selectedChat.user.imageUrl
                              ? `${selectedChat.user.imageUrl}?v=${Date.now()}`
                              : avatarHolder
                          }
                          className="chatMessageAvatar"
                        />
                      )}

                      <div
                        className={`chatMessageBubble ${
                          isMine
                            ? "chatMessageBubbleMine"
                            : "chatMessageBubbleOther"
                        }`}
                      >
                        <div className="chatMessageText">{message.text}</div>

                        <div className="chatMessageTime">
                          {formatChatDate(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <footer className="chatInputArea">
              <Button
                className="antBtmModal"
                type="text"
                icon={isPickerOpen ? <CloseOutlined /> : <SmileOutlined />}
                onClick={() => setIsPickerOpen((prev) => !prev)}
              />
              <Input
                value={messageText}
                placeholder="Write a message..."
                className="chatMessageInput"
                onChange={(e) => setMessageText(e.target.value)}
                onPressEnter={sendMessage}
              />

              <Button
                type="text"
                icon={<SendOutlined />}
                className="chatInputButton"
                onClick={sendMessage}
              />
            </footer>
          </>
        ) : (
          <div className="noChatSelected">Select a conversation</div>
        )}
      </main>

      {isPickerOpen && (
        <div className="pickerBoxChat">
          <EmojiPicker
            onEmojiClick={(emoji) => {
              setMessageText((prev) => prev + emoji.emoji);
            }}
          />
        </div>
      )}

      <AlertModal
        open={deleteChatErrorOpen}
        title="Oops..."
        message="Something went wrong. Check your connection and try again."
        buttons={["ok"]}
        onAction={() => {
          setDeleteChatErrorOpen(false);
        }}
        onClose={() => setDeleteChatErrorOpen(false)}
      />
      <AlertModal
        open={deleteChatSuccessfullyOpen}
        title="Successfully"
        message="This chat was successfully deleted."
        buttons={["ok"]}
        onAction={() => {
          setDeleteChatSuccessfullyOpen(false);
          window.location.reload();
        }}
        onClose={() => {
          setDeleteChatSuccessfullyOpen(false);
          window.location.reload();
        }}
      />
      <AlertModal
        open={deleteChatOpen}
        title="Delete Chat"
        message="Are you sure you want to delete this chat?"
        buttons={["cancel", "delete"]}
        onAction={(action) => {
          if (action === "delete") {
            handleDeleteChat();
          }

          setDeleteChatOpen(false);
        }}
        onClose={() => setDeleteChatOpen(false)}
      />
    </div>
  );
}
