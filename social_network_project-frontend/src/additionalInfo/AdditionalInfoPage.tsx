import { useNavigate } from "react-router-dom";
import "./AdditioanlInfoStyle.css";
import { Button, Form, Input, Progress } from "antd";
import { useEffect, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { SignUp } from "../api/userApi";
import Dragger from "antd/es/upload/Dragger";

export default function AdditionalInfoPage() {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(1);
    const total = 4;
    const [selectedRace, setSelectedRace] = useState<number | null>(null);
    const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [data, setData] = useState({
        Nickname: "",
        Avatar: null as File | null,
        RaceId: null,
        Interests: [] as number[]
    });

    const races = [
        { id: 1, name: "Elf", color: "#3bff5e" },
        { id: 2, name: "Dark Elf", color: "#7a3bff" },
        { id: 3, name: "Dwarf", color: "#b87333" },
        { id: 4, name: "Human", color: "#3b82ff" },
        { id: 5, name: "Orc", color: "#4b5320" },
        { id: 6, name: "Vampire", color: "#8b0000" },
        { id: 7, name: "Werewolf", color: "#5c4033" },
        { id: 8, name: "Goblin", color: "#7fff00" },
        { id: 9, name: "Troll", color: "#556b2f" },
        { id: 10, name: "Dragonborn", color: "#ff7a3b" },
        { id: 11, name: "Angel", color: "#ffd700" },
        { id: 12, name: "Demon", color: "#ff3b3b" },
        { id: 13, name: "Undead", color: "#aaaaaa" },
        { id: 14, name: "Fairy", color: "#ff69b4" },
        { id: 15, name: "Elemental", color: "#3bfff2" }
    ];

    const interests = [
        { id: 1, name: "Sports", emoji: "⚽", color: "#3b82ff" },
        { id: 2, name: "Books", emoji: "📚", color: "#8b5cf6" },
        { id: 3, name: "Movies", emoji: "🎬", color: "#ff3b3b" },
        { id: 4, name: "Music", emoji: "🎵", color: "#ff7a3b" },
        { id: 5, name: "Gaming", emoji: "🎮", color: "#22c55e" },
        { id: 6, name: "Coding", emoji: "💻", color: "#06b6d4" },
        { id: 7, name: "Travel", emoji: "✈️", color: "#facc15" },
        { id: 8, name: "Fitness", emoji: "🏋️", color: "#ef4444" },
        { id: 9, name: "Anime", emoji: "🍥", color: "#f472b6" },
        { id: 10, name: "Technology", emoji: "🧠", color: "#0ea5e9" },
        { id: 11, name: "Art", emoji: "🎨", color: "#a855f7" },
        { id: 12, name: "Photography", emoji: "📸", color: "#14b8a6" },
        { id: 13, name: "Science", emoji: "🔬", color: "#6366f1" },
        { id: 14, name: "History", emoji: "🏺", color: "#b45309" },
        { id: 15, name: "Cooking", emoji: "🍳", color: "#f97316" },
        { id: 16, name: "Nature", emoji: "🌿", color: "#16a34a" },
        { id: 17, name: "Psychology", emoji: "🧠", color: "#7c3aed" },
        { id: 18, name: "Business", emoji: "💼", color: "#64748b" },
        { id: 19, name: "Cars", emoji: "🚗", color: "#dc2626" },
        { id: 20, name: "Space", emoji: "🚀", color: "#002f9dff" }
    ];

    const toggle = (index: number) =>
    {
        setSelectedInterests(prev =>
        {
            let updated;

            if(prev.includes(index))
            {
                updated = prev.filter(i => i !== index);
            }
            else
            {
                updated = [...prev, index];
            }


            return updated;
        });
    };

    useEffect(() =>
    {
        if(!data.Avatar)
        {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(data.Avatar);
        console.log(url);

        setPreviewUrl(url);

        return () =>
        {
            URL.revokeObjectURL(url);
        };
    }, [data.Avatar]);

    const percent = (current / total) * 100;
    const Next = async () =>
    {
        if(current <= 3)
        {
            setCurrent(prev => prev + 1);
        }
        else
        {
            try
            {
                await SignUp(data);

                navigate("/home");
            }
            catch(error)
            {
                console.log(error);
            }
        }
    };

    const Prev = () =>
    {
        if(current >= 2)
        {
            setCurrent((prev) => prev - 1);
        }
    };

    const StepText = () =>
    {
        if(current === 1)
            return "1/4. Enter your Nickname"
        else if(current === 2)
            return "2/4. Upload your profile avatar"
        else if(current === 3)
            return "3/4. Pick your race"
        else if(current === 4)
            return "4/4. Choose your interests"
    };

    const Interaction = () =>
    {
        if(current === 1)
        {
            return <>
                    <Input
                        className="input"
                        placeholder="Nickname"
                        size="large"
                        onChange={(e) =>
                            setData(prev => ({
                                ...prev,
                                Nickname: e.target.value
                            }))
                        }
                    />
                    </>
        }
        else if(current === 2)
        {
            return (
                !data.Avatar
                ? (
                    <Dragger
                        className="uploadDragger"
                        beforeUpload={() => false}
                        onChange={(info) =>
                        {
                            // console.log(info.file);
                            // console.log(info.file.originFileObj);

                            setData(prev => ({
                                ...prev,
                                Avatar: info.file.originFileObj as File
                            }));
                        }}
                        showUploadList={false}
                    >
                        <p className="uploadIcon">
                            <InboxOutlined />
                        </p>

                        <p className="uploadText">
                            Click or drag image here
                        </p>

                        <p className="uploadHint">
                            PNG, JPG, GIF
                        </p>
                    </Dragger>
                )
                : (
                    <div className="avatarPreviewContainer">

                        <button
                            className="removeAvatarBtn"
                            onClick={() =>
                            {
                                setData(prev => ({
                                    ...prev,
                                    Avatar: null
                                }));
                            }}
                        >
                            ✕
                        </button>

                        <img
                            src={previewUrl!}
                            alt="avatar"
                            className="avatarPreview"
                        />
                    </div>
                )
            );
        }
        else if(current === 3)
        {
            return <>
                <div className="racesContainer">
                    {races.map((race, index) => (
                        <Button
                            key={race.name}
                            className={`raceBtn ${selectedRace === index ? "active" : ""}`}
                            style={{ "--race-color": race.color } as React.CSSProperties}
                            onClick={() =>
                            {
                                setSelectedRace(index);

                                setData(prev => ({
                                    ...prev,
                                    RaceId: races[index].id
                                }));
                            }}
                        >
                            {race.name}
                        </Button>
                    ))}
                </div>
            </>
        }
        else if(current === 4)
        {
            return <>
                <div className="interestsContainer">
                    {interests.map((item, index) => (
                        <Button
                            key={item.name}
                            className={`interestBtn ${selectedInterests.includes(index) ? "active" : ""}`}
                            style={{ "--interest-color": item.color } as React.CSSProperties}
                            onClick={() => 
                            {
                                toggle(index)

                                setData(prev => {
                                    const id = interests[index].id;

                                    const isSelected = prev.Interests.includes(id);

                                    return {
                                        ...prev,
                                        Interests: isSelected
                                            ? prev.Interests.filter((i: number) => i !== id)
                                            : [...prev.Interests, id]
                                    };
                                });
                            }}
                        >
                            {item.emoji} {item.name}
                        </Button>
                    ))}
                </div>
            </>
        }
    };


    return <>
        <div className="wrapper">

            <div className="container">
                <div>
                    <h2 className="title">{StepText()}</h2>
                    <Progress 
                        className="progressBar"
                        percent={percent}
                        showInfo={false}
                        strokeColor="var(--primary-color)"
                    />
                </div>
                
                <Form>
                    <Form.Item className="ant-form-item" name="nickname" rules={[{ required: true, message: "Enter nickname" }]}>
                        {Interaction()}
                    </Form.Item>

                    <Form.Item>
                        
                        <div className="buttonsBox">
                            <Button
                                className="buttonBack"
                                type="primary"
                                block
                                size="large"
                                onClick={Prev}
                                style={{ visibility: current > 1 ? "visible" : "hidden" }}
                            >   
                                &larr;Back
                            </Button>

                            <Button
                                className="button"
                                type="primary"
                                block
                                size="large"
                                onClick={Next}
                            >   
                                { current === 4 ? "Finish" : "Continue"}
                            </Button>
                        
                        </div>
                            
                    </Form.Item>
                </Form>

            </div>
        </div>
    </>
}