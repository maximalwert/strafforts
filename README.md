# Strafforts <img alt="Powered by Strava" src="vendor/assets/strava/api_logo_pwrdBy_strava_horiz_light.png" height="24">

[![GitHub release](https://img.shields.io/github/release/yizeng/strafforts.svg?style=flat-square)][GitHub Tags]
[![license](https://img.shields.io/github/license/yizeng/strafforts.svg?style=flat-square)](LICENSE)

[![Travis](https://img.shields.io/travis/yizeng/strafforts.svg?style=flat-square)][Strafforts Travis]
[![Coveralls](https://img.shields.io/coveralls/yizeng/strafforts.svg?style=flat-square)][Strafforts Coverall]
[![Code Climate](https://img.shields.io/codeclimate/github/yizeng/strafforts.svg?style=flat-square)][Strafforts Code Climate]
[![Gemnasium](https://img.shields.io/gemnasium/yizeng/strafforts.svg?style=flat-square)][Strafforts Gemnasium]

### A Visualizer for Strava Estimated Best Efforts

Strafforts is a web app that calls [Strava API][Strava API]
to fetch athletes' [estimated best efforts][Strava Support] data
and visualize them in forms of data tables, line charts and pie charts,
in such way athletes can perform some analysis like half marathon PB progression,
fastest shoes used for a 10K race, how often 5K PB gets set, etc.

Originally developed as a personal open source [Ruby console app][strava-best-efforts] just for fun,
Strafforts has now been rewritten in [Ruby on Rails][Ruby on Rails],
so that athletes can connect Strafforts with their Strava accounts and see visualized best efforts automatically.

### Demo

http://www.strafforts.com

![Strafforts Homepage Screenshot](public/screenshots/strafforts-home.jpg)
![Strafforts Overview Page Screenshot](public/screenshots/strafforts-overview.png)
![Strafforts Best Efforts View Screenshot](public/screenshots/strafforts-best-efforts-view.png)
![Strafforts Races View Screenshot](public/screenshots/strafforts-races-view.png)


### What are 'Estimated Best Efforts'?

Quoting from [Strava Support][Strava Support]:

> Estimated Best Efforts are automatically calculated using your GPS-based running activity,
  and reflect your fastest times for benchmark distances such as 1 mile, 5km, 10km, and half marathon.
  Strava can find your best effort at any point in each running activity.
  We do not require that a best effort starts at a mile split.

![Side by side Best Efforts][Side by side Best Efforts Image]
![Strava Best Efforts][Strava Best Efforts Image]


## Installation & Development

Strafforts should just work fine at http://www.strafforts.com,
that you can connect with your Strava account and view your best efforts data once they have been retrieved.

However, if you want to create your own Strafforts instance or setup it on your machine,
please follow the [installation and development guide](docs/installation-and-development-guide.md).

## Acknowledgements

See [Acknowledgements](docs/acknowledgements.md) page for a comprehensive list.

## Contributing

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square)][Strafforts Issues]
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

As I'm actually a .NET developer by day,
Strafforts is my first Ruby on Rails app that helps me learning the framework and creates something useful for analyze my running.
Since it's so amateur, surely there are so much can be improved from a Ruby developer's point view.
I will try my best to improve this and make it more useful for everyone.

Got any questions? Check out the [Q&A page](docs/q-and-a.md) first to see if it's been asked before.
If you any feature idea, or are running into problems, please raise an issue on GitHub.
If you want to make code changes, feel free to create PRs.

## License
Strafforts is a project developed and maintained by [Yi Zeng][yizeng.me], licensed under [MIT License](LICENSE).

[GitHub Tags]: https://github.com/yizeng/strafforts/tags
[Strafforts Travis]: https://travis-ci.org/yizeng/strafforts
[Strafforts Coverall]: https://coveralls.io/r/yizeng/strafforts
[Strafforts Code Climate]: https://codeclimate.com/github/yizeng/strafforts
[Strafforts Gemnasium]: https://gemnasium.com/yizeng/strafforts
[Strava API]: https://strava.github.io/api/
[Strava Support]: https://support.strava.com/hc/en-us/articles/216917127-Estimated-Best-Efforts-for-Running
[Side by side Best Efforts Image]: https://support.strava.com/attachments/token/B2NpmmMYGEVEzCJn7ZjoMFtsk/?name=Side+by+Side-+Best+Effort.png
[Strava Best Efforts Image]: https://support.strava.com/attachments/token/UJw9NjMB5AZSqRm8sst8kUqUy/?name=activity+-+Best+Effort.png
[strava-best-efforts]: https://github.com/yizeng/strava-best-efforts
[Ruby on Rails]: http://rubyonrails.org/
[Strafforts Issues]: https://github.com/yizeng/strafforts/issues
[yizeng.me]: http://yizeng.me
