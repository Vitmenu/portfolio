BEGIN;

ALTER TABLE public.user RENAME COLUMN image_url TO image_key; 
ALTER TABLE public.mesg RENAME COLUMN image_url TO image_key; 
ALTER TABLE public.conv RENAME COLUMN image_url TO image_key;

END;