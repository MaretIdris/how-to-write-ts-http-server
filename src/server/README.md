# Architecture diagram of servers in Lucid Spark

https://lucid.app/lucidspark/67207bbd-8320-4909-8157-619cd6cb912e/edit?beaconFlowId=87124AEE05ACA6E4#

# References for HTTP Server

- [HTTP Server](https://www.w3schools.com/nodejs/nodejs_http.asp)
- [HTTP Server Graceful Shutdown](https://github.com/the-moebius/http-graceful-shutdown)
- [Why is it so complicated to shutdown an HTTP Server](https://stackoverflow.com/questions/14626636/how-do-i-shutdown-a-node-js-https-server-immediately)
- [Readline docs](https://nodejs.org/en/knowledge/command-line/how-to-prompt-for-command-line-input/)
- [How to intercept Ctrl+C keypress using SIGINT in terminal app](https://nodejs.org/api/process.html)
- [How to access query string params from a URL in node](https://nodejs.org/en/knowledge/HTTP/clients/how-to-access-query-string-parameters/)

# Deployment to heroku

- [Location of the deployed app on heroku](https://dashboard.heroku.com/apps/how-to-write-ts-http-server)
- [Tutorial that shows how to deploy a node app to heroku](https://dev.to/hte305/simple-deploy-typescript-application-to-heroku-5b6g)
- [Heroku docs on deploying node apps](https://devcenter.heroku.com/articles/deploying-nodejs#advanced-http-features)

From `~/github/how-to-write-ts-http-server` folder you can run the following commands:

1. Command to see what is the status of the heroku "app" (running in a Linux VM in AWS): `heroku logs --tail`
2. Command to push the `main` branch code into the `heroku` remote (app): `git push heroku main`. Note that when you
   type `git push`, you are actually doing `git push origin main`. GitHub uses `origin` as the name of its remote by
   default. I don't know why this is not just `github`.

In order to run the deployed app on heroku, you can use the following URL.

- https://how-to-write-ts-http-server.herokuapp.com/

Here are some other URLs that should also work:

- https://how-to-write-ts-http-server.herokuapp.com/echo?key=monkey
- https://how-to-write-ts-http-server.herokuapp.com/dummy-html?key=monkey
- https://how-to-write-ts-http-server.herokuapp.com/dummy-json?key=monkey
