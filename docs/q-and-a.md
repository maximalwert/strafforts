# Strafforts - Q&As

## Strava's estimated best efforts can be unreliable, would this app correct them?

Unfortunately no.

Even though technically that is totally achievable,
it's against the purpose of having this "Strava Estimated Best Efforts" visualizer.
This app was designed to fetch and visualize the best efforts data on Strava (i.e. those trophies actually on activities),
instead of implement an algorithm to calculate athletes' best efforts based on Strava activities.

If one athlete doesn't have '1st best efforts' for 5k distance on Strava,
Strafforts shouldn't show it here either.
Because "Strava Estimated Best Efforts" is a term that was created and defined by Strava,
any data shown in this app should be consistent with such data on Strava.

If someone wants to create an app to analyze something similar,
it would be wise to use another terminology that won't be confused with "Strava Estimated Best Efforts",
like for example, "Strava Running PBs".

However, if you notice some messed up estimated best efforts within Strafforts,
you can try go to those activities on Strava and try '[Refresh Activity Achievements][Refresh Activity Achievements]'.
Or '[Submit a request][Submit a request]' **on Strava** regarding your wrong Strava best efforts data.

## How to recalculate all best efforts?

The quick answer is - no, you can't.

Sometimes an activity was uploaded as wrong activity type,
which was so fast that created few 1st best efforts trophies.
Then the athlete realized it and changed the activity to something else.
But those 1st best efforts trophies would remain there.
All subsequent best efforts can only be '2nd best efforts'.

In order to solve this problem, Strava provides '[Refresh Activity Achievements][Refresh Activity Achievements]' tool in the UI,
which allows users to recalculate the best efforts.

However, the way it was designed is to recalculate best efforts for
**only this particular activity** based on all activities at the time when this action was taken.
It won't recalculate all best efforts on **all activities** in a timely fashion.
This means if the athlete realized the situation too late,
that there have 2nd best efforts, 3rd best efforts in other activities uploaded after this activity,
refreshing the achievements will result in nothing.
Because at the refreshing process, Strava will treat the later activities as 1st, 2nd and so on.
But since you are not refreshing those activities, best efforts on those activities won't be updated.

Say for example,
- Activity ID 11111: 5k 20 minutes, 1st best efforts for 5k
- Activity ID 22222: 5k 25 minutes, 2nd best efforts for 5k
- Activity ID 33333: 5k 21 minutes, 2nd best efforts for 5k
- Activity ID 44444: 5k 23 minutes, 3rd best efforts for 5k

Then activity 11111 was refreshed due to wrong activity type,
so there will be no more '1st best efforts' for 5k on this activity.
All other activities will remain the same too, which means there is no more '1st best efforts' on any activities.
If you refresh the achievements of 22222 now, it will become '3rd best efforts for 5k'.
Because Strava recalculates achievements based on all existing activities as of the time refreshing is done,
25 minutes is only the '3rd best efforts for 5k' now.
So athlete would never get '1st best efforts' back.

[Refresh Activity Achievements]: https://support.strava.com/hc/en-us/articles/216919597-The-Refresh-My-Achievements-Tool-
[Submit a request]: https://support.strava.com/hc/en-us/requests/new
