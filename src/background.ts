import { browser } from 'webextension-polyfill-ts'

const execute = async () => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    let url = tabs[0].url;
    if (url != null) {
      copyToClipboard(url);
      alert("hello world");
    } else {
      alert(url);
    }
  });
}

const copyToClipboard = (text: string) => {
  var input = document.createElement('input');
  input.setAttribute('id', 'copyinput');
  document.body.appendChild(input);
  input.value = text;
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
};

browser.commands.onCommand.addListener((command) => {
  execute();
});