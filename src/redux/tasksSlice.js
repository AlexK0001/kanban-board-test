import { createSlice } from "@reduxjs/toolkit";

// Отримуємо збережені дані з localStorage
const loadState = () => {
  const savedState = localStorage.getItem("kanbanState");
  return savedState ? JSON.parse(savedState) : null;
};

// Початковий стан (якщо немає в localStorage)
const initialState = loadState() || {
    tasks: [],
    columns: {
      "todo": { id: "todo", title: "To Do", taskIds: [] },
      "inProgress": { id: "inProgress", title: "In Progress", taskIds: [] },
      "done": { id: "done", title: "Done", taskIds: [] }
    }
  };

// Збереження стану в localStorage
const saveState = (state) => {
  localStorage.setItem("kanbanState", JSON.stringify(state));
};

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
      addTask: (state, action) => {
        const { id, title, columnId } = action.payload;
        state.tasks.push({ id, title });
        state.columns[columnId].taskIds.push(id);
        saveState(state);
    },
    moveTask: (state, action) => {
      const { taskId, sourceColumnId, destColumnId, destIndex } = action.payload;

      // Видаляємо з попередньої колонки
      state.columns[sourceColumnId].taskIds = state.columns[sourceColumnId].taskIds.filter(id => id !== taskId);

      // Додаємо до нової колонки на відповідне місце
      state.columns[destColumnId].taskIds.splice(destIndex, 0, taskId);
      
      saveState(state);
    },
    setTasks: (state, action) => {
      state.tasks = action.payload.tasks;
      state.columns = action.payload.columns;
      saveState(state);
    }
  }
});

export const { addTask, moveTask, setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
