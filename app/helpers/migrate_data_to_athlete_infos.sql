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
