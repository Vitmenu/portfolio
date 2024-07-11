const localConsole = {
    isLocal: window.location.hostname === 'localhost',
    log(message) {
        if (this.isLocal) console.trace(message);
    },
    count(message) {
        if (this.isLocal) console.count(message);
    },
};

export default localConsole;