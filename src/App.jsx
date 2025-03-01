import React from "react";
import KanbanBoard from "./components/KanbanBoard";
import "../src/App";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Оновлюємо стан при виникненні помилки
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Логування помилки (можна замінити на логування в сервіс)
    console.error('Помилка:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Рендеримо запасний UI при помилці
      return <h1>Щось пішло не так.</h1>;
    }

    // Рендеримо дочірні компоненти, якщо немає помилки
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <h1>GitHub Issues Kanban Board</h1>
        <KanbanBoard />
      </div>
    </ErrorBoundary>
  );
}

export default App;
