# Lightning Conference 2019 Workshop

This is the code for the Building a LApp with NodeJS + LND workshop at [The Lightning Conference](https://thelightningconference.com). If you're interested in learning to make Lightning apps though, I suggest you check out the [Lightning App Tutorial blog post series](https://medium.com/p/4a13c82f3f78) I put together that this is based off of.

If you are here at the conference, welcome! I'm looking forward to building some cool stuff with you.

## Requirements

* [Node.js](https://nodejs.org/en/) 8+
* An [LND node](https://github.com/lightningnetwork/lnd)

## Setup the Project

Copy the environment configuration file with
```
cp .env.example .env
```

Edit the following fields in your new .env file with information about your node. You can get some help finding this info using this tool: https://lightningjoule.com/tools/node-info
* `LND_GRPC_URL` - The location to connect to your node. If you're running with default settings locally, this should be `127.0.0.1:10009`.
* `LND_MACAROON` - Your `readonly.macaroon` file, base64 encoded. Run `base64 readonly.macaroon` in your macaroon directory to get this.
* `LND_TLS_CERT` - Your TLS certificate, also base 64 encoded. Run `base64 tls.cert` in your data directory to get this.

_If you're on a Windows operating system, you'll need to base64 encode some other way since you won't have the `base64` command. If you use an online tool [like this one](https://www.browserling.com/tools/file-to-base64) I recommend not uploading any mainnet node credentials._

## Run the Project

Install dependencies and run the app with
```sh
npm install && npm run dev
```
