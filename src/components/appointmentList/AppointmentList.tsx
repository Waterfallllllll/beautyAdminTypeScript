import { useContext, useEffect, useState } from "react";

import AppointmentItem from "../appointmentItem.tsx/AppointmentItem";
import { AppointmentContext } from "../../context/appointments/AppointmentsContext";
import Spinner from "../spinner/Spinner";
import Error from "../error/Error";
import CancelModal from "../modal/CancelModal";

import "../../pages/schedule/schedulePage.scss";

function AppointmentList() {
    const { activeAppointments, getActiveAppointments, appointmentLoadingStatus } =
        useContext(AppointmentContext);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, selectId] = useState(0);

    useEffect(() => {
        getActiveAppointments();
    }, []);

    console.log(appointmentLoadingStatus);

	if (appointmentLoadingStatus === "loading") {
		return <Spinner/>
	} else if (appointmentLoadingStatus === "error"){
        return (
            <>
                <Error/>
                <button className="schedule__reload" onClick={getActiveAppointments}>
                    Try to reload
                </button>
            </>
        );
    } 

    return (
        <>
			{activeAppointments.map(item => {
				return <AppointmentItem key={item.id} {...item} openModal={setIsOpen} selectId={() => selectId(item.id)}/>
			})}
            {isOpen ? <CancelModal handleClose={setIsOpen} selectedId={selectedId} /> : null}           
        </>
    );
}

export default AppointmentList;
