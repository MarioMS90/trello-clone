const workspaces = [
  {
    id: 'a0a3a1c4-ac37-4409-8017-6b50bf664a45',
    name: 'Mario workspace',
  },
  {
    id: '6c171c01-12ce-42a4-896a-0a0aaf2a6e96',
    name: 'Work',
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
];

const boards = [
  {
    id: '0591635f-4e17-4359-9fd4-efd9f503dd10',
    name: 'My board',
    starred: true,
    id_workspace: workspaces[0].id,
  },

  {
    id: '9082c91b-a212-4757-8793-be3bd94e02ec',
    name: 'Another board',
    starred: false,
    id_workspace: workspaces[0].id,
  },
  {
    id: '64ac3b47-2fcd-490a-a346-5fd5273b60d5',
    name: 'Work board',
    starred: false,
    id_workspace: workspaces[1].id,
  },
];

const taskLists = [
  {
    id: 'd3359f1a-b494-43aa-89e6-7a0f77cd8191',
    name: 'To do',
    board_id: boards[0].id,
  },
  {
    id: 'a049c5b1-5d8f-4668-ae3c-06257cdd3ef2',
    name: 'In progress',
    board_id: boards[0].id,
  },
  {
    id: '20a94cb7-1a9b-4462-8376-6e5638de5bf4',
    name: 'Done',
    board_id: boards[0].id,
  },
];

const taks = [
  {
    id: '9491da5d-7687-4b54-a189-82cf4586e86b',
    name: 'Task 1',
    description: 'This is the first task',
    task_list_id: taskLists[0].id,
  },
  {
    id: '2e52591b-4102-4db7-9746-1f638dfc178f',
    name: 'Task 2',
    description: 'This is the second task',
    task_list_id: taskLists[1].id,
  },
];

const comments = [
  {
    id: 'b15248d1-c3c7-4147-90df-70880a005596',
    content: 'This is a comment',
    user_id: '746a5280-bcc3-4a23-842f-be2ec0334e90',
    task_id: taks[0].id,
  },
  {
    id: '5be9ed47-c9bc-4223-90cc-0324f8ccf868',
    content: 'This is the second comment',
    user_id: '746a5280-bcc3-4a23-842f-be2ec0334e90',
    task_id: taks[0].id,
  },
];

export { workspaces, userWorkspace, boards, taskLists, taks, comments };
