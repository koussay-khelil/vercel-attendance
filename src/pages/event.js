import { useEffect, useState, useMemo } from "react";
import SignUpTable from "../components/SignUpTable";
import Intro from "../components/intro";
import { fetchAPI } from "../lib/api";

function EventPage() {
  const [data, setData] = useState();
  const [activeEvent, setActiveEvent] = useState();
  const [activeEvents, setActiveEvents] = useState();
  const [skipPageReset, setSkipPageReset] = useState(false);

  useEffect(() => {
    fetchAPI("/active-events").then((data) => setActiveEvents(data));
  }, []);

  const getTodaysEvent = () => {
    const today = new Date().toLocaleDateString("fr-FR");
    console.log("today", today);
    const todaysEvent = activeEvents?.find(
      (event) =>
        today >= new Date(event.event.start).toLocaleDateString("fr-FR") &&
        today <= new Date(event.event.end).toLocaleDateString("fr-FR")
    );
    return todaysEvent;
  };

  const todaysEvent = getTodaysEvent();

  console.log("todaysEvent", todaysEvent, activeEvents);

  useEffect(() => {
    todaysEvent &&
      fetchAPI(`/active-events/${todaysEvent.id}`).then((data) =>
        setActiveEvent(data)
      );
  }, [todaysEvent]);

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Genre",
        accessor: "Gender",
      },
      {
        Header: "Nom",
        accessor: "Name",
      },
      {
        Header: "Prénom",
        accessor: "Surname",
      },
      {
        Header: "Tranche d'age",
        accessor: "Age",
      },
      {
        Header: "Gouvernorat",
        accessor: "Governorate",
      },
      {
        Header: "Organisation",
        accessor: "Organization",
      },
      {
        Header: "Fonction",
        accessor: "Title",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone",
        accessor: "Phone",
      },
    ],
    []
  );

  return (
    <div>
      {activeEvent ? (
        <>
          {" "}
          <Intro
            eventImageUrl={activeEvent && activeEvent?.event?.eventCover?.url}
          />
          <div style={{ textAlign: "center", fontSize: "32px" }}>
            {activeEvent?.event?.title}
          </div>
          <SignUpTable
            eventTitle={activeEvent && activeEvent?.event?.title}
            eventUId={activeEvent && activeEvent.id}
            columns={columns}
            setData={setData}
            updateMyData={updateMyData}
            skipPageReset={skipPageReset}
            activeEvent={activeEvent}
          />
        </>
      ) : (
        <div>
          There is no active event with this id. Please contact the admin
        </div>
      )}
    </div>
  );
}

export default EventPage;
