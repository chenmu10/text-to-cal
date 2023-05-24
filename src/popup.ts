interface EventDetails {
  summary: string;
  description: string;
  location: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
}

document.addEventListener("DOMContentLoaded", function () {
  const CHAT_GPT_API = "https://fair-lane-387516.oa.r.appspot.com";
  const CALENDAR_EVENTS_API =
    "https://www.googleapis.com/calendar/v3/calendars/primary/events";
  const extractDetailsBtn = document.getElementById(
    "extractDetailsBtn"
  ) as HTMLFormElement;
  const createEventBtn = document.getElementById(
    "createEventBtn"
  ) as HTMLFormElement;
  const promptTextEl = document.getElementById(
    "promptData"
  ) as HTMLTextAreaElement;
  const extractStatusMsgEl = document.getElementById(
    "extractStatusMsg"
  ) as HTMLSpanElement;
  const createEventStatusMsgEl = document.getElementById(
    "createEventStatusMsg"
  ) as HTMLSpanElement;

  const summaryInputEl = document.getElementById("summary") as HTMLInputElement;
  const locationInputEl = document.getElementById(
    "Location"
  ) as HTMLInputElement;
  const descriptionTextareaEl = document.getElementById(
    "description"
  ) as HTMLTextAreaElement;
  const startDateInputEl = document.getElementById(
    "startDate"
  ) as HTMLInputElement;
  const endDateInputEl = document.getElementById("endDate") as HTMLInputElement;

  extractDetailsBtn.addEventListener("click", handleExtractDetailsClick);
  createEventBtn.addEventListener("click", handleCreateEventClick);

  async function handleExtractDetailsClick(event: MouseEvent) {
    event.preventDefault();
    extractStatusMsgEl.innerText = ``;
    if (promptTextEl.value.trim() === "") {
      extractStatusMsgEl.innerText = "No text provided.";
      return;
    } else {
      extractDetailsBtn.innerText = "Loading..";
    }
    const data = await getEventDetailsFromGPT(promptTextEl.value);

    insertDataToForm(data);
  }

  async function getEventDetailsFromGPT(promptText: string) {
    try {
      const response = await fetch(`${CHAT_GPT_API}/generate-event-details`, {
        method: "POST",
        body: JSON.stringify({ promptText }),
      });

      const data = await response.json();
      if (data?.error?.error?.code) {
        extractStatusMsgEl.innerText = `chatGPT server error: ${data?.error?.error?.code}. Inserting demo data.`;
      } else {
        return data;
      }
    } catch (error) {
      console.error("An error occurred while fetching event details:", error);
    } finally {
      extractDetailsBtn.innerText = "Extract";
    }
  }

  function insertDataToForm(data: EventDetails) {
    const mockData: EventDetails = {
      summary: "טיול לנחל שניר",
      description:
        'מה הלו"ז? בקשתם טיולים וקבלתם!! טיולים מאחורינו וגם הטיול הבא הולך להיות כיפי במיוחד...\n\nבשבת 3/6 נצפין אל נחל הבניאס ונטייל לאורכו של הנחל שהוא גם אחד ממקורותיו של נהר הירדן!\n\nכ-8 ק"מ של מסלול שופע מים למרגלות רמת הגולן ועמק החולה עם שפע של נקודות לרחצה בנחל!\n\nהמסלול ברמת קושי קלה ומתחיל באיזור הישוב שניר\n\nאין חובה להיכנס למים',
      location: "שניר, שניר",
      start: {
        dateTime: "2023-06-03T09:30:00",
        timeZone: undefined,
      },
      end: {
        dateTime: "2023-06-03T16:30:00",
        timeZone: undefined,
      },
    };

    if (!data?.summary) {
      data = mockData;
    }

    summaryInputEl.value = data.summary;
    locationInputEl.value = data.location;
    descriptionTextareaEl.value = data.description;
    startDateInputEl.value = data.start.dateTime;
    endDateInputEl.value = data.end.dateTime;
  }

  async function handleCreateEventClick(event: MouseEvent) {
    event.preventDefault();
    createEventBtn.innerText = "Loading..";
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let eventDetails = {
      summary: summaryInputEl.value,
      description: locationInputEl.value,
      location: descriptionTextareaEl.value,
      start: {
        dateTime: startDateInputEl.value,
        timeZone: userTimeZone,
      },
      end: {
        dateTime: endDateInputEl.value,
        timeZone: userTimeZone,
      },
    };

    await createEvent(eventDetails);
  }

  async function createEvent(eventDetails: EventDetails) {
    // @ts-ignore
    chrome.identity.getAuthToken({ interactive: true }, async function (token) {
      try {
        const response = await fetch(CALENDAR_EVENTS_API, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventDetails),
        });
        createEventBtn.innerText = "Create Event";
        const data = await response.json();
        if (!response.ok) {
          createEventStatusMsgEl.innerText = `Google calender: ${JSON.stringify(
            data
          )}.`;
        } else {
          createEventStatusMsgEl.innerText = `Created successfully: ${JSON.stringify(
            data
          )}.`;
        }
      } catch (error) {
        console.error("An error occurred while creating event:", error);
      }
    });
  }
});
