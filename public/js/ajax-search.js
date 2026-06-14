const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('searchResults');

if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = this.value;
            if (query.length < 2) {
                resultsDiv.innerHTML = '';
                return;
            }
            fetch(`/api/search?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) {
                        resultsDiv.innerHTML = '<p>No results found</p>';
                        return;
                    }
                    resultsDiv.innerHTML = data.map(item => {
                        const linkUrl = item.type === 'habitat' ? `/habitat/${item.id}` : `/experience/${item.id}`;
                        const icon = item.type === 'habitat' ? '🌿' : '🎪';
                        return `
                            <div class="search-result-item">
                                <strong>${icon} ${item.type === 'habitat' ? 'Habitat' : 'Experience'}</strong>
                                <h4>${escapeHtml(item.name)}</h4>
                                <p>${item.description ? item.description.substring(0, 100) : ''}...</p>
                                <a href="${linkUrl}">View →</a>
                            </div>
                        `;
                    }).join('');
                })
                .catch(error => {
                    console.error('Search error:', error);
                    resultsDiv.innerHTML = '<p>Error searching</p>';
                });
        }, 300);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}