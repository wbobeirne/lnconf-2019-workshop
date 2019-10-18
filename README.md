# Lightning Conference 2019 Workshop

You're now ready to deploy your app to a production webserver, that's freakin' awesome. For this portion, we'll be using [Heroku](https://www.heroku.com/), since it's really easy to use and you can get started for free.

## Setup Heroku

1. First things first, you'll need to create an account if you don't already have one. You can do that on [Heroku.com](https://www.heroku.com/)
2. Install the Heroku CLI by [following the guide here](https://devcenter.heroku.com/articles/heroku-cli).
3. Create a new Heroku app for the project, and follow the instructions to link your project folder to it. This can be done partially through their UI, or entirely in the command line.
4. Configure the `LND_*` environment variables in your Heroku app's settings. This can be done via their UI, or the command line.
5. Push the project! Run `git push heroku heroku:master`

## Troubleshooting

If you're having issues with your deployment, check for the following problems.

* When you push, make sure you do `heroku:master` and not just `heroku`. Heroku only deploys what's on the master branch, but this part of the tutorial is on the heroku branch, so we need to tell it to rename it with the `:` character.
* Make sure you don't set `PORT` or `API_PATH`, these are handled automatically for you by Heroku and overriding them may cause issues.
* Are your posts disappearing? That's because they're stored entirely in Javascript memory. Heroku may occasionally restart or migrate your application from one server to another, causing memory to reset. If you'd like to keep posts around forever, you'll need to use a database of some sort.
