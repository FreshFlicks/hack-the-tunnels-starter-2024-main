import { Central as Layout } from "@/layouts";
import { Section } from "./Section";
import { SearchSection } from "./SearchSection";
import { ResultsSection } from "./ResultsSection";
import { TimetableSection } from "./TimetableSection";
import { useState } from "react";
import { ServiceAPI } from "@/infrastructure";
import { ScheduledEvent } from "@/infrastructure/ServiceAPI";
import { WorksheetSection } from "./WorksheetSection";
import { useAccountContext } from "@/context";
import { useNavigate } from "react-router-dom";
import { scheduledEventToCalendarBlock } from "@/utils";
import "./BuildTimetable.style.scss";
import { Divider } from "@/layouts/Central/Divider";

function BuildTimetable() {
  const [timetableName, setTimetableName] = useState('timetable');
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimetableName(e.target.value);
};
  const { jwt } = useAccountContext();
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<ScheduledEvent[]>([]);
  const navigate = useNavigate();

  const fetchScheduledEvents = async () => {
    const result = await ServiceAPI.fetchScheduledEvents();
    setScheduledEvents(result);
  };

  const createTimetable = async () => {
    const result = await ServiceAPI.createTimetable(
      timetableName,
      selectedEvents.map((event) => event.id.toString()),
      jwt,
    );
    const timetablemyData = {
      name: timetableName,
    };
    navigate(`/timetables/${result.data.id}`);
    console.log('Created a timetable with info of ', timetablemyData)
  };

  const addEvent = (event: ScheduledEvent) => {
    setSelectedEvents([...selectedEvents, event]);
  };

  const removeEvent = (event: ScheduledEvent) => {
    setSelectedEvents(selectedEvents.filter((e) => e.id !== event.id));
  };

  return (
    
    <Layout title={"My Course Worksheet"}>
      <div className="BuildTimetable">
        <Section title="Search">
          <SearchSection onSearch={fetchScheduledEvents} />
        </Section>
        {scheduledEvents.length > 0 && (
          <Section title="Results">
            <ResultsSection
              scheduledEvents={scheduledEvents}
              addEvent={addEvent}
            />
          </Section>
        )}
        {selectedEvents.length > 0 && (
          <Section title="Worksheet">
            <WorksheetSection
              selectedEvents={selectedEvents}
              removeEvent={removeEvent}
              createTimetable={createTimetable}
            />
            <div>
            <h2>Save timetable as:</h2>
              {/* Input for the timetable name */}
            <label htmlFor="timetableName">Timetable Name:</label>
            <input
                type="text"
                id="timetableName"
                value={timetableName}
                onChange={handleNameChange}
            />
            <button onClick={createTimetable}>Save Timetable</button>
          </div>
          </Section>
        )}
        <Section title="Draft Timetable">
          <TimetableSection
            selectedEvents={selectedEvents.map((event: ScheduledEvent) =>
              scheduledEventToCalendarBlock(event),
            )}
          />
        </Section>
      </div>
    </Layout>
  )
};

export default BuildTimetable;
