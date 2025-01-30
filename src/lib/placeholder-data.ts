import { LexoRank } from 'lexorank';

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
    id: '0e88de62-4c0a-4696-83d8-952fcde1dee4',
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

const listsData = [
  {
    id: crypto.randomUUID(),
    name: 'To do',
    board_id: boards[0].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'In progress',
    board_id: boards[0].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Done',
    board_id: boards[0].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Not my card list',
    board_id: boards[3].id,
  },
];

let currentRank = LexoRank.middle();
const lists = listsData.map(list => {
  currentRank = currentRank.genNext();
  return { ...list, rank: currentRank.format() };
});

const cardsData = [
  {
    id: crypto.randomUUID(),
    name: 'Card 1',
    description: 'This is the first card',
    list_id: lists[0].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Card 2',
    description: 'This is the second card',
    list_id: lists[0].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Mario',
    description: 'This is the third card',
    list_id: lists[0].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Card 4',
    description: 'This is the first card',
    list_id: lists[1].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Card 5',
    description: 'This is the second card',
    list_id: lists[1].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Card 6',
    description: 'This is the third card',
    list_id: lists[1].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Card 7',
    description: 'This is the first card',
    list_id: lists[1].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Card 8',
    description: 'This is the second card',
    list_id: lists[1].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Card 9',
    description: 'This is the third card',
    list_id: lists[1].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Test 1',
    description: 'This is a test card',
    list_id: lists[2].id,
  },
];

currentRank = LexoRank.middle();
const cards = cardsData.map(card => {
  currentRank = currentRank.genNext();
  return { ...card, rank: currentRank.format() };
});

const comments = [
  {
    id: crypto.randomUUID(),
    content: 'This is a comment',
    user_id: '746a5280-bcc3-4a23-842f-be2ec0334e90',
    card_id: cards[0].id,
  },
  {
    id: crypto.randomUUID(),
    content: 'This is the second comment',
    user_id: '746a5280-bcc3-4a23-842f-be2ec0334e90',
    card_id: cards[0].id,
  },
];

export { workspaces, userWorkspace, boards, lists, cards, comments };
