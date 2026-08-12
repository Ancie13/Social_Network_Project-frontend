import { useLocation, useNavigate } from "react-router-dom";
import "./AdditioanlInfoStyle.css";
import { Button, Form, Input, Progress } from "antd";
import { useEffect, useMemo, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { GetAdditionalInfo, SignUp } from "../api/userApi";
import Dragger from "antd/es/upload/Dragger";
import Loader from "../Components/loader/Loader";
import type { interes } from "../types/Types";

type race = {
  id: string;
  name: string;
  themeColorHex: string;
};

export default function AdditionalInfoPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(1);
  const total = 4;
  const [selectedRace, setSelectedRace] = useState<number | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [interests, setInterests] = useState<Array<interes>>([]);
  const [races, setRaces] = useState<Array<race>>([]);
  const [loadingResponse, setLoadingResponse] = useState(false);

  const [data, setData] = useState({
    Nickname: "",
    Avatar: null as File | null,
    RaceId: null as string | null,
    Interests: [] as string[],
  });

  const avatarPreview = useMemo(() => {
    if (!data.Avatar) return null;
    return URL.createObjectURL(data.Avatar);
  }, [data.Avatar]);

  useEffect(() => {
    document.title = "Registration | EtherLink";
  }, []);

  useEffect(() => {
    const fetchAdditionalInfo = async () => {
      try {
        setLoading(true);

        const info = await GetAdditionalInfo();

        setInterests(info.data.interests);
        setRaces(info.data.races);
      } finally {
        setLoading(false);
      }
    };
    fetchAdditionalInfo();
  }, []); // TODO: Move it on app page and preload

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

  const percent = (current / total) * 100;
  const Next = async () => {
    try {
      if (current === 1) {
        await form.validateFields(["nickname"]);
      }

      if (current === 3) {
        if (!data.RaceId) {
          // SHOW ERROR----------------------------
          return;
        }
      }

      if (current === 4) {
        if (selectedInterests.length < 3) {
          return;
        }

        setLoadingResponse(true);

        const firstStepData = location.state;

        const fullData = {
          ...firstStepData,
          ...data,
        };

        await SignUp(fullData);

        navigate("/home");
        return;
      }

      setCurrent((prev) => prev + 1);
    } catch (error) {
      console.log(error);
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
            value={data.Nickname}
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
      return (
        <>
          {!data.Avatar && (
            <Dragger
              className="uploadDragger"
              beforeUpload={() => false}
              onChange={(info) => {
                console.log("File: " + info.file);
                console.log(info.file);

                setData((prev) => ({
                  ...prev,
                  Avatar: info.file as unknown as File,
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
          )}

          {data.Avatar && (
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

              <img src={avatarPreview || ""} className="avatarPreviewAddInfo" />
            </div>
          )}
        </>
      );
    } else if (current === 3) {
      return (
        <>
          <Form.Item
            validateStatus={!selectedRace ? "error" : ""}
            help={!selectedRace ? "* Please select a race" : ""}
          >
            <div className="racesContainer">
              {races.map((race, index) => (
                <Button
                  key={race.name}
                  className={`raceBtn ${selectedRace === index ? "active" : ""}`}
                  style={
                    {
                      "--race-color": race.themeColorHex,
                    } as React.CSSProperties
                  }
                  onClick={() => {
                    setSelectedRace(index);

                    setData((prev) => ({
                      ...prev,
                      RaceId: race.id,
                    }));
                  }}
                >
                  {race.name}
                </Button>
              ))}
            </div>
          </Form.Item>
        </>
      );
    } else if (current === 4) {
      return (
        <>
          <Form.Item
            validateStatus={selectedInterests.length < 3 ? "error" : ""}
            help={
              selectedInterests.length < 3
                ? "* Please select at least 3 interests"
                : ""
            }
          >
            <div className="interestsContainer">
              {interests.map((item, index) => (
                <Button
                  key={item.name}
                  className={`interestBtn ${selectedInterests.includes(index) ? "active" : ""}`}
                  style={
                    { "--interest-color": item.color } as React.CSSProperties
                  }
                  onClick={() => {
                    toggle(index);

                    setData((prev) => {
                      const id = interests[index].id;

                      const isSelected = prev.Interests.includes(id);

                      return {
                        ...prev,
                        Interests: isSelected
                          ? prev.Interests.filter(
                              (i: string) => i !== id.toString(),
                            )
                          : [...prev.Interests, id],
                      };
                    });
                  }}
                >
                  {item.emoji} {item.name}
                </Button>
              ))}
            </div>
          </Form.Item>
        </>
      );
    }
  };

  if (loading) {
    return <Loader></Loader>;
  }
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

          <Form form={form}>
            <Form.Item
              className="ant-form-item"
              name="nickname"
              rules={[{ required: true, message: "Enter nickname" }]}
            >
              {Interaction()}
            </Form.Item>

            <Form.Item>
              <div className="buttonsBoxAddInfo">
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
                  loading={loadingResponse}
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
