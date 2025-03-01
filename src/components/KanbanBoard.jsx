import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { moveTask } from "../redux/tasksSlice";

const KanbanBoard = () => {
  const { columns, tasks } = useSelector((state) => state.tasks); // Отримуємо стан Redux
  const dispatch = useDispatch();

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    dispatch(
      moveTask({
        taskId: draggableId,
        sourceColumnId: source.droppableId,
        destColumnId: destination.droppableId,
        destIndex: destination.index,
      })
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board">
        {Object.values(columns).map((column) => (
          <div key={column.id} className="kanban-column">
            <h3>{column.title}</h3>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="task-list">
                  {column.taskIds.map((taskId, index) => {
                    const task = tasks.find((t) => t.id === taskId);
                    return (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="task-item"
                          >
                            {task.title}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
