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
    <div className="App">
      <Intro
        eventImageUrl={activeEvent && activeEvent?.event?.eventCover?.url}
      />

      {activeEvent && activeEvent?.event?.title === "SME Registration" ? (
        <div style={{ textAlign: "center", fontSize: "32px" }}>
          Atelier UPSKILL. <br /> Programme de Renforcement de Capacités des
          Fédérations et Associations dans le Tourisme.
          <br /> Du 16 - 18 Novembre 2022
        </div>
      ) : (
        <div style={{ textAlign: "center", fontSize: "32px" }}>
          {activeEvent?.event?.title}
        </div>
      )}
      {console.log("activeEvents", activeEvent)}
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
