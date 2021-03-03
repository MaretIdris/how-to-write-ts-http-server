#!/usr/bin/env ts-node

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

import { Interface } from "readline";
import readline = require("readline");

const Port: number = 3000;
const closeCommand: string = "close!";

let myHttpServerShutdownManager: GracefulShutdownManager;
let myReadlineServer: Interface;
// Renaming the `Interface` type to a more readable name `TerminalInterface`.
// More info: https://www.digitalocean.com/community/tutorials/typescript-type-alias
type TerminalInterface = Interface;

function getHumanReadableDate(): string {
  return new Date().toTimeString();
}

function processHttpRequest(requestFromClient, responseToClient): void {
  const htmlResponseToClient = `
  <html>
    <title>Server Response</title>
    <h1>${getHumanReadableDate()}</h1>
    <h1>Bingo Boingo!</h1>
  </html>
  `;
  responseToClient.setHeader("Content-Type", "text/html");
  responseToClient.write(htmlResponseToClient);
  responseToClient.end();
}

function createAndStartHttpServer(): void {
  console.log(`Starting server on port ${Port}`);
  const myHttpServer: http.Server = http.createServer(processHttpRequest);
  myHttpServerShutdownManager = new GracefulShutdownManager(myHttpServer);
  // The following call is sort of like calling a promise. It returns immediately
  // and executes the next line. But the server is started on Port.
  myHttpServer.listen(Port);
}

function shutdownNow(): void {
  myReadlineServer.close();
}

/**
 * https://nodejs.org/en/knowledge/command-line/how-to-prompt-for-command-line-input/
 */
function createReadlineServer(): TerminalInterface {
  const onCloseRequest = () => {
    console.log("\n\n---- Shutting down all the servers ----");
    myHttpServerShutdownManager.terminate(() => {
      console.log("HTTP Server: Goodbye!");
    });
    console.log("Readline Server: Goodbye!");
  };
  const waiter: TerminalInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  waiter.on("close", onCloseRequest);
  return waiter;
}

function startReadlineServer(): void {
  myReadlineServer = createReadlineServer();
  promptUserToEnterCommandAndProcessIt();
}

function promptUserToEnterCommandAndProcessIt(): void {
  console.log(`Please type "${closeCommand}" or "Ctrl+C" in order to kill the web server 🐾`);
  myReadlineServer.question("👋 Type your command > ", (whatTheUserTyped: string) => {
    if (whatTheUserTyped === closeCommand) {
      shutdownNow();
    } else {
      promptUserToEnterCommandAndProcessIt();
    }
  });
}

function main(): void {
  createAndStartHttpServer();
  startReadlineServer();
}

main();
