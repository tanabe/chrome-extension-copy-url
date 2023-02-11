import { browser } from 'webextension-polyfill-ts'

interface Entry {
  url: string,
  matcher: string
}

interface Preference {
  entries: Entry[],
  version: string
}

// sample preferences
const savePreferences = async () => {
  let preference: Preference = {
    entries: [
      {url: "https://github.com", matcher: "https://github.com/([^/]+/[^/]+)"},
      {url: "https://twitter.com", matcher: "https://twitter.com/([^/]+)"}
    ],
    version: '0.1.0'
  };
  browser.storage.sync.set({'preference': JSON.stringify(preference)}).then(() => {
    // do nothing
  });
}

const loadPreference = async (): Promise<Preference> => {
  return browser.storage.sync.get('preference').then((json) => {
    let result = JSON.parse(json.preference);
    return result;
  });
}

const execute = async () => {
  let preference = await loadPreference();
  if (preference == null) {
    return;
  }

  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    let url = tabs[0].url;
    if (url == null) {
      return;
    }

    let item = preference.entries.find((entry) => {
      return url!.indexOf(entry.url) > -1;
    });

    if (item == null) {
      return;
    }

    let regexp = new RegExp(item.matcher);
    let matches = url?.match(regexp);

    if (matches) {
      let parialUrl = matches[1];
      alert(`copied ${parialUrl}`);
      copyToClipboard(parialUrl);
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

browser.runtime.onInstalled.addListener(() => {
  savePreferences()
});

browser.commands.onCommand.addListener((command) => {
  execute();
});
