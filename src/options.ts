import { browser } from 'webextension-polyfill-ts'

interface Entry {
    url: string,
    matcher: string
}

interface Preference {
    entries: Entry[],
    version: string
}

const savePreferences = async (entries: Entry[]) => {
    let preference: Preference = {
        entries: entries,
        version: '0.1.0'
    };
    browser.storage.sync.set({ 'preference': JSON.stringify(preference) }).then(() => {
        // do nothing
    });
}

const loadPreference = async (): Promise<Preference> => {
    return browser.storage.sync.get('preference').then((json) => {
        let result = JSON.parse(json.preference);
        return result;
    });
}

const addEntry = (entries: Entry[], entry: Entry): Entry[] => {
    let modified = [...entries];
    modified.push(entry);
    return modified;
};

const deleteEntry = (entries: Entry[], index: number): Entry[] => {
    return []
};

const renderEntries = (entries: Entry[], container: Element) => {
    container.innerHTML = "";
    console.log(entries);
    entries.forEach((entry, index) => {
        let template = `<li class="entry_${index}"><input type="text" placeholder="url" class="entry-url"> <input type="text" placeholder="matcher" class="entry-matcher"> <button class="delete-button">delete</button></li>`;
        container.innerHTML += template;
    });
};

const bind = (entries: Entry[]) => {
    let modified = [...entries];
    let container = document.querySelector('#entries');
    let addButton = document.querySelector('#add-button');
    addButton?.addEventListener('click', (event) => {
        modified = addEntry(modified, {url: "", matcher: ""});
        renderEntries(modified, container!);
    });
};

const main = () => {
    (async () => {
        let preference = await loadPreference();
        if (preference == null) {
          return;
        }
        let entries = preference.entries || [];
        bind(entries);
    })();
};

main();