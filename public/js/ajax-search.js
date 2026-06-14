const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('searchResults');

if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = this.value;
            if (query.length < 2) { resultsDiv.innerHTML = ''; return; }
            fetch(`/api/search?q=${encodeURIComponent(query)}`)
                .then(r => r.json())
                .then(data => {
                    if (data.length === 0) {
                        resultsDiv.innerHTML = '<p style="color:#B8A898; padding:0.5rem;">No results found.</p>';
                        return;
                    }
                    resultsDiv.innerHTML = data.map(item => {
                        const url = item.type === 'habitat' ? `/habitat/${item.id}` : `/experience/${item.id}`;
                        const label = item.type === 'habitat' ? 'Habitat' : 'Experience';
                        return `
                            <div class="search-result-item">
                                <strong>${label}</strong>
                                <h4>${escapeHtml(item.name)}</h4>
                                <p>${item.description ? item.description.substring(0, 100) : ''}...</p>
                                <a href="${url}">View &rarr;</a>
                            </div>`;
                    }).join('');
                })
                .catch(() => { resultsDiv.innerHTML = '<p style="color:#B8A898;">Search error. Try again.</p>'; });
        }, 300);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}