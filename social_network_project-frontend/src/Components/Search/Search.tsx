import { SearchOutlined } from "@ant-design/icons";
import { Avatar, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import logo from "../../assets/logo_holder.webp";
import "./SearchStyle.css";

export default function SearchModal({ open, onClose })
{
    const [SearchValue, setSearchValue] = useState("");
    const [IsSearching, setIsSearching] = useState(false);

    const users =
    [
        { id: 1, nickname: "User Name1", login: "@user1", avatar: logo },
        { id: 2, nickname: "User Name2", login: "@user2", avatar: logo },
        { id: 3, nickname: "User Name3", login: "@user3", avatar: logo },
        { id: 4, nickname: "Qwe Zxc", login: "@qwe", avatar: logo },
    ];

    const [FilteredUsers, setFilteredUsers] = useState(users);


    useEffect(() => {

        if (SearchValue === "") {
            setFilteredUsers([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        const Timer = setTimeout(() => {

            const Query = SearchValue;

            if (Query === "") {
                setFilteredUsers([]);
                return;
            }

            const Result = users.filter(user =>
                user.login.includes(Query)
            );

            setFilteredUsers(Result);
            setIsSearching(false);

        }, 1500);

        return () => clearTimeout(Timer);

    }, [SearchValue]);

    return <>
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={400}
            wrapClassName="searchModal"
        >
            <div className="searchContainer">

                <Input
                    placeholder="Search..."
                    prefix={<SearchOutlined />}
                    value={SearchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="searchInput"
                />

                <div className="searchResults">

                    {SearchValue === "" ? (
                        <div className="emptyState">
                            Start typing to search users...
                        </div>
                    ) : IsSearching ? (
                        <div className="emptyState">
                            Searching...
                        </div>
                    ) : FilteredUsers.length > 0 ? (
                        FilteredUsers.map(user => (
                            <div key={user.id} className="userRow">

                                <div className="avatarBlock">
                                    <Avatar src={user.avatar} />
                                    <div className="nickname">{user.nickname}</div>
                                </div>

                                <div className="login">{user.login}</div>

                            </div>
                        ))
                    ) : (
                        <div className="emptyState">
                            No users found
                        </div>
                    )}

                </div>

            </div>
        </Modal>
    </>
}