import * as z from "zod"
import { tasks } from "./schema"

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  title: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
})

export const getTasksSchema = searchParamsSchema

export type GetTasksSchema = z.infer<typeof getTasksSchema>

export const createTaskSchema = z.object({
  title: z.string(),
  label:  z.any().optional(),
  status:  z.any().optional(),
  priority:  z.any().optional(),
})

export type CreateTaskSchema = z.infer<typeof createTaskSchema>

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  label: z.any().optional(),
  status: z.any().optional(),
  priority: z.any().optional(),

})

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>
