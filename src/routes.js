import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();
export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;
      const now = new Date();

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: now,
        updated_at: null,
        completed_at: null,
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.select("tasks").find(task => task.id === id);

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ message: `Task não encontrada` }))
      }

      database.delete("tasks", id);

      return res.writeHead(200).end(JSON.stringify({ message: `Task ${id} excluida com sucesso!`}));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;
      const now = new Date();

      if (!title && !description) {
        return res.writeHead(404).end(JSON.stringify({ message: "É necessário informar pelo menos um dos campos."}))
      }

      const task = database.select("tasks").find(task => task.id === id);

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ message: "Task não encontrada" }));
      }

      const data = {
        updated_at: now,
      };
    
      if (title) data.title = title;
      if (description) data.description = description;
    
      database.update("tasks", id, data);
    
      return res.writeHead(200).end(JSON.stringify({ message: `Task ${id} atualizada com sucesso!`}));
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      const now = new Date();

      const task = database.select("tasks").find(task => task.id === id);

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ message: "Task não encontrada" }));
      }

      const isTaskCompleted = !!task.completed_at
      const completed_at = isTaskCompleted ? null : new Date()

      database.update('tasks', id, { completed_at })

      return res.writeHead(200).end(JSON.stringify({ message: `Task ${id} concluída!`}))
    }
  }
];
