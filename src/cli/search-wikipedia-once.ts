#!/usr/bin/env ts-node

/**
 README
 ======
 
 - In order to make any file executable, you have to run `chmod +x <filename>`.
 - Note that the `she-bang` line MUST be the first line in your executable script.
 - More about `she-bang`: https://en.wikipedia.org/wiki/Shebang_(Unix)
 
 */

import {
  getSearchResultsFromWikipediaAsynchronously,
  saveStringToFileAsynchronously,
} from "../common/wikipedia-api-utils";

const main = async (argv: Array<string>) => {
  if (argv.length === 0) {
    console.log("⚠️ Please pass the search term as an argument!");
    process.exit(1);
  }
  const searchTerm = argv.join(" ").toLowerCase();
  console.log(searchTerm);
  const response: string = await getSearchResultsFromWikipediaAsynchronously(searchTerm);

  console.log(`🚀 Got response from Wikipedia API: ${response}`);
  const filename = `${searchTerm.replace(" ", "-")}.json`;

  await saveStringToFileAsynchronously(response, filename);
  console.log(`🚀 Saved file ${filename} 🧚`);
};

/**
 * Dump all the command line arguments to console.
 * More info: https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
 */
main(process.argv.splice(2));
