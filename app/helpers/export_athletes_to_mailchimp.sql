SELECT id AS ATHLETE_ID, firstname AS FNAME, lastname AS LNAME, email AS EMAIL, 'https://www.strafforts.com/athletes/' || id AS URL, 'https://www.strava.com/athletes/' || id AS STRAVA_URL, to_char(created_at, 'YYYY/MM/DD') AS DATE_CREATED
FROM public.athletes
