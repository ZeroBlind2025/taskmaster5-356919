```tsx
import React from 'react';
import { format } from 'date-fns';

interface Task {
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
}

interface TaskDetailProps {
  task: Task;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task }) => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="w-full p-4">
          <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
          {task.description && (
            <p className="mt-2 text-gray-600">{task.description}</p>
          )}
          {task.dueDate && (
            <p className="mt-2 text-gray-500">
              Due Date: {format(new Date(task.dueDate), 'PPP')}
            </p>
          )}
          <p
            className={`mt-2 ${
              task.completed ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {task.completed ? 'Completed' : 'Pending'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
```