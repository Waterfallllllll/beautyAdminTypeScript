import { useContext, useEffect } from "react";

import AppointmentItem from "../appointmentItem.tsx/AppointmentItem";
import { AppointmentContext } from "../../context/appointments/AppointmentsContext";

function AppointmentList() {
    const { activeAppointments, getActiveAppointments } =
        useContext(AppointmentContext);

    useEffect(() => {
        getActiveAppointments();
    }, []);

    return (
        <>
			{activeAppointments.map(item => {
				return <AppointmentItem key={item.id} {...item}/>
			})}           
        </>
    );
}

export default AppointmentList;
