export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      board: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          starred: boolean;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          starred?: boolean;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          starred?: boolean;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'board_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
        ];
      };
      board_list: {
        Row: {
          board_id: string;
          created_at: string;
          id: string;
          name: string;
          rank: string;
        };
        Insert: {
          board_id: string;
          created_at?: string;
          id?: string;
          name: string;
          rank: string;
        };
        Update: {
          board_id?: string;
          created_at?: string;
          id?: string;
          name?: string;
          rank?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'task_list_board_id_fkey';
            columns: ['board_id'];
            isOneToOne: false;
            referencedRelation: 'board';
            referencedColumns: ['id'];
          },
        ];
      };
      card: {
        Row: {
          board_list_id: string;
          created_at: string;
          description: string;
          id: string;
          name: string;
          rank: string | null;
        };
        Insert: {
          board_list_id?: string;
          created_at?: string;
          description: string;
          id?: string;
          name: string;
          rank?: string | null;
        };
        Update: {
          board_list_id?: string;
          created_at?: string;
          description?: string;
          id?: string;
          name?: string;
          rank?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'card_board_list_id_fkey';
            columns: ['board_list_id'];
            isOneToOne: false;
            referencedRelation: 'board_list';
            referencedColumns: ['id'];
          },
        ];
      };
      comment: {
        Row: {
          card_id: string;
          content: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          card_id: string;
          content: string;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          card_id?: string;
          content?: string;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'comment_card_id_fkey';
            columns: ['card_id'];
            isOneToOne: false;
            referencedRelation: 'card';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comment_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['id'];
          },
        ];
      };
      user: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
          name: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      user_workspace: {
        Row: {
          role: Database['public']['Enums']['role'];
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          role?: Database['public']['Enums']['role'];
          user_id: string;
          workspace_id: string;
        };
        Update: {
          role?: Database['public']['Enums']['role'];
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_workspace_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_workspace_workspace_id_fkey';
            columns: ['workspace_id'];
            isOneToOne: false;
            referencedRelation: 'workspace';
            referencedColumns: ['id'];
          },
        ];
      };
      workspace: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_workspace_id: {
        Args: {
          board_id_param: string;
        };
        Returns: string;
      };
      search_workspaces_boards_cards: {
        Args: {
          search_term: string;
        };
        Returns: {
          kind: Database['public']['Enums']['kind_search'];
          id: string;
          name: string;
          workspace: string;
          board: string;
          list: string;
        }[];
      };
      user_has_workspace_access: {
        Args: {
          workspace_id_param: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      kind_search: 'workspace' | 'board' | 'card';
      role: 'admin' | 'member';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
