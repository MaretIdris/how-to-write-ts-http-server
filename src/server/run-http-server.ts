#!/usr/bin/env ts-node-dev

/**
 * README
 * ======
 *
 * Note that this script is a TypeScript self executing file.
 * 1. Make sure that you have `ts-node` installed in your system using
 *    `sudo npm install -g typescript ts-node`.
 *    More info: https://www.npmjs.com/package/ts-node.
 * 2. Make sure to make this file executable using `chmod +x <filename>`
 *
 * Learn more about Node.js's built in HTTP module which you can use to create
 * a server from [here](https://www.w3schools.com/nodejs/nodejs_http.asp).
 */

import http = require("http");
import { GracefulShutdownManager } from "@moebius/http-graceful-shutdown";
import { ParsedUrlQuery } from "querystring";
import { Content, Route } from "./types";
import { IncomingMessage, ServerResponse } from "http";
import { myRoutes } from "./routes/routes";
import { noRouteFoundFunction } from "./routes/no-route-found";
const url = require("url");

const Port: number = 3000;

let myHttpServerShutdownManager: GracefulShutdownManager;

function processHttpRequest(
  requestFromClient: IncomingMessage,
  responseToClient: ServerResponse,
  routes: Array<Route>
): void {
  const unparsedUrl = requestFromClient.url;
  const parsedUrl = url.parse(unparsedUrl, true);
  const pathname: string = parsedUrl.pathname;
  const query: ParsedUrlQuery = parsedUrl.query;

  const matchingRoute: Route = routes.find((route: Route) => route.pathname === pathname);

  const content: Content = !matchingRoute ? noRouteFoundFunction(query) : matchingRoute.func(query);

  responseToClient.setHeader("Content-Type", content.type);
  responseToClient.write(content.payload);
  responseToClient.end();
}

function createAndStartHttpServer(routes: Array<Route>): void {
  console.log(`Starting server on port ${Port} 🚀. Press "Ctrl+C" to kill the server 💀.`);
  const myHttpServer: http.Server = http.createServer((req, res) => {
    processHttpRequest(req, res, routes);
  });
  myHttpServerShutdownManager = new GracefulShutdownManager(myHttpServer);
  // The following call is sort of like calling a promise. It returns immediately
  // and executes the next line. But the server is started on Port.
  myHttpServer.listen(Port);
}

function shutdownNow(): void {
  myHttpServerShutdownManager.terminate(() => console.log("HTTP Server: Goodbye!"));
}

function main(): void {
  // https://nodejs.org/api/process.html
  process.on("SIGINT", () => {
    console.log("Ctrl+C just got pressed! 💀");
    shutdownNow();
  });
  createAndStartHttpServer(myRoutes);
}

main();
