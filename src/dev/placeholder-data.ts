import { Tables } from '@/modules/common/types/database-types';
import { LexoRank } from 'lexorank';

const workspaces: Omit<Tables<'workspaces'>, 'updated_at'>[] = [
  {
    id: crypto.randomUUID(),
    name: 'Example workspace',
    created_at: new Date(new Date().getTime() - 2000).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Work',
    created_at: new Date(new Date().getTime() - 1000).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Other workspace',
    created_at: new Date().toISOString(),
  },
];

const members: Omit<Tables<'members'>, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    user_id: 'b5f2b58b-d973-4102-98bb-26543067da41',
    workspace_id: workspaces[0].id,
    role: 'admin',
  },
  {
    user_id: 'a5145c04-b2de-4110-bb61-fe4b3e8809c2',
    workspace_id: workspaces[0].id,
    role: 'member',
  },

  {
    user_id: 'b5f2b58b-d973-4102-98bb-26543067da41',
    workspace_id: workspaces[1].id,
    role: 'admin',
  },
  {
    user_id: 'a5145c04-b2de-4110-bb61-fe4b3e8809c2',
    workspace_id: workspaces[1].id,
    role: 'member',
  },
  {
    user_id: 'ab9d9743-4c35-4195-a2fa-b274ff706bc6',
    workspace_id: workspaces[1].id,
    role: 'member',
  },

  {
    user_id: 'a5145c04-b2de-4110-bb61-fe4b3e8809c2',
    workspace_id: workspaces[2].id,
    role: 'admin',
  },
  {
    user_id: 'ab9d9743-4c35-4195-a2fa-b274ff706bc6',
    workspace_id: workspaces[2].id,
    role: 'member',
  },
];

const boards: Omit<Tables<'boards'>, 'updated_at'>[] = [
  {
    id: '0e88de62-4c0a-4696-83d8-952fcde1dee4',
    name: 'My board',
    workspace_id: workspaces[0].id,
    created_at: new Date(new Date().getTime() - 3000).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Another board',
    workspace_id: workspaces[0].id,
    created_at: new Date(new Date().getTime() - 2000).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Mario',
    workspace_id: workspaces[0].id,
    created_at: new Date(new Date().getTime() - 1000).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Work board',
    workspace_id: workspaces[1].id,
    created_at: new Date(new Date().getTime() - 1000).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Not my board',
    workspace_id: workspaces[2].id,
    created_at: new Date(new Date().getTime() - 3000).toISOString(),
  },
];

const starredBoards: Omit<
  Tables<'starred_boards'>,
  'id' | 'created_at' | 'workspace_id' | 'updated_at'
>[] = [
  {
    user_id: 'b5f2b58b-d973-4102-98bb-26543067da41',
    board_id: boards[0].id,
  },
];

const listsData: Omit<Tables<'lists'>, 'rank' | 'created_at' | 'workspace_id' | 'updated_at'>[] = [
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
let listsRank = LexoRank.middle();
const lists = listsData.map(list => {
  listsRank = listsRank.genNext();
  return { ...list, rank: listsRank.format() };
});

const cardsData: Omit<Tables<'cards'>, 'rank' | 'created_at' | 'workspace_id' | 'updated_at'>[] = [
  {
    id: crypto.randomUUID(),
    name: 'Card with description',
    description: 'This is the description',
    list_id: lists[0].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Card 2',
    description: '',
    list_id: lists[0].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Empty card',
    description: '',
    list_id: lists[0].id,
  },
  {
    id: crypto.randomUUID(),
    name: 'Test 1',
    description: 'This is a test card',
    list_id: lists[2].id,
  },
];
let cardsRank = LexoRank.middle();
const cards = cardsData.map(card => {
  cardsRank = cardsRank.genNext();
  return { ...card, rank: cardsRank.format() };
});

export { workspaces, members, boards, lists, cards, starredBoards };
