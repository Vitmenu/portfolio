BEGIN;

CREATE EXTENSION IF NOT EXISTS vector;

ALTER EXTENSION vector UPDATE;

CREATE TABLE IF NOT EXISTS public.conv
(
    id uuid NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    image_key character varying COLLATE pg_catalog."default",
    created bigint NOT NULL,
    CONSTRAINT conv_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.conv_users
(
    conv_id uuid NOT NULL,
    user_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.mesg
(
    id uuid NOT NULL,
    conv_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created bigint NOT NULL,
    content character varying COLLATE pg_catalog."default",
    image_key character varying COLLATE pg_catalog."default",
    CONSTRAINT mesg_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."user"
(
    id uuid NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    image_key character varying COLLATE pg_catalog."default",
    company character varying COLLATE pg_catalog."default" NOT NULL,
    cid character varying COLLATE pg_catalog."default" NOT NULL,
    created bigint NOT NULL,
    CONSTRAINT user_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.mesg_checked_by
(
    mesg_id uuid NOT NULL,
    user_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ai_action
(
    id SERIAL PRIMARY KEY NOT NULL,
    action_id uuid NOT NULL,
    embedding vector(1536)
);

CREATE TABLE IF NOT EXISTS public.company
(
    id SERIAL PRIMARY KEY NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    key character varying COLLATE pg_catalog."default" NOT NULL,
    embedding vector(1536)
);

ALTER TABLE IF EXISTS public.conv_users
    ADD CONSTRAINT conv_users_conv_id_fkey FOREIGN KEY (conv_id)
    REFERENCES public.conv (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.conv_users
    ADD CONSTRAINT conv_users_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public."user" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.mesg
    ADD CONSTRAINT mesg_conv_id_fkey FOREIGN KEY (conv_id)
    REFERENCES public.conv (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.mesg
    ADD CONSTRAINT mesg_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public."user" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.mesg_checked_by
    ADD FOREIGN KEY (user_id)
    REFERENCES public."user" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.mesg_checked_by
    ADD FOREIGN KEY (mesg_id)
    REFERENCES public.mesg (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

END;