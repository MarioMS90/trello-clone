import { TEntityName } from '@/types/db';
import { QueryClient } from '@tanstack/react-query';
import { Tables } from '@/types/database-types';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { createClient } from '../supabase/client';

export default function createChannel({
  queryClient,
  entity,
  onChanges,
}: {
  queryClient: QueryClient;
  entity: TEntityName;
  onChanges: (payload: RealtimePostgresChangesPayload<Tables<TEntityName>>) => void;
}) {
  const supabase = createClient();

  let initialMessageSkipped = false;
  let previouslyDisconnected = true;

  return supabase
    .channel(`schema-${entity}-changes`)
    .on<Tables<TEntityName>>(
      'postgres_changes',
      { event: '*', schema: 'public', table: entity },
      payload => {
        onChanges(payload);
      },
    )
    .on('system', {}, payload => {
      if (payload.extension !== 'postgres_changes' || payload.status !== 'ok') {
        return;
      }

      if (!initialMessageSkipped) {
        initialMessageSkipped = true;
        return;
      }

      if (previouslyDisconnected) {
        queryClient.refetchQueries({ queryKey: [entity] });
        previouslyDisconnected = false;
      }
    })
    .subscribe(status => {
      if (status === 'SUBSCRIBED') {
        previouslyDisconnected = true;
      }
    });
}
