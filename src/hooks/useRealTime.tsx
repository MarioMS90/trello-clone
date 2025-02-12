'use client';

import { createClient } from '@/lib/supabase/client';
import { TPublicSchema } from '@/types/types';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useEffect } from 'react';

type TPayload = RealtimePostgresChangesPayload<{ [key: string]: any }>;

export function useRealtime({
  table,
  onInsert,
  onUpdate,
  onDelete,
}: {
  table: keyof TPublicSchema['Tables'];
  onInsert: (payload: TPayload) => void;
  onUpdate: (payload: TPayload) => void;
  onDelete: (payload: TPayload) => void;
}) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`schema-${table}-changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, payload => {
        if (payload.eventType === 'INSERT') {
          onInsert(payload);
        }

        if (payload.eventType === 'UPDATE') {
          onUpdate(payload);
        }

        if (payload.eventType === 'DELETE') {
          onDelete(payload);
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [table, onInsert, onUpdate, onDelete]);
}
