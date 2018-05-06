SELECT
    a.id AS ATHLETE_ID,
    ai.firstname AS FNAME,
    ai.lastname AS LNAME,
    ai.email AS EMAIL,
    'https://www.strafforts.com/athletes/' || a.id AS URL,
    'https://www.strava.com/athletes/' || a.id AS STRAVA_URL,
    to_char(a.created_at, 'YYYY/MM/DD') AS DATE_CREATED,
    to_char(a.last_active_at, 'YYYY/MM/DD') AS LAST_LOGIN
FROM public.athletes AS a
JOIN public.athlete_infos AS ai on a.id = ai.athlete_id
