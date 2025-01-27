import React, { useState, useEffect } from 'react';
    import './index.css';

    function App() {
      const [isLoggedIn, setIsLoggedIn] = useState(false);
      const [tasks, setTasks] = useState([]);
      const [newTask, setNewTask] = useState('');
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [currentUser, setCurrentUser] = useState(null);
      const [isRegistering, setIsRegistering] = useState(false);
      const [registerUsername, setRegisterUsername] = useState('');
      const [registerPassword, setRegisterPassword] = useState('');

      // テストユーザーを追加
      const testUsers = [
        { username: 'test', password: 'test' },
        { username: 'testuser2', password: 'password2' },
      ];

      useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
        }
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      }, []);

      useEffect(() => {
        if (isLoggedIn && currentUser) {
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
          localStorage.removeItem('currentUser');
        }
      }, [isLoggedIn, currentUser]);


      useEffect(() => {
        if (isLoggedIn) {
          localStorage.setItem('tasks', JSON.stringify(tasks));
        } else {
          localStorage.removeItem('tasks');
        }
      }, [tasks, isLoggedIn]);


      const handleLogin = () => {
        // ローカルストレージからユーザーを取得
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        // テストユーザーとローカルストレージのユーザーを結合
        const allUsers = [...testUsers, ...storedUsers];
        const user = allUsers.find(u => u.username === username && u.password === password);
        if (user) {
          setIsLoggedIn(true);
          setCurrentUser(user);
          setUsername('');
          setPassword('');
        } else {
          alert('Invalid username or password');
        }
      };

      const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
      };

      const handleAddTask = () => {
        if (newTask.trim()) {
          setTasks([...tasks, { text: newTask, completed: false, userId: currentUser.username }]);
          setNewTask('');
        }
      };

      const handleCompleteTask = (index) => {
        const newTasks = [...tasks];
        newTasks[index].completed = !newTasks[index].completed;
        setTasks(newTasks);
      };

      const handleDeleteTask = (index) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
      };

      const handleRegister = () => {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        if (storedUsers.find(u => u.username === registerUsername)) {
          alert('Username already exists');
          return;
        }
        const newUser = { username: registerUsername, password: registerPassword };
        localStorage.setItem('users', JSON.stringify([...storedUsers, newUser]));
        alert('Registration successful. Please log in.');
        setIsRegistering(false);
        setRegisterUsername('');
        setRegisterPassword('');
      };


      if (!isLoggedIn) {
        return (
          <div className="login-container">
            {isRegistering ? (
              <div className="auth-card">
                <h2>Register</h2>
                <input
                  type="text"
                  placeholder="Username"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
                <button onClick={handleRegister}>Register</button>
                <button onClick={() => setIsRegistering(false)}>Back to Login</button>
              </div>
            ) : (
              <div className="auth-card">
                <h2>Login</h2>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                <button onClick={() => setIsRegistering(true)}>Register</button>
              </div>
            )}
          </div>
        );
      }

      return (
        <div className="app-container">
          <header>
            <h1>Task Management App</h1>
            <button onClick={handleLogout}>Logout</button>
          </header>

          <div className="task-input">
            <input
              type="text"
              placeholder="Add new task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={handleAddTask}>Add Task</button>
          </div>

          <ul className="task-list">
            {tasks.filter(task => task.userId === currentUser.username).map((task, index) => (
              <li key={index} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleCompleteTask(index)}
                />
                <span className="task-text">{task.text}</span>
                <button className="delete-button" onClick={() => handleDeleteTask(index)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    export default App;
