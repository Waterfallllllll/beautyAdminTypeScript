import Portal from "../portal/portal";
import { useEffect, useRef, useContext, useState } from "react";
import { CSSTransition } from "react-transition-group";
import useAppointmentService from "../../services/AppointmentService";
import { AppointmentContext } from "../../context/appointments/AppointmentsContext";

import "./modal.scss";

interface IModalProps {
    handleClose: (state: boolean) => void;
    selectedId: number;
    isOpen: boolean;
}

function CancelModal({ handleClose, selectedId, isOpen }: IModalProps) {
    const nodeRef = useRef<HTMLDivElement>(null);
    const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
    const [cancelStatus, setCancelStatus] = useState<boolean | null>(null);
    const { modifyCancelDbData } = useAppointmentService();
    const { getActiveAppointments } = useContext(AppointmentContext);

    const handleCancelAppointment = (id: number) => {
        setBtnDisabled(true);
        modifyCancelDbData(id)
            .then(() => {
                setCancelStatus(true);
            })
            .catch(() => {
                setCancelStatus(false);
                setBtnDisabled(false);
            });
    };

    const closeModal = () => {
		handleClose(false);
		if (cancelStatus) {
			getActiveAppointments();
		}
	};

    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                getActiveAppointments();
                handleClose(false);
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen, handleClose]);

    return (
        <Portal>
            <CSSTransition
                in={isOpen}
                timeout={{ enter: 500, exit: 500 }}
                unmountOnExit
                classNames="modal"
                nodeRef={nodeRef}
            >
                <div className="modal" ref={nodeRef}>
                    <div className="modal__body">
                        <span className="modal__title">
                            Are you sure you want to delete the appointment? #
                            {selectedId}
                        </span>
                        <div className="modal__btns">
                            <button
                                className="modal__ok"
								disabled={btnDisabled}
								onClick={() => handleCancelAppointment(selectedId)}
                            >
                                Ok
                            </button>
                            <button
                                className="modal__close"
                                onClick={() => closeModal()}
                            >
                                Close
                            </button>
                        </div>
                        <div className="modal__status">
                            {cancelStatus === null
                                ? ""
                                : cancelStatus
                                  ? "Success"
                                  : "Error, please try again"}
                        </div>
                    </div>
                </div>
            </CSSTransition>
        </Portal>
    );
}

export default CancelModal;
