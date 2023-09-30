
const Store = require('electron-store');
const store = new Store();

export  function getStoreValue (event, key) {
    return store.get(key);
}

export  function saveStoreValue (event, key,value) {
    store.set(key,value);
}

export  function removeStoreValue (event, key) {
    store.delete(key);
}