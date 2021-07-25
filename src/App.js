import logo from "./logo.svg";
import "./App.css";
import { useEffect, useMemo, useRef, useState } from "react";

const HOUR = 1000 * 60 * 60;
const DAY = 24 * HOUR;
function initState() {
  return {
    files: [
      {
        tags: ["image", "jpeg", "Toto"],
        content: `data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==`,
        lastMutation: Date.now() - DAY,
      },
      {
        tags: ["config", "postgres"],
        content: `BINARYBLOBIBOULGA$ù*$ù$`,
        lastMutation: Date.now() - 2 * DAY,
      },
      {
        tags: ["config", "keyboard"],
        content: JSON.stringify({ lng: "fr" }),
        lastMutation: Date.now() - 2 * DAY,
      },
      {
        tags: ["config", "mouse"],
        content: JSON.stringify({ speed: 3 }),
        lastMutation: Date.now() - 2 * DAY,
      },
      {
        tags: ["config", "location"],
        content: JSON.stringify({ utcZone: "GMT+2", countryCode: "FR" }),
        lastMutation: Date.now() - 2 * DAY,
      },
      {
        tags: ["config", "wifi"],
        content: JSON.stringify([
          { SSID: "Wifi maison", code: "tralala" },
          { SSID: "Wifi travail", code: "tsoin tsoin" },
        ]),
        lastMutation: Date.now() - 2 * DAY,
      },
      {
        tags: ["work", "english", "essay", "done"],
        content:
          "Dogs are good, in this essay we will prove why. No antithesis.",
        lastMutation: Date.now() - 3 * DAY,
      },
      {
        tags: ["work", "math", "dm", "done"],
        content: "1+1=11",
        lastMutation: Date.now() - 3 * DAY,
      },
      {
        tags: ["work", "english", "essay", "todo"],
        content:
          "Cats are evil, in this essay we will prove why. No antithesis.",
        lastMutation: Date.now() - 3 * DAY,
      },
      {
        tags: ["download", "video", "mkv", "Avengers"],
        content: "....",
        lastMutation: Date.now() - 3 * DAY,
      },
      {
        tags: ["app", "resources", "skype", "blob1"],
        content: "....",
        lastMutation: Date.now() - 4 * DAY,
      },
      {
        tags: ["app", "resources", "skype", "blob2"],
        content: "....",
        lastMutation: Date.now() - 5 * DAY,
      },
      {
        tags: ["app", "config", "skype", "user"],
        content: "@thomas\ncode",
        lastMutation: Date.now() - 6 * DAY,
      },
      {
        tags: ["app", "exe", "skype"],
        content: "....",
        lastMutation: Date.now() - 0 * DAY,
      },
      {
        tags: ["app", "exe", "vs-code"],
        content: "....",
        lastMutation: Date.now() - 8 * DAY,
      },
      {
        tags: ["app", "exe", "firefox"],
        content: "....",
        lastMutation: Date.now() - 3 * DAY,
      },
    ],
  };
}

function removeTag(root, fileIndex, tagIndex) {
  root.files[fileIndex].tags.splice(tagIndex, 1);
  return root;
}

function isInSearch(search, file) {
  if (search === "") return true;

  let terms = search.split(" ");

  let todayFilter = terms.findIndex((e) => e === "today");
  if (todayFilter !== -1) {
    terms.splice(todayFilter, 1);
    todayFilter = true;
  }

  let weekFilter = terms.findIndex((e) => e === "lastWeek");
  if (weekFilter !== -1) {
    terms.splice(weekFilter, 1);
    weekFilter = true;
  }

  let monthFilter = terms.findIndex((e) => e === "lastMonth");
  if (monthFilter !== -1) {
    terms.splice(monthFilter, 1);
    monthFilter = true;
  }

  let matched = terms.filter((term) =>
    file.tags.some((e) => e.startsWith(term))
  );

  let customTagOk = terms.length === matched.length;
  let dateOk = true;
  if (todayFilter === true) {
    dateOk = dateOk && file.lastMutation > Date.now() - 1 * DAY;
  }
  if (weekFilter === true) {
    dateOk = dateOk && file.lastMutation > Date.now() - 7 * DAY;
  }
  if (monthFilter === true) {
    dateOk = dateOk && file.lastMutation > Date.now() - 30 * DAY;
  }

  return customTagOk && dateOk;
}

