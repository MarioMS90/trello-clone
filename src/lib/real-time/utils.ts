import { TEntityName } from '@/types/db';
import { Tables } from '@/types/database-types';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import createClient from '../supabase/client';

export function getChannels() {
  const supabase = createClient();
  return supabase.getChannels();
}

export function createChannel({
  entity,
  onSubscription,
  onChanges,
}: {
  entity: TEntityName;
  onSubscription: () => void;
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
    .on('system', {}, async payload => {
      if (payload.extension !== 'postgres_changes' || payload.status !== 'ok') {
        return;
      }

      if (!initialMessageSkipped) {
        initialMessageSkipped = true;
        return;
      }

      if (previouslyDisconnected) {
        // At this point the suscription is already established
        onSubscription();
        previouslyDisconnected = false;
      }
    })
    .subscribe(status => {
      if (status === 'SUBSCRIBED') {
        previouslyDisconnected = true;
      }
    });
}
