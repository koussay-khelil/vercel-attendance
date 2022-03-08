import { useEffect, useState, useMemo } from "react";
import "./App.css";
import SignUpTable from "./components/SignUpTable";
import Intro from "./components/intro";
import { fetchAPI } from "./lib/api";

function App() {
  const [data, setData] = useState();
  const [activeEvents, setActiveEvents] = useState([]);
  const [skipPageReset, setSkipPageReset] = useState(false);
  useEffect(() => {
    fetchAPI("/active-events").then((data) => setActiveEvents(data));
  }, []);

  const activeEvent = activeEvents[activeEvents?.length - 1];

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
      {
        Header: "Vacciné",
        accessor: "Vaccinated",
      },
    ],
    []
  );

  return (
    <div className="App">
      <Intro
        eventImageUrl={activeEvent && activeEvent?.event?.eventCover?.url}
      />
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
