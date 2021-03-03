#!/usr/bin/env ts-node

/**
 * Note that this script is a TypeScript self executing file.
 * 1. Make sure that you have `ts-node` installed in your system using
 *    `sudo npm install -g typescript ts-node`.
 *    More info: https://www.npmjs.com/package/ts-node.
 * 2. Make sure to make this file executable using `chmod +x <filename>`
 */

import readline = require("readline");
import { Interface } from "readline";
import {
  getSearchResultsFromWikipediaAsynchronously,
  saveStringToFileAsynchronously,
} from "../common/wikipedia-api-utils";

const closeCommand: string = "close!";
const searchWikipediaPrompt: string = "Search Wikipedia: ";

const promptUserForSearchTermAsynchronous = (myWaiter: Interface) => {
  myWaiter.question(searchWikipediaPrompt, (whatTheUserTyped: string) =>
    onSearchWikipediaRequest(whatTheUserTyped.toLowerCase(), myWaiter)
  );
};

const onSearchWikipediaRequest = async (searchTerm: string, myWaiter: Interface) => {
  // closeCommand issued. Stop the program by shutting the waiter down.
  if (searchTerm === closeCommand) {
    myWaiter.close();
    return;
  }

  // NON BLOCKING (🐾 RESPONSE)
  // const promiseForTheResponse: Promise<string> = getSearchResultsFromWikipediaAsynchronously(
  //   searchTerm
  // );
  // promiseForTheResponse.then((actualResponse) => {
  //   console.log(actualResponse);
  // });

  // BLOCKING (🐾 RESPONSE)
  const response: string = await getSearchResultsFromWikipediaAsynchronously(searchTerm);
  console.log(`🚀 Got response from Wikipedia API: ${response}`);
  const filename = `${searchTerm.replace(" ", "-")}.json`;

  // BLOCKING (WRITE DATA TO FILE)
  await saveStringToFileAsynchronously(response, filename);
  console.log(`🚀 Saved file ${filename} 🧚`);

  // NON BLOCKING
  // const myPromise: Promise<void> = saveStringToFileAsynchronously(
  //   response,
  //   filename
  // );
  // myPromise.then((bla) => {
  //   console.log(bla);
  // });

  promptUserForSearchTermAsynchronous(myWaiter);
};

/**
 * https://nodejs.org/en/knowledge/command-line/how-to-prompt-for-command-line-input/
 */
function createReadlineWaiter(): Interface {
  const onCloseRequest = () => {
    console.log("Goodbye!");
    process.exit();
  };
  const waiter: Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  waiter.on("close", onCloseRequest);
  return waiter;
}

const main = () => {
  const myWaiter: Interface = createReadlineWaiter();
  console.log(`Please type "${closeCommand}" or "Ctrl+C" in order to exit this app 🐾`);
  promptUserForSearchTermAsynchronous(myWaiter);
};

main();
