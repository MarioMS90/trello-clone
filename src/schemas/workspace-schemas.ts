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
  starred: z.boolean(),
  workspaceId: z.string(),
  createdAt: z.string(),
});

const ListSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Name must be a string.',
    required_error: 'Name is required.',
  }),
  rank: z.string(),
  boardId: z.string(),
  createdAt: z.string(),
});

const CardSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Name must be a string.',
    required_error: 'Name is required.',
  }),
  description: z.string({
    invalid_type_error: 'Name must be a string.',
  }),
  rank: z.string(),
  listId: z.string(),
  createdAt: z.string(),
});

export const CreateWorkspaceSchema = WorkspaceSchema.pick({ name: true });
export const UpdateWorkspaceSchema = WorkspaceSchema.pick({ name: true }).partial();

export const CreateBoardSchema = BoardSchema.pick({ name: true, workspaceId: true });
export const UpdateBoardSchema = BoardSchema.pick({ name: true, starred: true }).partial();

export const CreateListSchema = ListSchema.pick({ name: true, rank: true, boardId: true });
export const UpdateListSchema = ListSchema.pick({ name: true, rank: true }).partial();

export const CreateCardSchema = CardSchema.pick({ name: true, rank: true, listId: true });
export const UpdateCardSchema = CardSchema.pick({
  name: true,
  description: true,
  rank: true,
}).partial();
