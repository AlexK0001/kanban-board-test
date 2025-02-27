import React, { useEffect, useState } from "react";
import { fetchIssues, updateIssue, fetchRepoInfo } from "../api/github";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const KanbanBoard = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [repoInfo, setRepoInfo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [columns, setColumns] = useState({ todo: [], inProgress: [], done: [] });

  useEffect(() => {
    const savedRepo = localStorage.getItem("repoUrl");
    if (savedRepo) {
      setRepoUrl(savedRepo);
      loadIssues(savedRepo);
    }
  }, []);

  const loadIssues = async (url) => {
    if (!url) return;
    localStorage.setItem("repoUrl", url);

    const [fetchedIssues, repoData] = await Promise.all([fetchIssues(url), fetchRepoInfo(url)]);
    setRepoInfo(repoData);

    const savedColumns = JSON.parse(localStorage.getItem(`kanban-${url}`));
    setColumns(savedColumns || categorizeIssues(fetchedIssues));
    setIssues(fetchedIssues);
  };

  const categorizeIssues = (issues) => ({
    todo: issues.filter((issue) => issue.state === "open" && !issue.labels.some(label => label.name === "in progress")),
    inProgress: issues.filter((issue) => issue.labels.some(label => label.name === "in progress")),
    done: issues.filter((issue) => issue.state === "closed"),
  });

  useEffect(() => {
    localStorage.setItem(`kanban-${repoUrl}`, JSON.stringify(columns));
  }, [columns, repoUrl]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    const [movedItem] = sourceCol.splice(source.index, 1);
    destCol.splice(destination.index, 0, movedItem);

    setColumns({ ...columns });

    const newState = destination.droppableId === "done" ? "closed" : "open";
    const newLabels = destination.droppableId === "inProgress" ? ["in progress"] : [];
    const assignee = destination.droppableId === "inProgress" ? movedItem.user.login : null;

    await updateIssue(repoUrl, movedItem.number, newState, newLabels, assignee);
  };

  return (
    <div className="kanban-container">
      <div className="search-container d-flex p-3">
        <input
          type="text"
          placeholder="Enter GitHub Repo URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="form-control mr-2"
        />
        <button onClick={() => loadIssues(repoUrl)} className="btn btn-primary">
          Load Issues
        </button>
      </div>

      {repoInfo && (
        <div className="repo-info p-3">
          <h3>{repoInfo.full_name}</h3>
          <p>{repoInfo.description}</p>
          <a href={repoInfo.html_url} target="_blank" rel="noopener noreferrer">
            View Repository
          </a>
          <br />
          <a href={repoInfo.owner.html_url} target="_blank" rel="noopener noreferrer">
            View Owner Profile
          </a>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board d-flex">
          {Object.entries(columns).map(([colId, issues]) => (
            <Droppable droppableId={colId} key={colId}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="kanban-column Box p-3">
                  <h2 className="f4">{colId.replace(/([A-Z])/g, " $1")}</h2>
                  {issues.map((issue, index) => (
                    <Draggable key={issue.id} draggableId={issue.id.toString()} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="kanban-card Box p-2">
                          <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
                            #{issue.number}: {issue.title}
                          </a>
                          {colId === "inProgress" && <p>Assigned to: {issue.user.login}</p>}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
