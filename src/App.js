import { useEffect, useState, useMemo } from "react";
import "./App.css";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import SignUpTable from "./components/SignUpTable";
import Intro from "./components/intro";
import { fetchAPI } from "./lib/api";

function App() {
  const [data, setData] = useState();
  const [activeEvents, setActiveEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState();
  const [skipPageReset, setSkipPageReset] = useState(false);
  useEffect(() => {
    fetchAPI("/active-events").then((data) => setActiveEvents(data));
  }, []);

  useEffect(() => {
    setActiveEvent(activeEvents[0]);
  }, [activeEvents, data]);

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
        Header: "Activité",
        accessor: "activity",
      },
      {
        Header: "Fonction",
        accessor: "title",
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
    <div className="App">
      <Intro
        eventImageUrl={activeEvent && activeEvent?.event?.eventCover?.url}
      />

      <div style={{ textAlign: "center", fontSize: "32px" }}>
        {activeEvent?.event?.title}
      </div>
      {activeEvent &&
        activeEvent?.event?.title === "UPSKILL II Workshop --Tabarka--" && (
          <div style={{ textAlign: "center", fontSize: "32px" }}>
            <br /> Tourism Federations & Associations Strengthening Program{" "}
            <br /> January 24-25, 2023 <br /> Thabraca Hotel Tabarka
          </div>
        )}
      {activeEvent &&
        activeEvent?.event?.title === "UPSKILL II Workshop -- Tozeur" && (
          <div style={{ textAlign: "center", fontSize: "32px" }}>
            <br /> Tourism Federations & Associations Strengthening Program
            <br /> January 13-14, 2023 <br /> Ras El Ain Hotel Tozeur
          </div>
        )}

      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={activeEvent && activeEvent}
        label="Age"
        onChange={(e) => setActiveEvent(e.target.value)}
      >
        {activeEvents.map((event) => (
          <MenuItem value={event}>{event.event.title}</MenuItem>
        ))}
      </Select>

      <SignUpTable
        eventTitle={activeEvent && activeEvent?.event?.title}
        eventUId={activeEvent && activeEvent.id}
        columns={columns}
        setData={setData}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
        activeEvent={activeEvent}
      />
    </div>
  );
}

export default App;
