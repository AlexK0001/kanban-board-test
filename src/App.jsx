import React from "react";
import KanbanBoard from "./components/KanbanBoard";
import "../src/App";

function App() {
  return (
    <div className="App">
      <h1>GitHub Issues Kanban Board</h1>
      <KanbanBoard />
    </div>
  );
}

export default App;