function App() {
  let [state, setState] = useState(initState());

  let [search, setSearch] = useState("");

  let validTag = useMemo(() => {
    let valids = new Set();
    state.files.forEach((file) => {
      if (isInSearch(search, file)) {
        file.tags.forEach((tag) => {
          valids.add(tag);
        });
      }
    });
    search.split(" ").forEach((r) => valids.delete(r));

    return [...valids];
  }, [search, state]);

  function dispatch(msg) {
    console.log("dispatch " + msg);
    switch (msg.command) {
      case "deleteTag":
        setState((old) => {
          let copy = { ...old };
          removeTag(copy, msg.fileIndex, msg.tagIndex);
          return copy;
        });
        break;
    }
  }

  return (
    <div>
      <div style={{ display: "flex" }}>
        <input
          style={{
            padding: "10px",
            fontSize: "1em",
            border: "none",
            outline: "none",
            backgroundColor: "#eee",
            margin: "10px",
          }}
          placeholder="search tag"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            console.log(e.code);
            if (e.code === "Tab") {
              e.preventDefault();
              setSearch((old) => old + " ");
            }
          }}
        ></input>
        <div
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
        >
          {validTag.map((tag) => (
            <div
              style={{
                fontSize: "0.8em",
                fontWeight: "500",
                margin: "0px 5px",
                cursor: "pointer",
              }}
              onClick={() => setSearch((old) => old + " " + tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
      {/* GRAPHICAL */}
      <div style={{ whiteSpace: "pre", display: "flex", flexWrap: "wrap" }}>
        {state.files.map((file, fileIndex) => (
          <div
            style={{
              background: "#eee",
              margin: "10px",
              display: isInSearch(search, file) ? "block" : "none",
            }}
          >
            <MetaViewer
              file={file}
              fileIndex={fileIndex}
              dispatch={(arg) => dispatch({ ...arg, fileIndex })}
            ></MetaViewer>
            <div style={{ padding: "5px" }}>
              <ContentViewer file={file}></ContentViewer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetaViewer({ file: { content, tags, lastMutation }, dispatch }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "5px",
        background: "#ccc",
      }}
    >
      {tags.map((tag, tagIndex) => (
        <TagViewer
          tag={tag}
          dispatch={(arg) => dispatch({ ...arg, tagIndex })}
        ></TagViewer>
      ))}

      <div
        style={{
          margin: "0px 10px",
          height: "32px",
          width: "1px",
          background: "#bbb",
        }}
      ></div>
      <div>
        <div style={{ fontSize: "0.8em", fontWeight: "500" }}>
          {new Date(lastMutation).toLocaleDateString()}
        </div>
        <div style={{ fontSize: "0.8em", fontWeight: "500" }}>
          {content.length} bytes
        </div>
      </div>
    </div>
  );
}

function TagViewer({ tag, dispatch }) {
  let [open, setOpen] = useState(false);

  let ref = useRef();
  useEffect(() => {
    let f = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.body.addEventListener("click", f);
    }

    return () => {
      try {
        document.body.removeEventListener("click", f);
      } catch {}
    };
  }, [open]);

  return (
    <div
      onClick={() => setOpen((old) => !old)}
      style={{
        padding: "3px",
        fontSize: "0.8em",
        fontWeight: "500",
        position: "relative",
        cursor: "pointer",
      }}
    >
      {tag}

      <div
        ref={ref}
        style={{
          display: open ? "flex" : "none",
          position: "absolute",
          left: "0px",
          top: "0px",
          transform: "translate(50%,-100%)",

          cursor: "pointer",
        }}
      >
        <div
          style={{ background: "red", padding: "5px" }}
          onClick={() => dispatch({ command: "deleteTag" })}
        >
          x
        </div>
      </div>
    </div>
  );
}

function ContentViewer({ file: { content, tags, lastMutation } }) {
  let isImage = tags.includes("image");

  let isText = !isImage && tags.includes("config");

  let isJson = false;

  try {
    if (isText) {
      let r = JSON.parse(content);
      isJson = true;
    }
  } catch {}

  if (isJson)
    return (
      <div style={{ color: "#444", whiteSpace: "pre" }}>
        {JSON.stringify(JSON.parse(content), null, 1)}
      </div>
    );
  if (isImage) return <img src={content} style={{ height: "50px" }}></img>;

  return <div style={{ color: "#444" }}>{content}</div>;
}

export default App;
