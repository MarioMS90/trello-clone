const workspaces = [
  {
    id: crypto.randomUUID(),
    name: 'Mario workspace',
    created_at: new Date(new Date().getTime() - 2000).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Work',
    created_at: new Date(new Date().getTime() - 1000).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Not Mario workspace',
    created_at: new Date().toISOString(),
  },
];

const userWorkspace = [
  {
    user_id: '746a5280-bcc3-4a23-842f-be2ec0334e90',
    workspace_id: workspaces[0].id,
  },
  {
    user_id: '746a5280-bcc3-4a23-842f-be2ec0334e90',
    workspace_id: workspaces[1].id,
  },
  {
    user_id: 'ebd8b7ae-b4ee-4ba5-b80c-f46a4a495840',
    workspace_id: workspaces[2].id,
  },
];

const boards = [
  {
    id: crypto.randomUUID(),
    name: 'My board',
    starred: true,
    workspace_id: workspaces[0].id,
    created_at: new Date(new Date().getTime() - 3000).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Another board',
    starred: false,
    workspace_id: workspaces[0].id,
    created_at: new Date(new Date().getTime() - 2000).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Mario',
    starred: false,
    workspace_id: workspaces[0].id,
    created_at: new Date(new Date().getTime() - 1000).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Work board',
    starred: false,
    workspace_id: workspaces[1].id,
    created_at: new Date(new Date().getTime() - 1000).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Not my board',
    starred: false,
    workspace_id: workspaces[2].id,
    created_at: new Date(new Date().getTime() - 3000).toISOString(),
  },
];

const taskLists = [
  {
    id: crypto.randomUUID(),
    name: 'To do',
    board_id: boards[0].id,
    order: 'a',
  },
  {
    id: crypto.randomUUID(),
    name: 'In progress',
    board_id: boards[0].id,
    order: 'b',
  },
  {
    id: crypto.randomUUID(),
    name: 'Done',
    board_id: boards[0].id,
    order: 'c',
  },
  {
    id: crypto.randomUUID(),
    name: 'Not my task list',
    board_id: boards[3].id,
    order: 'a',
  },
];

const tasks = [
  {
    id: crypto.randomUUID(),
    name: 'Task 1',
    description: 'This is the first task',
    task_list_id: taskLists[0].id,
    order: 'a',
  },
  {
    id: crypto.randomUUID(),
    name: 'Task 2',
    description: 'This is the second task',
    task_list_id: taskLists[0].id,
    order: 'b',
  },
  {
    id: crypto.randomUUID(),
    name: 'Mario',
    description: 'This is the third task',
    task_list_id: taskLists[0].id,
    order: 'c',
  },
  {
    id: crypto.randomUUID(),
    name: 'Task 1',
    description: 'This is the first task in progress',
    task_list_id: taskLists[1].id,
    order: 'a',
  },
];

const comments = [
  {
    id: crypto.randomUUID(),
    content: 'This is a comment',
    user_id: '746a5280-bcc3-4a23-842f-be2ec0334e90',
    task_id: tasks[0].id,
  },
  {
    id: crypto.randomUUID(),
    content: 'This is the second comment',
    user_id: '746a5280-bcc3-4a23-842f-be2ec0334e90',
    task_id: tasks[0].id,
  },
];

export { workspaces, userWorkspace, boards, taskLists, tasks, comments };
