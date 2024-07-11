export const extractSearchResults = (searchMap, searchInput, arr) => {
    try {
        if (!searchMap || !searchInput) throw new Error('Uninitiated');
        const searchResults = searchMap.reduce((acc, curr) => {
            const lowerSearchInput = searchInput.trim().toLowerCase();
            const lowerSearchKeyword = curr.searchKeyword.trim().toLowerCase();

            const matching = lowerSearchKeyword.includes(lowerSearchInput);
            const notadded = acc.findIndex(added => added.id == curr.searchId) < 0;

            if (matching && notadded) {
                const found = arr.find(ele => ele.id == curr.searchId);
                if (found) {
                    acc.push({...found, search: {keyword: curr.searchKeyword, prop: curr.searchedProp}});
                }
            };
            return acc;
        }, []);

        return searchResults;

    } catch(err) {
        return;
    };
};