

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






CREATE SCHEMA IF NOT EXISTS "private";


ALTER SCHEMA "private" OWNER TO "postgres";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."kind_search" AS ENUM (
    'workspace',
    'board',
    'card'
);


ALTER TYPE "public"."kind_search" OWNER TO "postgres";


CREATE TYPE "public"."role" AS ENUM (
    'admin',
    'member'
);


ALTER TYPE "public"."role" OWNER TO "postgres";


CREATE TYPE "public"."visibility" AS ENUM (
    'private',
    'public'
);


ALTER TYPE "public"."visibility" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "private"."user_has_workspace_access"("workspace_id_param" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.members m
        WHERE m.workspace_id = workspace_id_param 
          AND m.user_id = auth.uid()
    );
END;$$;


ALTER FUNCTION "private"."user_has_workspace_access"("workspace_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "private"."user_is_admin"("workspace_id_param" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.members m
        WHERE m.workspace_id = workspace_id_param 
          AND m.user_id = auth.uid() 
          AND m.role = 'admin'::role
    );
END;$$;


ALTER FUNCTION "private"."user_is_admin"("workspace_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_workspace_with_admin_access"("workspace_name" "text") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    new_workspace_id uuid;
    workspace_created_at timestamptz;
    workspace_updated_at timestamptz;
    new_member_id uuid;
    member_created_at timestamptz;
    member_updated_at timestamptz;
    result json;
BEGIN
    INSERT INTO public.workspaces (name)
    VALUES (workspace_name)
    RETURNING id, created_at, updated_at
    INTO new_workspace_id, workspace_created_at, workspace_updated_at;

    INSERT INTO public.members (user_id, workspace_id, role)
    VALUES (auth.uid(), new_workspace_id, 'admin')
    RETURNING id, created_at, updated_at
    INTO new_member_id, member_created_at, member_updated_at;

    result := json_build_object(
        'workspace', json_build_object(
            'id', new_workspace_id,
            'name', workspace_name,
            'createdAt', workspace_created_at,
            'updatedAt', workspace_updated_at
        ),
        'member', json_build_object(
            'id', new_member_id,
            'userId', auth.uid(),
            'workspaceId', new_workspace_id,
            'role', 'admin',
            'createdAt', member_created_at,
            'updatedAt', member_updated_at
        )
    );

    RETURN result;
END;
$$;


ALTER FUNCTION "public"."create_workspace_with_admin_access"("workspace_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_workspace_id"("board_id_param" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$DECLARE
    workspace_id uuid;
BEGIN
    SELECT b.workspace_id INTO workspace_id
    FROM public.boards b
    WHERE b.id = board_id_param;

    RETURN workspace_id;
END;$$;


ALTER FUNCTION "public"."get_workspace_id"("board_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'name');
    RETURN NEW;
END;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_workspaces_boards_cards"("search_term" "text") RETURNS TABLE("kind" "public"."kind_search", "id" "uuid", "name" "text", "workspace" "text", "board" "text", "list" "text")
    LANGUAGE "plpgsql"
    AS $$BEGIN
    RETURN QUERY
    SELECT 'workspace'::kind_search AS kind, w.id, w.name, NULL AS workspace, NULL AS board, NULL AS list
    FROM workspaces w
    WHERE w.name ILIKE '%' || search_term || '%'

    UNION ALL

    SELECT 'board'::kind_search AS kind, b.id, b.name, w.name AS workspace, NULL AS board, NULL AS list
    FROM boards b
    JOIN workspaces w ON b.workspace_id = w.id
    WHERE b.name ILIKE '%' || search_term || '%'

    UNION ALL

    SELECT 'card'::kind_search AS kind, c.id, c.name, w.name AS workspace, b.name AS board, l.name AS list
    FROM cards c
    JOIN lists l ON c.list_id = l.id
    JOIN boards b ON l.board_id = b.id
    JOIN workspaces w ON b.workspace_id = w.id
    WHERE c.name ILIKE '%' || search_term || '%';
END;$$;


ALTER FUNCTION "public"."search_workspaces_boards_cards"("search_term" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_workspace_id_for_card"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
    SELECT workspace_id INTO NEW.workspace_id
    FROM public.lists
    WHERE id = NEW.list_id;

    RETURN NEW;
END;$$;


ALTER FUNCTION "public"."set_workspace_id_for_card"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_workspace_id_for_comment"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
    SELECT workspace_id INTO NEW.workspace_id
    FROM public.cards
    WHERE id = NEW.card_id;

    RETURN NEW;
END;$$;


ALTER FUNCTION "public"."set_workspace_id_for_comment"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_workspace_id_for_list"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
    SELECT workspace_id INTO NEW.workspace_id
    FROM public.boards
    WHERE id = NEW.board_id;

    RETURN NEW;
END;$$;


ALTER FUNCTION "public"."set_workspace_id_for_list"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_workspace_id_for_starred_board"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
    SELECT workspace_id INTO NEW.workspace_id
    FROM public.boards
    WHERE id = NEW.board_id;

    RETURN NEW;
END;$$;


ALTER FUNCTION "public"."set_workspace_id_for_starred_board"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at := now();  -- Set updated_at to the current timestamp
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."boards" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."boards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cards" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "list_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "rank" character varying NOT NULL,
    "workspace_id" "uuid",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."cards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lists" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "board_id" "uuid" NOT NULL,
    "rank" character varying NOT NULL,
    "workspace_id" "uuid",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."lists" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."members" (
    "user_id" "uuid" NOT NULL,
    "workspace_id" "uuid" NOT NULL,
    "role" "public"."role" DEFAULT 'admin'::"public"."role" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."starred_boards" (
    "user_id" "uuid" NOT NULL,
    "board_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workspace_id" "uuid",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."starred_boards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "email" character varying NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workspaces" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."workspaces" OWNER TO "postgres";


ALTER TABLE ONLY "public"."boards"
    ADD CONSTRAINT "board_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."boards"
    ADD CONSTRAINT "board_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("user_id", "workspace_id");



ALTER TABLE ONLY "public"."starred_boards"
    ADD CONSTRAINT "starred_boards_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."starred_boards"
    ADD CONSTRAINT "starred_boards_pkey" PRIMARY KEY ("user_id", "board_id");



ALTER TABLE ONLY "public"."cards"
    ADD CONSTRAINT "task_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."lists"
    ADD CONSTRAINT "task_list_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."lists"
    ADD CONSTRAINT "task_list_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cards"
    ADD CONSTRAINT "task_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."starred_boards"
    ADD CONSTRAINT "unique_user_board" UNIQUE ("user_id", "board_id");



ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "unique_user_workspace" UNIQUE ("user_id", "workspace_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "user_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "user_workspaces_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."workspaces"
    ADD CONSTRAINT "workspace_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."workspaces"
    ADD CONSTRAINT "workspace_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "set_workspace_id_for_card" BEFORE INSERT ON "public"."cards" FOR EACH ROW EXECUTE FUNCTION "public"."set_workspace_id_for_card"();



CREATE OR REPLACE TRIGGER "set_workspace_id_for_list" BEFORE INSERT ON "public"."lists" FOR EACH ROW EXECUTE FUNCTION "public"."set_workspace_id_for_list"();



CREATE OR REPLACE TRIGGER "set_workspace_id_for_starred_board" BEFORE INSERT ON "public"."starred_boards" FOR EACH ROW EXECUTE FUNCTION "public"."set_workspace_id_for_starred_board"();



CREATE OR REPLACE TRIGGER "update_boards_updated_at" BEFORE UPDATE ON "public"."boards" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_cards_updated_at" BEFORE UPDATE ON "public"."cards" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_lists_updated_at" BEFORE UPDATE ON "public"."lists" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_members_updated_at" BEFORE UPDATE ON "public"."members" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_starred_boards_updated_at" BEFORE UPDATE ON "public"."starred_boards" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "update_workspaces_updated_at" BEFORE UPDATE ON "public"."workspaces" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



ALTER TABLE ONLY "public"."boards"
    ADD CONSTRAINT "board_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cards"
    ADD CONSTRAINT "card_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cards"
    ADD CONSTRAINT "cards_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lists"
    ADD CONSTRAINT "lists_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "roles_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."starred_boards"
    ADD CONSTRAINT "starred_boards_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lists"
    ADD CONSTRAINT "task_list_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."starred_boards"
    ADD CONSTRAINT "user_board_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."starred_boards"
    ADD CONSTRAINT "user_board_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "user_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Allow users to delete their own records" ON "public"."users" FOR DELETE TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Allow users to update their own records" ON "public"."users" FOR UPDATE TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (true);



CREATE POLICY "Allow users to view other users in the same workspace" ON "public"."users" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."workspaces" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Only admins can delete role records" ON "public"."members" FOR DELETE TO "authenticated" USING ("private"."user_is_admin"("workspace_id"));



CREATE POLICY "Only admins can delete workspaces" ON "public"."workspaces" FOR DELETE TO "authenticated" USING ("private"."user_is_admin"("id"));



CREATE POLICY "Only admins can insert role records" ON "public"."members" FOR INSERT TO "authenticated" WITH CHECK ("private"."user_is_admin"("workspace_id"));



CREATE POLICY "Only admins can update role records" ON "public"."members" FOR UPDATE TO "authenticated" USING ("private"."user_is_admin"("workspace_id")) WITH CHECK ("private"."user_is_admin"("workspace_id"));



CREATE POLICY "Only admins can update workspaces" ON "public"."workspaces" FOR UPDATE TO "authenticated" USING ("private"."user_is_admin"("id"));



CREATE POLICY "User can view their own role" ON "public"."members" FOR SELECT TO "authenticated" USING ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can delete their own boards" ON "public"."boards" FOR DELETE TO "authenticated" USING ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can delete their own cards" ON "public"."cards" FOR DELETE TO "authenticated" USING ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can delete their own lists" ON "public"."lists" FOR DELETE TO "authenticated" USING ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can delete their own starred boards" ON "public"."starred_boards" FOR DELETE TO "authenticated" USING ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can insert their own boards" ON "public"."boards" FOR INSERT TO "authenticated" WITH CHECK ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can insert their own cards" ON "public"."cards" FOR INSERT TO "authenticated" WITH CHECK ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can insert their own lists" ON "public"."lists" FOR INSERT TO "authenticated" WITH CHECK ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can insert their own starred boards" ON "public"."starred_boards" FOR INSERT TO "authenticated" WITH CHECK ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can update their own boards" ON "public"."boards" FOR UPDATE TO "authenticated" USING ("private"."user_has_workspace_access"("workspace_id")) WITH CHECK ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can update their own cards" ON "public"."cards" FOR UPDATE TO "authenticated" USING ("private"."user_has_workspace_access"("workspace_id")) WITH CHECK ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can update their own lists" ON "public"."lists" FOR UPDATE TO "authenticated" USING ("private"."user_has_workspace_access"("workspace_id")) WITH CHECK ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can update their own starred boards" ON "public"."starred_boards" FOR UPDATE TO "authenticated" USING ("private"."user_has_workspace_access"("workspace_id")) WITH CHECK ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can view their own boards" ON "public"."boards" FOR SELECT TO "authenticated" USING ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can view their own cards" ON "public"."cards" FOR SELECT TO "authenticated" USING ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can view their own lists" ON "public"."lists" FOR SELECT TO "authenticated" USING ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can view their own starred boards" ON "public"."starred_boards" FOR SELECT TO "authenticated" USING ("private"."user_has_workspace_access"("workspace_id"));



CREATE POLICY "Users can view their own workspaces" ON "public"."workspaces" FOR SELECT TO "authenticated" USING ("private"."user_has_workspace_access"("id"));



ALTER TABLE "public"."boards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lists" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."starred_boards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workspaces" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."boards";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."cards";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."lists";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."members";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."starred_boards";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."users";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."workspaces";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."create_workspace_with_admin_access"("workspace_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_workspace_with_admin_access"("workspace_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_workspace_with_admin_access"("workspace_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_workspace_id"("board_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_workspace_id"("board_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_workspace_id"("board_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."search_workspaces_boards_cards"("search_term" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."search_workspaces_boards_cards"("search_term" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_workspaces_boards_cards"("search_term" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_workspace_id_for_card"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_workspace_id_for_card"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_workspace_id_for_card"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_workspace_id_for_comment"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_workspace_id_for_comment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_workspace_id_for_comment"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_workspace_id_for_list"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_workspace_id_for_list"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_workspace_id_for_list"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_workspace_id_for_starred_board"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_workspace_id_for_starred_board"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_workspace_id_for_starred_board"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."boards" TO "anon";
GRANT ALL ON TABLE "public"."boards" TO "authenticated";
GRANT ALL ON TABLE "public"."boards" TO "service_role";



GRANT ALL ON TABLE "public"."cards" TO "anon";
GRANT ALL ON TABLE "public"."cards" TO "authenticated";
GRANT ALL ON TABLE "public"."cards" TO "service_role";



GRANT ALL ON TABLE "public"."lists" TO "anon";
GRANT ALL ON TABLE "public"."lists" TO "authenticated";
GRANT ALL ON TABLE "public"."lists" TO "service_role";



GRANT ALL ON TABLE "public"."members" TO "anon";
GRANT ALL ON TABLE "public"."members" TO "authenticated";
GRANT ALL ON TABLE "public"."members" TO "service_role";



GRANT ALL ON TABLE "public"."starred_boards" TO "anon";
GRANT ALL ON TABLE "public"."starred_boards" TO "authenticated";
GRANT ALL ON TABLE "public"."starred_boards" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."workspaces" TO "anon";
GRANT ALL ON TABLE "public"."workspaces" TO "authenticated";
GRANT ALL ON TABLE "public"."workspaces" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
