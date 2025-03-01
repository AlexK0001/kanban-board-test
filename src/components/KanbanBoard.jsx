import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask } from "../store/tasksSlice.js";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid"; // Генератор унікальних ID
import { Button, Input, Select } from "antd"; // Використовуємо Ant Design

const { Option } = Select;

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const { tasks, columns } = useSelector((state) => state.tasks);
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("todo");

  const handleAddTask = () => {
    if (!taskTitle.trim()) return;
    const id = uuidv4();
    dispatch(addTask({ id, title: taskTitle, columnId: selectedColumn }));
    setTaskTitle(""); // Очищаємо поле після додавання
  };

  return (
    <div>
      {/* Форма додавання задачі */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Input
          placeholder="Назва задачі"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          style={{ width: "40%" }}
        />
        <Select
          value={selectedColumn}
          onChange={setSelectedColumn}
          style={{ width: "20%" }}
        >
          {Object.values(columns).map((col) => (
            <Option key={col.id} value={col.id}>{col.title}</Option>
          ))}
        </Select>
        <Button type="primary" onClick={handleAddTask}>
          Додати задачу
        </Button>
      </div>

      {/* Kanban-дошка */}
      <div className="kanban-board">
        {Object.values(columns).map((column) => (
          <div key={column.id} className="kanban-column">
            <h2>{column.title}</h2>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {column.taskIds.map((taskId, index) => {
                    const task = tasks.find((t) => t.id === taskId);
                    return (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="kanban-card"
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
    </div>
  );
};

export default KanbanBoard;
