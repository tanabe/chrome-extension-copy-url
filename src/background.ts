import { browser } from 'webextension-polyfill-ts'

const execute = async () => {
  alert("hello world");
}

browser.commands.onCommand.addListener((command) => {
  execute();
});