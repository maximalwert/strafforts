INSERT INTO public.athlete_infos
(
    athlete_id,
    username,
    firstname,
    lastname,
    profile_medium,
    profile,
    city_id,
    state_id,
    country_id,
    sex,
    follower_count,
    friend_count,
    athlete_type,
    date_preference,
    measurement_preference,
    email,
    weight,
    created_at,
    updated_at
)
SELECT
    id,
    username,
    firstname,
    lastname,
    profile_medium,
    profile,
    city_id,
    state_id,
    country_id,
    sex,
    follower_count,
    friend_count,
    athlete_type,
    date_preference,
    measurement_preference,
    email,
    weight,
    created_at,
    updated_at
FROM public.athletes;

UPDATE public.athlete_infos
SET created_at = '2017-01-01 00:00:00+00';

UPDATE public.athlete_infos
SET updated_at = '2017-01-01 00:00:00+00';

ALTER TABLE public.athletes
DROP COLUMN username,
DROP COLUMN firstname,
DROP COLUMN lastname,
DROP COLUMN profile_medium,
DROP COLUMN profile,
DROP COLUMN city_id,
DROP COLUMN state_id,
DROP COLUMN country_id,
DROP COLUMN sex,
DROP COLUMN follower_count,
DROP COLUMN friend_count,
DROP COLUMN athlete_type,
DROP COLUMN date_preference,
DROP COLUMN measurement_preference,
DROP COLUMN email,
DROP COLUMN weight;
