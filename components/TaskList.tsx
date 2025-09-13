```tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>('/api/tasks');
        setTasks(response.data);
      } catch (err) {
        setError('Failed to load tasks');
      }
    };

    fetchTasks();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className={`p-4 border rounded-lg shadow-sm ${
              task.completed ? 'bg-green-100' : 'bg-white'
            }`}
          >
            <h2 className="text-xl font-semibold">{task.title}</h2>
            {task.description && <p className="text-gray-700">{task.description}</p>}
            {task.dueDate && (
              <p className="text-gray-500">
                Due Date: {format(new Date(task.dueDate), 'MMMM do, yyyy')}
              </p>
            )}
            <span
              className={`inline-block mt-2 px-2 py-1 text-sm rounded ${
                task.completed ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
              }`}
            >
              {task.completed ? 'Completed' : 'Pending'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
```