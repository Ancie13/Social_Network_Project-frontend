import { useNavigate } from "react-router-dom";
import "./AdditioanlInfoStyle.css";
import { Button, Form, Input, Progress } from "antd";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";

export default function AdditionalInfoPage() {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(1);
    const total = 4;
    const [selectedRace, setSelectedRace] = useState<number | null>(null);
    const [selectedInterests, setSelectedInterests] = useState<number[]>([]);

    const races = [
        { name: "Elf", color: "#3bff5e" },
        { name: "Dark Elf", color: "#7a3bff" },
        { name: "Dwarf", color: "#b87333" },
        { name: "Human", color: "#3b82ff" },
        { name: "Orc", color: "#4b5320" },
        { name: "Vampire", color: "#8b0000" },
        { name: "Werewolf", color: "#5c4033" },
        { name: "Goblin", color: "#7fff00" },
        { name: "Troll", color: "#556b2f" },
        { name: "Dragonborn", color: "#ff7a3b" },
        { name: "Angel", color: "#ffd700" },
        { name: "Demon", color: "#ff3b3b" },
        { name: "Undead", color: "#aaaaaa" },
        { name: "Fairy", color: "#ff69b4" },
        { name: "Elemental", color: "#3bfff2" }
    ];

    const interests = [
        { name: "Sports", emoji: "⚽", color: "#3b82ff" },
        { name: "Books", emoji: "📚", color: "#8b5cf6" },
        { name: "Movies", emoji: "🎬", color: "#ff3b3b" },
        { name: "Music", emoji: "🎵", color: "#ff7a3b" },
        { name: "Gaming", emoji: "🎮", color: "#22c55e" },
        { name: "Coding", emoji: "💻", color: "#06b6d4" },
        { name: "Travel", emoji: "✈️", color: "#facc15" },
        { name: "Fitness", emoji: "🏋️", color: "#ef4444" },
        { name: "Anime", emoji: "🍥", color: "#f472b6" },
        { name: "Technology", emoji: "🧠", color: "#0ea5e9" },
        { name: "Art", emoji: "🎨", color: "#a855f7" },
        { name: "Photography", emoji: "📸", color: "#14b8a6" },
        { name: "Science", emoji: "🔬", color: "#6366f1" },
        { name: "History", emoji: "🏺", color: "#b45309" },
        { name: "Cooking", emoji: "🍳", color: "#f97316" },
        { name: "Nature", emoji: "🌿", color: "#16a34a" },
        { name: "Psychology", emoji: "🧠", color: "#7c3aed" },
        { name: "Business", emoji: "💼", color: "#64748b" },
        { name: "Cars", emoji: "🚗", color: "#dc2626" },
        { name: "Space", emoji: "🚀", color: "#002f9dff" }
    ];

    const toggle = (index: number) =>
    {
        setSelectedInterests(prev =>
        {
            if (prev.includes(index))
                return prev.filter(i => i !== index);

            return [...prev, index];
        });
    };



    const percent = (current / total) * 100;
    const Next = () =>
    {
        if(current <= 3)
        {
            setCurrent((prev) => prev + 1);
        }
        else
        {
            navigate("/home");
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
            return <><Input className="input" placeholder="Nickname" size="large" /></>
        }
        else if(current === 2)
        {
            return <>
                <Button
                    className="uploadBtn"
                    type="primary"
                    block
                    size="large"
                    onClick={Next}
                >
                    Upload <UploadOutlined />
                </Button>
            </>
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
                            onClick={() => setSelectedRace(index)}
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
                            onClick={() => toggle(index)}
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