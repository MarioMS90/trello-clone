import { z } from 'zod';

const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Name must be a string.',
    required_error: 'Name is required.',
  }),
  createdAt: z.string(),
});

const BoardSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Name must be a string.',
    required_error: 'Name is required.',
  }),
  marked: z.boolean(),
  workspaceId: z.string(),
  createdAt: z.string(),
});

export const CreateWorkspaceSchema = WorkspaceSchema.omit({ id: true, createdAt: true });
export const CreateBoardSchema = BoardSchema.omit({ id: true, marked: true, createdAt: true });
