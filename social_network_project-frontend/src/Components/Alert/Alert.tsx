import { Button, Input, Modal } from "antd";
import "./AlertStyle.css";

export type AlertButtonType =
    | "ok"
    | "cancel"
    | "confirm"
    | "yes"
    | "no"
    | "delete"
    | "save";

export interface AlertProps {
    open: boolean;
    title: string;
    message: string;
    buttons: AlertButtonType[];

    confirmInput?: {
        placeholder: string;
        value: string;
        requiredText?: string;
    };

    onInputChange?: (value: string) => void;

    onAction: (action: AlertButtonType) => void;
    onClose: () => void;
}

const buttonConfig: Record<AlertButtonType, {
    text: string;
    type: "primary" | "default";
    danger?: boolean;
    confirm: boolean;
}> = {
    ok: {
        text: "OK",
        type: "primary",
        confirm: true
    },

    confirm: {
        text: "Confirm",
        type: "primary",
        confirm: true
    },

    save: {
        text: "Save",
        type: "primary",
        confirm: true
    },

    delete: {
        text: "Delete",
        type: "primary",
        danger: true,
        confirm: true
    },

    cancel: {
        text: "Cancel",
        type: "default",
        confirm: false
    },

    no: {
        text: "No",
        type: "default",
        confirm: false
    },

    yes: {
        text: "Yes",
        type: "primary",
        confirm: true
    }
};

export function AlertModal({
    open,
    title,
    message,
    buttons,
    confirmInput,
    onInputChange,
    onAction,
    onClose
}: AlertProps) {

    const leftButtons = buttons.filter(b => !buttonConfig[b].confirm);
    const rightButtons = buttons.filter(b => buttonConfig[b].confirm);

    const canConfirm =
        !confirmInput?.requiredText ||
        confirmInput.value === confirmInput.requiredText;


    return (
        <Modal
            className="alertModal"
            open={open}
            footer={null}
            centered
            maskClosable={false}
            keyboard={false}
            closable={false}
            onCancel={onClose}
        >

            <div className="alertContainer">

                <h2 className="alertTitle">
                    {title}
                </h2>

                <div className="alertMessage">
                    {message}
                </div>


                {confirmInput && (
                    <Input
                        className="alertInput"
                        placeholder={confirmInput.placeholder}
                        value={confirmInput.value}
                        onChange={(e) =>
                            onInputChange?.(e.target.value)
                        }
                    />
                )}


                <div className="alertFooter">

                    <div className="leftButtons">
                        {leftButtons.map(button => (
                            <Button
                                key={button}
                                className="alertBtn alertBtnDefault"
                                onClick={() => onAction(button)}
                            >
                                {buttonConfig[button].text}
                            </Button>
                        ))}
                    </div>


                    <div className="rightButtons">
                        {rightButtons.map(button => (
                            <Button
                                key={button}
                                disabled={!canConfirm}
                                className={
                                    buttonConfig[button].danger
                                    ? "alertBtn alertBtnDanger"
                                    : "alertBtn alertBtnPrimary"
                                }
                                onClick={() => onAction(button)}
                            >
                                {buttonConfig[button].text}
                            </Button>
                        ))}
                    </div>

                </div>

            </div>

        </Modal>
    );
}