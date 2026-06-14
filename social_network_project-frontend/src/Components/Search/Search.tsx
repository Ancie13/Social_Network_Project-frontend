import { SearchOutlined } from "@ant-design/icons";
import { Avatar, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import "./SearchStyle.css";
import { GetSearch } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

type User = {
    id: string,
    nickname: string,
    login: string,
    imageUrl?: string,
    themeColorHex: string
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps)
{
    const [SearchValue, setSearchValue] = useState("");
    const [IsSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    // const users =
    // [
    //     { id: 1, nickname: "User Name1", login: "@user1", avatar: logo },
    //     { id: 2, nickname: "User Name2", login: "@user2", avatar: logo },
    //     { id: 3, nickname: "User Name3", login: "@user3", avatar: logo },
    //     { id: 4, nickname: "Qwe Zxc", login: "@qwe", avatar: logo },
    // ];

    const [users, setUsers] = useState<Array<User>>([]);

    // const [FilteredUsers, setFilteredUsers] = useState(users);


    useEffect(() => {

        if (SearchValue === "") {
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        const Timer = setTimeout(() => {

            const Query = SearchValue;

            if (Query === "") {
                return;
            }
            
            GetSearch(Query)
                .then(j => setUsers(j.data));
                
            // setUsers(prev => ({
            //     ...prev,
                
            // }));
            


            // setFilteredUsers(response);
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
                    ) : users.length > 0 ? (
                        users.map(user => (
                            <div 
                                key={user.id} 
                                className="userRow" 
                                onClick={() => {
                                    navigate(`/profile/${user.login}`);
                                    onClose();
                                }
                            }>

                                <div className="avatarBlock">
                                    <Avatar src={user.imageUrl} />
                                    <div className="nickname">{user.nickname}</div>
                                </div>

                                <div className="login">@{user.login}</div>

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