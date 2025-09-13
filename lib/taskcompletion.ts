```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from 'mongodb';
import Joi from 'joi';
import pino from 'pino';

const logger = pino({ level: 'info' });

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  dueDate: Joi.date().optional(),
  completed: Joi.boolean().required(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { db } = await connectToDatabase();
  const { taskId } = req.query;

  if (!ObjectId.isValid(taskId as string)) {
    logger.error('Invalid task ID');
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const { error, value } = taskSchema.validate(req.body);
  if (error) {
    logger.error('Validation error', error.details);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const taskCollection = db.collection('tasks');
    const task = await taskCollection.findOne({ _id: new ObjectId(taskId as string) });

    if (!task) {
      logger.error('Task not found');
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await taskCollection.findOneAndUpdate(
      { _id: new ObjectId(taskId as string) },
      { $set: value },
      { returnDocument: 'after' }
    );

    if (value.completed) {
      const tasks = await taskCollection.find().sort({ completed: 1 }).toArray();
      logger.info('Tasks reordered after completion');
      return res.status(200).json(tasks);
    }

    logger.info('Task updated successfully');
    return res.status(200).json(updatedTask.value);
  } catch (err) {
    logger.error('Database error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
```