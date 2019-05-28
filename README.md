# Chicago BOB Lightning App Workshop

Congrats! You found the second part of the workshop. This is a very basic Lightning app that will allow us to get paid for users to post and replace content in a King of the Hill style page.

In order to set this up properly, we'll need to make some adjustments from the work we just did:

## Setup the Project

In our `.env` file, we'll need to change the following fields, and add one as well:

* `PORT` - We'll want to increment this to `3001` as the Express server will now operate in the background, and we'll be using Webpack to serve up the actual application.
* `API_PATH` - This will point our frontend app to the webserver, this should be `API_PATH="http://localhost:3000/api"`
* `LND_MACAROON` - We now need to make more advanced calls on our node, so we need more permissions. Change this from your `base64 readonly.macaroon` to your `base64 invoice.macaroon` that you can find in the same directory.

## Run the Project

Install dependencies and run the app with
```sh
npm install && npm run dev
```
