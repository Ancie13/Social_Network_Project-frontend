import { useLocation, useNavigate } from "react-router-dom";
import "./AdditioanlInfoStyle.css";
import { Button, Form, Input, Progress } from "antd";
import { useEffect, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { SignUp } from "../api/userApi";
import Dragger from "antd/es/upload/Dragger";

export default function AdditionalInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState(1);
  const total = 4;
  const [selectedRace, setSelectedRace] = useState<number | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [data, setData] = useState({
    Nickname: "",
    Avatar: null as File | null,
    RaceId: null,
    Interests: [] as string[],
  });

  const interests = [
    {
      Id: "11111111-1111-1111-1111-111111111111",
      Name: "Sports",
      Emoji: "⚽",
      Color: "#3b82ff",
    },
    {
      Id: "12121212-1212-1212-1212-121212121212",
      Name: "Nature",
      Emoji: "🌿",
      Color: "#16a34a",
    },
    {
      Id: "13131313-1313-1313-1313-131313131313",
      Name: "Psychology",
      Emoji: "🧠",
      Color: "#7c3aed",
    },
    {
      Id: "14141414-1414-1414-1414-141414141414",
      Name: "Business",
      Emoji: "💼",
      Color: "#64748b",
    },
    {
      Id: "15151515-1515-1515-1515-151515151515",
      Name: "Cars",
      Emoji: "🚗",
      Color: "#dc2626",
    },
    {
      Id: "16161616-1616-1616-1616-161616161616",
      Name: "Space",
      Emoji: "🚀",
      Color: "#002f9dff",
    },
    {
      Id: "22222222-2222-2222-2222-222222222222",
      Name: "Books",
      Emoji: "📚",
      Color: "#8b5cf6",
    },
    {
      Id: "33333333-3333-3333-3333-333333333333",
      Name: "Movies",
      Emoji: "🎬",
      Color: "#ff3b3b",
    },
    {
      Id: "44444444-4444-4444-4444-444444444444",
      Name: "Music",
      Emoji: "🎵",
      Color: "#ff7a3b",
    },
    {
      Id: "55555555-5555-5555-5555-555555555555",
      Name: "Gaming",
      Emoji: "🎮",
      Color: "#22c55e",
    },
    {
      Id: "66666666-6666-6666-6666-666666666666",
      Name: "Coding",
      Emoji: "💻",
      Color: "#06b6d4",
    },
    {
      Id: "77777777-7777-7777-7777-777777777777",
      Name: "Travel",
      Emoji: "✈️",
      Color: "#facc15",
    },
    {
      Id: "88888888-8888-8888-8888-888888888888",
      Name: "Fitness",
      Emoji: "🏋️",
      Color: "#ef4444",
    },
    {
      Id: "99999999-9999-9999-9999-999999999999",
      Name: "Anime",
      Emoji: "🍥",
      Color: "#f472b6",
    },
    {
      Id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      Name: "Technology",
      Emoji: "🧠",
      Color: "#0ea5e9",
    },
    {
      Id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      Name: "Art",
      Emoji: "🎨",
      Color: "#a855f7",
    },
    {
      Id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      Name: "Photography",
      Emoji: "📸",
      Color: "#14b8a6",
    },
    {
      Id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
      Name: "Science",
      Emoji: "🔬",
      Color: "#6366f1",
    },
    {
      Id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
      Name: "History",
      Emoji: "🏺",
      Color: "#b45309",
    },
    {
      Id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
      Name: "Cooking",
      Emoji: "🍳",
      Color: "#f97316",
    },
  ];

  const races = [
    {
      Id: "10000000-0000-0000-0000-000000000001",
      Name: "Elf",
      ThemeColorHex: "#3bff5e",
    },
    {
      Id: "10000000-0000-0000-0000-000000000002",
      Name: "Dark Elf",
      ThemeColorHex: "#7a3bff",
    },
    {
      Id: "10000000-0000-0000-0000-000000000003",
      Name: "Dwarf",
      ThemeColorHex: "#b87333",
    },
    {
      Id: "10000000-0000-0000-0000-000000000004",
      Name: "Human",
      ThemeColorHex: "#3b82ff",
    },
    {
      Id: "10000000-0000-0000-0000-000000000005",
      Name: "Orc",
      ThemeColorHex: "#4b5320",
    },
    {
      Id: "10000000-0000-0000-0000-000000000006",
      Name: "Vampire",
      ThemeColorHex: "#8b0000",
    },
    {
      Id: "10000000-0000-0000-0000-000000000007",
      Name: "Werewolf",
      ThemeColorHex: "#5c4033",
    },
    {
      Id: "10000000-0000-0000-0000-000000000008",
      Name: "Goblin",
      ThemeColorHex: "#7fff00",
    },
    {
      Id: "10000000-0000-0000-0000-000000000009",
      Name: "Troll",
      ThemeColorHex: "#556b2f",
    },
    {
      Id: "10000000-0000-0000-0000-000000000010",
      Name: "Dragonborn",
      ThemeColorHex: "#ff7a3b",
    },
    {
      Id: "10000000-0000-0000-0000-000000000011",
      Name: "Angel",
      ThemeColorHex: "#ffd700",
    },
    {
      Id: "10000000-0000-0000-0000-000000000012",
      Name: "Demon",
      ThemeColorHex: "#ff3b3b",
    },
    {
      Id: "10000000-0000-0000-0000-000000000013",
      Name: "Undead",
      ThemeColorHex: "#aaaaaa",
    },
    {
      Id: "10000000-0000-0000-0000-000000000014",
      Name: "Fairy",
      ThemeColorHex: "#ff69b4",
    },
    {
      Id: "10000000-0000-0000-0000-000000000015",
      Name: "Elemental",
      ThemeColorHex: "#3bfff2",
    },
  ];

  const toggle = (index: number) => {
    setSelectedInterests((prev) => {
      let updated;

      if (prev.includes(index)) {
        updated = prev.filter((i) => i !== index);
      } else {
        updated = [...prev, index];
      }

      return updated;
    });
  };

  useEffect(() => {
    if (!data.Avatar) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(data.Avatar);
    console.log(url);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [data.Avatar]);

  const percent = (current / total) * 100;
  const Next = async () => {
    if (current <= 3) {
      setCurrent((prev) => prev + 1);
    } else {
      try {
        const firstStepData = location.state;
        console.log(firstStepData);
        const fullData = {
          ...firstStepData,
          ...data,
        };
        await SignUp(fullData);

        navigate("/home");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const Prev = () => {
    if (current >= 2) {
      setCurrent((prev) => prev - 1);
    }
  };

  const StepText = () => {
    if (current === 1) return "1/4. Enter your Nickname";
    else if (current === 2) return "2/4. Upload your profile avatar";
    else if (current === 3) return "3/4. Pick your race";
    else if (current === 4) return "4/4. Choose your interests";
  };

  const Interaction = () => {
    if (current === 1) {
      return (
        <>
          <Input
            className="input"
            placeholder="Nickname"
            size="large"
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                Nickname: e.target.value,
              }))
            }
          />
        </>
      );
    } else if (current === 2) {
      return !data.Avatar ? (
        <Dragger
          className="uploadDragger"
          beforeUpload={() => false}
          onChange={(info) => {
            // console.log(info.file);
            // console.log(info.file.originFileObj);

            setData((prev) => ({
              ...prev,
              Avatar: info.file.originFileObj as File,
            }));
          }}
          showUploadList={false}
        >
          <p className="uploadIcon">
            <InboxOutlined />
          </p>

          <p className="uploadText">Click or drag image here</p>

          <p className="uploadHint">PNG, JPG, GIF</p>
        </Dragger>
      ) : (
        <div className="avatarPreviewContainer">
          <button
            className="removeAvatarBtn"
            onClick={() => {
              setData((prev) => ({
                ...prev,
                Avatar: null,
              }));
            }}
          >
            ✕
          </button>

          <img src={previewUrl!} alt="avatar" className="avatarPreview" />
        </div>
      );
    } else if (current === 3) {
      return (
        <>
          <div className="racesContainer">
            {races.map((race, index) => (
              <Button
                key={race.Name}
                className={`raceBtn ${selectedRace === index ? "active" : ""}`}
                style={{ "--race-color": race.ThemeColorHex } as React.CSSProperties}
                onClick={() => {
                  setSelectedRace(index);

                  setData((prev) => ({
                    ...prev,
                    RaceId: races[index].Id,
                  }));
                }}
              >
                {race.Name}
              </Button>
            ))}
          </div>
        </>
      );
    } else if (current === 4) {
      return (
        <>
          <div className="interestsContainer">
            {interests.map((item, index) => (
              <Button
                key={item.Name}
                className={`interestBtn ${selectedInterests.includes(index) ? "active" : ""}`}
                style={
                  { "--interest-color": item.Color } as React.CSSProperties
                }
                onClick={() => {
                  toggle(index);

                  setData((prev) => {
                    const id = interests[index].Id;

                    const isSelected = prev.Interests.includes(id);

                    return {
                      ...prev,
                      Interests: isSelected
                        ? prev.Interests.filter((i: string) => i !== id.toString())
                        : [...prev.Interests, id],
                    };
                  });
                }}
              >
                {item.Emoji} {item.Name}
              </Button>
            ))}
          </div>
        </>
      );
    }
  };

  return (
    <>
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
            <Form.Item
              className="ant-form-item"
              name="nickname"
              rules={[{ required: true, message: "Enter nickname" }]}
            >
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
                  {current === 4 ? "Finish" : "Continue"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}
