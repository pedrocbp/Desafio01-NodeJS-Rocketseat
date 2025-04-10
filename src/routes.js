import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()
export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
          const { search } = req.query
    
          const tasks = database.select('tasks', search ? {
            title: search,
            descriptor: search
          } : null)
    
          return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
          const { title, descriptor } = req.body
    
          const task = {
            id: randomUUID(),
            title,
            descriptor,
          }
    
          database.insert('tasks', task)
    
          return res.writeHead(201).end()
        }
    },

]