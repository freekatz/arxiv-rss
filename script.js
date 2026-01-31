document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const queryBuilder = document.getElementById('query-builder');
    const addTermButton = document.getElementById('add-term');
    const addGroupButton = document.getElementById('add-group');
    const generateUrlButton = document.getElementById('generate-url');
    const resultUrl = document.getElementById('result-url');
    const queryPreview = document.getElementById('query-preview');
    const copyUrlButton = document.getElementById('copy-url');
    const workerUrl = document.getElementById('worker-url');
    const copyWorkerUrlButton = document.getElementById('copy-worker-url');
    const importQueryInput = document.getElementById('import-query');
    const importBtn = document.getElementById('import-btn');

    // New elements
    const maxResultsInput = document.getElementById('max-results');
    const dateRangeType = document.getElementById('date-range-type');
    const customDateRange = document.getElementById('custom-date-range');
    const dateFrom = document.getElementById('date-from');
    const dateTo = document.getElementById('date-to');
    const selectedCategoriesContainer = document.getElementById('selected-categories');
    const categoryDropdown = document.getElementById('category-dropdown');
    const categorySearch = document.getElementById('category-search');
    const categoryList = document.getElementById('category-list');

    // Selected categories
    let selectedCategories = [];

    // arXiv categories data
    const arxivCategories = {
        'Computer Science': [
            { code: 'cs.AI', name: 'Artificial Intelligence' },
            { code: 'cs.AR', name: 'Hardware Architecture' },
            { code: 'cs.CC', name: 'Computational Complexity' },
            { code: 'cs.CE', name: 'Computational Engineering' },
            { code: 'cs.CG', name: 'Computational Geometry' },
            { code: 'cs.CL', name: 'Computation and Language' },
            { code: 'cs.CR', name: 'Cryptography and Security' },
            { code: 'cs.CV', name: 'Computer Vision and Pattern Recognition' },
            { code: 'cs.CY', name: 'Computers and Society' },
            { code: 'cs.DB', name: 'Databases' },
            { code: 'cs.DC', name: 'Distributed Computing' },
            { code: 'cs.DL', name: 'Digital Libraries' },
            { code: 'cs.DM', name: 'Discrete Mathematics' },
            { code: 'cs.DS', name: 'Data Structures and Algorithms' },
            { code: 'cs.ET', name: 'Emerging Technologies' },
            { code: 'cs.FL', name: 'Formal Languages' },
            { code: 'cs.GL', name: 'General Literature' },
            { code: 'cs.GR', name: 'Graphics' },
            { code: 'cs.GT', name: 'Game Theory' },
            { code: 'cs.HC', name: 'Human-Computer Interaction' },
            { code: 'cs.IR', name: 'Information Retrieval' },
            { code: 'cs.IT', name: 'Information Theory' },
            { code: 'cs.LG', name: 'Machine Learning' },
            { code: 'cs.LO', name: 'Logic in Computer Science' },
            { code: 'cs.MA', name: 'Multiagent Systems' },
            { code: 'cs.MM', name: 'Multimedia' },
            { code: 'cs.MS', name: 'Mathematical Software' },
            { code: 'cs.NA', name: 'Numerical Analysis' },
            { code: 'cs.NE', name: 'Neural and Evolutionary Computing' },
            { code: 'cs.NI', name: 'Networking and Internet Architecture' },
            { code: 'cs.OH', name: 'Other Computer Science' },
            { code: 'cs.OS', name: 'Operating Systems' },
            { code: 'cs.PF', name: 'Performance' },
            { code: 'cs.PL', name: 'Programming Languages' },
            { code: 'cs.RO', name: 'Robotics' },
            { code: 'cs.SC', name: 'Symbolic Computation' },
            { code: 'cs.SD', name: 'Sound' },
            { code: 'cs.SE', name: 'Software Engineering' },
            { code: 'cs.SI', name: 'Social and Information Networks' },
            { code: 'cs.SY', name: 'Systems and Control' }
        ],
        'Economics': [
            { code: 'econ.EM', name: 'Econometrics' },
            { code: 'econ.GN', name: 'General Economics' },
            { code: 'econ.TH', name: 'Theoretical Economics' }
        ],
        'Electrical Engineering': [
            { code: 'eess.AS', name: 'Audio and Speech Processing' },
            { code: 'eess.IV', name: 'Image and Video Processing' },
            { code: 'eess.SP', name: 'Signal Processing' },
            { code: 'eess.SY', name: 'Systems and Control' }
        ],
        'Mathematics': [
            { code: 'math.AC', name: 'Commutative Algebra' },
            { code: 'math.AG', name: 'Algebraic Geometry' },
            { code: 'math.AP', name: 'Analysis of PDEs' },
            { code: 'math.AT', name: 'Algebraic Topology' },
            { code: 'math.CA', name: 'Classical Analysis and ODEs' },
            { code: 'math.CO', name: 'Combinatorics' },
            { code: 'math.CT', name: 'Category Theory' },
            { code: 'math.CV', name: 'Complex Variables' },
            { code: 'math.DG', name: 'Differential Geometry' },
            { code: 'math.DS', name: 'Dynamical Systems' },
            { code: 'math.FA', name: 'Functional Analysis' },
            { code: 'math.GM', name: 'General Mathematics' },
            { code: 'math.GN', name: 'General Topology' },
            { code: 'math.GR', name: 'Group Theory' },
            { code: 'math.GT', name: 'Geometric Topology' },
            { code: 'math.HO', name: 'History and Overview' },
            { code: 'math.IT', name: 'Information Theory' },
            { code: 'math.KT', name: 'K-Theory and Homology' },
            { code: 'math.LO', name: 'Logic' },
            { code: 'math.MG', name: 'Metric Geometry' },
            { code: 'math.MP', name: 'Mathematical Physics' },
            { code: 'math.NA', name: 'Numerical Analysis' },
            { code: 'math.NT', name: 'Number Theory' },
            { code: 'math.OA', name: 'Operator Algebras' },
            { code: 'math.OC', name: 'Optimization and Control' },
            { code: 'math.PR', name: 'Probability' },
            { code: 'math.QA', name: 'Quantum Algebra' },
            { code: 'math.RA', name: 'Rings and Algebras' },
            { code: 'math.RT', name: 'Representation Theory' },
            { code: 'math.SG', name: 'Symplectic Geometry' },
            { code: 'math.SP', name: 'Spectral Theory' },
            { code: 'math.ST', name: 'Statistics Theory' }
        ],
        'Physics': [
            { code: 'astro-ph', name: 'Astrophysics' },
            { code: 'astro-ph.CO', name: 'Cosmology and Nongalactic Astrophysics' },
            { code: 'astro-ph.EP', name: 'Earth and Planetary Astrophysics' },
            { code: 'astro-ph.GA', name: 'Astrophysics of Galaxies' },
            { code: 'astro-ph.HE', name: 'High Energy Astrophysical Phenomena' },
            { code: 'astro-ph.IM', name: 'Instrumentation and Methods' },
            { code: 'astro-ph.SR', name: 'Solar and Stellar Astrophysics' },
            { code: 'cond-mat', name: 'Condensed Matter' },
            { code: 'gr-qc', name: 'General Relativity and Quantum Cosmology' },
            { code: 'hep-ex', name: 'High Energy Physics - Experiment' },
            { code: 'hep-lat', name: 'High Energy Physics - Lattice' },
            { code: 'hep-ph', name: 'High Energy Physics - Phenomenology' },
            { code: 'hep-th', name: 'High Energy Physics - Theory' },
            { code: 'math-ph', name: 'Mathematical Physics' },
            { code: 'nlin', name: 'Nonlinear Sciences' },
            { code: 'nucl-ex', name: 'Nuclear Experiment' },
            { code: 'nucl-th', name: 'Nuclear Theory' },
            { code: 'physics', name: 'Physics (General)' },
            { code: 'quant-ph', name: 'Quantum Physics' }
        ],
        'Quantitative Biology': [
            { code: 'q-bio.BM', name: 'Biomolecules' },
            { code: 'q-bio.CB', name: 'Cell Behavior' },
            { code: 'q-bio.GN', name: 'Genomics' },
            { code: 'q-bio.MN', name: 'Molecular Networks' },
            { code: 'q-bio.NC', name: 'Neurons and Cognition' },
            { code: 'q-bio.OT', name: 'Other Quantitative Biology' },
            { code: 'q-bio.PE', name: 'Populations and Evolution' },
            { code: 'q-bio.QM', name: 'Quantitative Methods' },
            { code: 'q-bio.SC', name: 'Subcellular Processes' },
            { code: 'q-bio.TO', name: 'Tissues and Organs' }
        ],
        'Quantitative Finance': [
            { code: 'q-fin.CP', name: 'Computational Finance' },
            { code: 'q-fin.EC', name: 'Economics' },
            { code: 'q-fin.GN', name: 'General Finance' },
            { code: 'q-fin.MF', name: 'Mathematical Finance' },
            { code: 'q-fin.PM', name: 'Portfolio Management' },
            { code: 'q-fin.PR', name: 'Pricing of Securities' },
            { code: 'q-fin.RM', name: 'Risk Management' },
            { code: 'q-fin.ST', name: 'Statistical Finance' },
            { code: 'q-fin.TR', name: 'Trading and Market Microstructure' }
        ],
        'Statistics': [
            { code: 'stat.AP', name: 'Applications' },
            { code: 'stat.CO', name: 'Computation' },
            { code: 'stat.ME', name: 'Methodology' },
            { code: 'stat.ML', name: 'Machine Learning' },
            { code: 'stat.OT', name: 'Other Statistics' },
            { code: 'stat.TH', name: 'Statistics Theory' }
        ]
    };

    // ===== NEW QUERY BUILDER =====
    const clearAllButton = document.getElementById('clear-all');

    // Add event listeners
    addTermButton.addEventListener('click', () => addTerm(queryBuilder));
    addGroupButton.addEventListener('click', () => addGroup(queryBuilder));
    clearAllButton.addEventListener('click', clearAll);
    generateUrlButton.addEventListener('click', generateUrl);
    copyUrlButton.addEventListener('click', copyToClipboard);
    copyWorkerUrlButton.addEventListener('click', copyWorkerUrlToClipboard);
    importBtn.addEventListener('click', importQuery);

    // Clear all terms and groups
    function clearAll() {
        queryBuilder.innerHTML = '';
        addTerm(queryBuilder);
    }

    // Event delegation for query builder
    queryBuilder.addEventListener('click', function(e) {
        // Delete button
        const deleteBtn = e.target.closest('.btn-delete');
        if (deleteBtn) {
            e.preventDefault();
            const item = deleteBtn.closest('.query-item');
            if (item) {
                deleteQueryItem(item);
            }
            return;
        }
        // Add term/group in group button
        const addInGroupBtn = e.target.closest('.btn-add-in-group');
        if (addInGroupBtn) {
            e.preventDefault();
            const groupWrapper = addInGroupBtn.closest('.group-wrapper');
            const groupContent = groupWrapper ? groupWrapper.querySelector('.group-content') : null;
            if (groupContent) {
                const addType = addInGroupBtn.dataset.type || 'term';
                if (addType === 'group') {
                    addGroup(groupContent);
                } else {
                    addTerm(groupContent);
                }
            }
            return;
        }
    });

    // Delete a query item (term or group)
    function deleteQueryItem(item) {
        const container = item.parentElement;
        const items = container.querySelectorAll(':scope > .query-item');

        // If this is the only item in root, just clear it
        if (container === queryBuilder && items.length === 1) {
            const input = item.querySelector('.term-input');
            if (input) input.value = '';
            return;
        }

        // If this is the first item, need to remove connector from next item
        const itemIndex = Array.from(items).indexOf(item);
        if (itemIndex === 0 && items.length > 1) {
            const nextItem = items[1];
            const connector = nextItem.querySelector('.connector-select');
            if (connector) {
                // Replace connector with placeholder
                const placeholder = document.createElement('div');
                placeholder.className = 'connector-placeholder';
                connector.replaceWith(placeholder);
            }
        }

        item.remove();

        // If group becomes empty, add a term
        if (container.classList.contains('group-content') && container.children.length === 0) {
            addTerm(container);
        }
    }

    // Create field selector HTML
    function createFieldSelector() {
        return `
            <select class="field-selector">
                <option value="ti">Title</option>
                <option value="au">Author</option>
                <option value="abs">Abstract</option>
                <option value="co">Comment</option>
                <option value="jr">Journal Reference</option>
                <option value="cat">Category</option>
                <option value="all">All Fields</option>
            </select>
        `;
    }

    // Create connector selector HTML
    function createConnectorSelector(value = 'AND') {
        return `
            <select class="connector-select">
                <option value="AND" ${value === 'AND' ? 'selected' : ''}>AND</option>
                <option value="OR" ${value === 'OR' ? 'selected' : ''}>OR</option>
                <option value="ANDNOT" ${value === 'ANDNOT' ? 'selected' : ''}>ANDNOT</option>
            </select>
        `;
    }

    // Add a term to a container
    function addTerm(container, field = 'ti', value = '', connector = 'AND') {
        const isFirst = container.querySelectorAll(':scope > .query-item').length === 0;

        const item = document.createElement('div');
        item.className = 'query-item';
        item.innerHTML = `
            ${isFirst ? '<div class="connector-placeholder"></div>' : createConnectorSelector(connector)}
            <div class="term-row">
                ${createFieldSelector()}
                <input type="text" class="term-input" placeholder="Enter search term">
                <button class="btn-delete" title="Delete">✕</button>
            </div>
        `;

        // Set field value
        if (field) {
            const select = item.querySelector('.field-selector');
            if (select && select.querySelector(`option[value="${field}"]`)) {
                select.value = field;
            }
        }

        // Set input value (more reliable than HTML attribute)
        const input = item.querySelector('.term-input');
        if (input && value) {
            input.value = value;
        }

        container.appendChild(item);
    }

    // Add a group to a container
    function addGroup(container, connector = 'AND') {
        const isFirst = container.querySelectorAll(':scope > .query-item').length === 0;

        const item = document.createElement('div');
        item.className = 'query-item';
        item.innerHTML = `
            ${isFirst ? '<div class="connector-placeholder"></div>' : createConnectorSelector(connector)}
            <div class="group-wrapper">
                <div class="group-header">
                    <span class="group-label">Group</span>
                    <button class="btn-delete" title="Delete group">✕</button>
                </div>
                <div class="group-content"></div>
                <div class="group-actions-bar">
                    <button class="btn-add-in-group" data-type="term">+ Term</button>
                    <button class="btn-add-in-group" data-type="group">+ Group</button>
                </div>
            </div>
        `;

        container.appendChild(item);

        // Add initial term to group
        const groupContent = item.querySelector('.group-content');
        addTerm(groupContent);
    }

    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize with one empty term
    addTerm(queryBuilder);

    // Date range type change
    dateRangeType.addEventListener('change', function() {
        if (this.value === 'custom') {
            customDateRange.style.display = 'flex';
            const today = new Date();
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            dateFrom.value = formatDateForInput(weekAgo);
            dateTo.value = formatDateForInput(today);
        } else {
            customDateRange.style.display = 'none';
        }
    });

    // Category selector
    selectedCategoriesContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-category')) {
            const code = e.target.dataset.code;
            removeCategory(code);
            e.stopPropagation();
            return;
        }
        toggleCategoryDropdown();
    });

    categorySearch.addEventListener('input', function() {
        filterCategories(this.value);
    });

    // Quick category chips
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCategory(this.dataset.category);
            updateChipSelection();
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!selectedCategoriesContainer.contains(e.target) && !categoryDropdown.contains(e.target)) {
            categoryDropdown.classList.remove('show');
            selectedCategoriesContainer.classList.remove('active');
        }
    });

    // Initialize
    initializeCategoryList();

    // Update chip selection state
    function updateChipSelection() {
        document.querySelectorAll('.category-chip').forEach(chip => {
            chip.classList.toggle('selected', selectedCategories.includes(chip.dataset.category));
        });
    }

    // Helper functions
    function formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }

    function formatDateForArxiv(date) {
        // arXiv uses format YYYYMMDD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    function getDateRangeQuery() {
        const rangeType = dateRangeType.value;
        if (rangeType === 'none') return null;

        const today = new Date();
        let fromDate = new Date();
        let toDate = new Date();

        switch (rangeType) {
            case 'today':
                // today only
                fromDate = new Date(today);
                toDate = new Date(today);
                break;
            case 'yesterday':
                fromDate.setDate(today.getDate() - 1);
                toDate.setDate(today.getDate() - 1);
                break;
            case 'week':
                fromDate.setDate(today.getDate() - 7);
                toDate = new Date(today);
                break;
            case 'month':
                fromDate.setDate(today.getDate() - 30);
                toDate = new Date(today);
                break;
            case 'custom':
                if (dateFrom.value && dateTo.value) {
                    fromDate = new Date(dateFrom.value);
                    toDate = new Date(dateTo.value);
                } else {
                    return null;
                }
                break;
            default:
                return null;
        }

        return `submittedDate:[${formatDateForArxiv(fromDate)} TO ${formatDateForArxiv(toDate)}]`;
    }

    function initializeCategoryList() {
        categoryList.innerHTML = '';
        for (const [groupName, categories] of Object.entries(arxivCategories)) {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'category-group';
            groupDiv.dataset.group = groupName;

            const header = document.createElement('div');
            header.className = 'category-group-header';
            header.textContent = groupName;
            groupDiv.appendChild(header);

            categories.forEach(cat => {
                const item = document.createElement('div');
                item.className = 'category-item';
                item.dataset.code = cat.code;
                item.innerHTML = `
                    <span class="category-code">${cat.code}</span>
                    <span class="category-name">${cat.name}</span>
                `;
                item.addEventListener('click', () => toggleCategory(cat.code));
                groupDiv.appendChild(item);
            });

            categoryList.appendChild(groupDiv);
        }
    }

    function toggleCategoryDropdown() {
        const isOpen = categoryDropdown.classList.contains('show');
        if (isOpen) {
            categoryDropdown.classList.remove('show');
            selectedCategoriesContainer.classList.remove('active');
        } else {
            categoryDropdown.classList.add('show');
            selectedCategoriesContainer.classList.add('active');
            categorySearch.value = '';
            filterCategories('');
            categorySearch.focus();
        }
    }

    function filterCategories(query) {
        const lowerQuery = query.toLowerCase();
        const groups = categoryList.querySelectorAll('.category-group');

        groups.forEach(group => {
            const items = group.querySelectorAll('.category-item');
            let hasVisibleItems = false;

            items.forEach(item => {
                const code = item.dataset.code.toLowerCase();
                const name = item.querySelector('.category-name').textContent.toLowerCase();
                const matches = code.includes(lowerQuery) || name.includes(lowerQuery);
                item.style.display = matches ? 'flex' : 'none';
                if (matches) hasVisibleItems = true;
            });

            group.style.display = hasVisibleItems ? 'block' : 'none';
        });
    }

    function toggleCategory(code) {
        const index = selectedCategories.indexOf(code);
        if (index === -1) {
            selectedCategories.push(code);
        } else {
            selectedCategories.splice(index, 1);
        }
        updateSelectedCategoriesDisplay();
        updateCategoryListSelection();
        updateChipSelection();
    }

    function removeCategory(code) {
        const index = selectedCategories.indexOf(code);
        if (index !== -1) {
            selectedCategories.splice(index, 1);
            updateSelectedCategoriesDisplay();
            updateCategoryListSelection();
            updateChipSelection();
        }
    }

    function updateSelectedCategoriesDisplay() {
        if (selectedCategories.length === 0) {
            selectedCategoriesContainer.innerHTML = '<span class="placeholder-text">Click to browse all categories...</span>';
        } else {
            selectedCategoriesContainer.innerHTML = selectedCategories.map(code => {
                const isMajor = !code.includes('.') && !code.includes('-');
                const displayCode = isMajor ? `${code}.*` : code;
                return `<span class="category-tag${isMajor ? ' major' : ''}">${displayCode}<span class="remove-category" data-code="${code}">×</span></span>`;
            }).join('');
        }
    }

    function updateCategoryListSelection() {
        const items = categoryList.querySelectorAll('.category-item');
        items.forEach(item => {
            if (selectedCategories.includes(item.dataset.code)) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    function getCategoriesQuery() {
        if (selectedCategories.length === 0) return null;

        // Helper to format category - major categories need .* suffix for arXiv API
        const formatCat = (cat) => {
            const isMajor = !cat.includes('.') && !cat.includes('-');
            return `cat:${isMajor ? cat + '.*' : cat}`;
        };

        if (selectedCategories.length === 1) {
            return formatCat(selectedCategories[0]);
        }
        return '(' + selectedCategories.map(formatCat).join(' OR ') + ')';
    }

    // Import query string and fill the form
    function importQuery() {
        const queryStr = importQueryInput.value.trim();
        if (!queryStr) return;

        // Clear existing form
        clearForm();

        // Parse the query
        const parsed = parseQueryString(queryStr);

        // Fill the form with parsed data
        fillFormWithParsed(parsed, queryBuilder);

        // Clear import input
        importQueryInput.value = '';
    }

    function clearForm() {
        // Clear query builder
        queryBuilder.innerHTML = '';

        // Clear categories
        selectedCategories = [];
        updateSelectedCategoriesDisplay();
        updateCategoryListSelection();
        updateChipSelection();
    }

    // Tokenize query string into tokens (handles quotes and parentheses)
    function tokenizeQuery(query) {
        const tokens = [];
        let current = '';
        let inQuotes = false;
        let quoteChar = '';

        // Normalize whitespace (replace newlines with spaces)
        query = query.replace(/[\r\n]+/g, ' ');

        // Remove spaces after colons (e.g., "abs: " -> "abs:")
        query = query.replace(/:\s+/g, ':');

        for (let i = 0; i < query.length; i++) {
            const char = query[i];

            if ((char === '"' || char === "'") && !inQuotes) {
                inQuotes = true;
                quoteChar = char;
                current += char;
            } else if (char === quoteChar && inQuotes) {
                inQuotes = false;
                current += char;
                quoteChar = '';
            } else if (!inQuotes && (char === ' ' || char === '\t')) {
                if (current.trim()) {
                    tokens.push(current.trim());
                }
                current = '';
            } else if (!inQuotes && (char === '(' || char === ')')) {
                if (current.trim()) {
                    tokens.push(current.trim());
                }
                current = '';
                tokens.push(char);
            } else {
                current += char;
            }
        }

        if (current.trim()) {
            tokens.push(current.trim());
        }

        return tokens;
    }

    // Parse tokens into a tree structure with nested groups
    function parseQueryString(query) {
        const tokens = tokenizeQuery(query);
        const categories = [];

        // Parse tokens into tree structure
        function parseTokens(tokens, start, end) {
            const items = [];
            let i = start;
            let currentConnector = null;

            while (i < end) {
                const token = tokens[i];

                // Handle connectors
                if (token === 'AND' || token === 'OR' || token === 'ANDNOT') {
                    currentConnector = token;
                    i++;
                    continue;
                }

                // Handle opening parenthesis - find matching close and recurse
                if (token === '(') {
                    let depth = 1;
                    let j = i + 1;
                    while (j < end && depth > 0) {
                        if (tokens[j] === '(') depth++;
                        if (tokens[j] === ')') depth--;
                        j++;
                    }
                    // j now points to one past the matching ')'
                    const groupItems = parseTokens(tokens, i + 1, j - 1);
                    if (groupItems.length > 0) {
                        items.push({
                            type: 'group',
                            items: groupItems,
                            connector: items.length > 0 ? (currentConnector || 'AND') : null
                        });
                    }
                    currentConnector = null;
                    i = j;
                    continue;
                }

                // Skip closing parenthesis (handled above)
                if (token === ')') {
                    i++;
                    continue;
                }

                // Parse field:value term
                const colonIndex = token.indexOf(':');
                if (colonIndex > 0) {
                    const field = token.substring(0, colonIndex);
                    let value = token.substring(colonIndex + 1);

                    // Remove quotes if present
                    if ((value.startsWith('"') && value.endsWith('"')) ||
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }

                    // Handle categories separately
                    if (field === 'cat') {
                        if (!categories.includes(value)) {
                            categories.push(value);
                        }
                    } else {
                        items.push({
                            type: 'term',
                            field: field,
                            value: value,
                            connector: items.length > 0 ? (currentConnector || 'AND') : null
                        });
                    }
                    currentConnector = null;
                }
                i++;
            }

            return items;
        }

        const items = parseTokens(tokens, 0, tokens.length);

        return {
            items: items,
            categories: categories
        };
    }

    // Recursively fill form from parsed structure
    function fillFormWithParsed(parsed, container) {
        // Fill categories
        selectedCategories = parsed.categories;
        updateSelectedCategoriesDisplay();
        updateCategoryListSelection();
        updateChipSelection();

        // Fill terms recursively
        if (parsed.items.length === 0) {
            addTerm(container);
            return;
        }

        // Recursively add items to a container
        function addItemsToContainer(cont, items) {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const connector = i > 0 ? (item.connector || 'AND') : 'AND';

                if (item.type === 'term') {
                    addTerm(cont, item.field, item.value, connector);
                } else if (item.type === 'group') {
                    addGroupWithItems(cont, item.items, connector);
                }
            }
        }

        // Add a group with items
        function addGroupWithItems(cont, items, connector) {
            const isFirst = cont.querySelectorAll(':scope > .query-item').length === 0;

            const itemEl = document.createElement('div');
            itemEl.className = 'query-item';
            itemEl.innerHTML = `
                ${isFirst ? '<div class="connector-placeholder"></div>' : createConnectorSelector(connector)}
                <div class="group-wrapper">
                    <div class="group-header">
                        <span class="group-label">Group</span>
                        <button class="btn-delete" title="Delete group">✕</button>
                    </div>
                    <div class="group-content"></div>
                    <div class="group-actions-bar">
                        <button class="btn-add-in-group" data-type="term">+ Term</button>
                        <button class="btn-add-in-group" data-type="group">+ Group</button>
                    </div>
                </div>
            `;

            cont.appendChild(itemEl);

            const groupContent = itemEl.querySelector('.group-content');
            addItemsToContainer(groupContent, items);
        }

        addItemsToContainer(container, parsed.items);
    }

    // Build query from the new structure
    function buildQueryFromContainer(container) {
        const items = container.querySelectorAll(':scope > .query-item');
        if (items.length === 0) return '';

        let queryParts = [];

        items.forEach((item, index) => {
            // Get connector (skip for first item)
            let connector = 'AND';
            if (index > 0) {
                const connectorSelect = item.querySelector(':scope > .connector-select');
                if (connectorSelect) {
                    connector = connectorSelect.value;
                }
            }

            let part = '';

            // Check if it's a term or group
            const termRow = item.querySelector(':scope > .term-row');
            const groupWrapper = item.querySelector(':scope > .group-wrapper');

            if (termRow) {
                const field = termRow.querySelector('.field-selector').value;
                const value = termRow.querySelector('.term-input').value.trim();

                if (value) {
                    let formattedValue = value.includes(' ') ? `"${value}"` : value;
                    part = `${field}:${formattedValue}`;
                }
            } else if (groupWrapper) {
                const groupContent = groupWrapper.querySelector('.group-content');
                const innerQuery = buildQueryFromContainer(groupContent);

                if (innerQuery) {
                    part = `(${innerQuery})`;
                }
            }

            if (part) {
                if (queryParts.length > 0) {
                    queryParts.push(connector);
                }
                queryParts.push(part);
            }
        });

        return queryParts.join(' ');
    }

    // Generate query preview
    function updateQueryPreview() {
        const query = buildQueryFromContainer(queryBuilder);
        queryPreview.textContent = query || 'No query terms defined';
    }

    // Generate the URL based on the form inputs
    function generateUrl() {
        const baseUrl = 'https://export.arxiv.org/api/query';

        // Build query from the entire structure
        let searchQuery = buildQueryFromContainer(queryBuilder);

        // Add date range if specified
        const dateRangeQuery = getDateRangeQuery();
        if (dateRangeQuery) {
            if (searchQuery) {
                searchQuery = `${searchQuery} AND ${dateRangeQuery}`;
            } else {
                searchQuery = dateRangeQuery;
            }
        }

        // Add categories if specified
        const categoriesQuery = getCategoriesQuery();
        if (categoriesQuery) {
            if (searchQuery) {
                searchQuery = `${searchQuery} AND ${categoriesQuery}`;
            } else {
                searchQuery = categoriesQuery;
            }
        }

        // Get other options
        const sortBy = document.getElementById('sort-by').value;
        const sortOrder = document.getElementById('sort-order').value;
        const maxResults = maxResultsInput.value || '50';

        // Build the query parameters
        const params = new URLSearchParams();

        if (searchQuery) {
            params.append('search_query', searchQuery);
        }

        params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder);
        params.append('start', '0');
        params.append('max_results', maxResults);

        // Generate the final URL
        const finalUrl = `${baseUrl}?${params.toString()}`;
        resultUrl.textContent = finalUrl;

        // Generate Worker URL (without date in query)
        // For custom date range, fall back to static URL (just the path part)
        const dateType = dateRangeType.value;
        if (dateType === 'custom') {
            // Custom range uses fixed dates, so use static URL path
            workerUrl.textContent = `/api/rss?${params.toString()}`;
        } else {
            const workerUrlStr = generateWorkerUrl();
            workerUrl.textContent = workerUrlStr;
        }

        // Update query preview
        updateQueryPreview();

        // Show the result container
        document.querySelector('.result-container').style.display = 'block';
    }

    // Generate API URL with date parameter (matching arXiv API style)
    function generateWorkerUrl() {
        // Build query without date
        let searchQuery = buildQueryFromContainer(queryBuilder);

        // Add categories if specified
        const categoriesQuery = getCategoriesQuery();
        if (categoriesQuery) {
            if (searchQuery) {
                searchQuery = `${searchQuery} AND ${categoriesQuery}`;
            } else {
                searchQuery = categoriesQuery;
            }
        }

        // Get date type
        const dateType = dateRangeType.value;

        // Get other options
        const sortBy = document.getElementById('sort-by').value;
        const sortOrder = document.getElementById('sort-order').value;
        const maxResults = maxResultsInput.value || '50';

        // Build API URL params (matching arXiv API naming)
        const params = new URLSearchParams();
        if (searchQuery) {
            params.append('search_query', searchQuery);
        }
        params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder);
        params.append('start', '0');
        params.append('max_results', maxResults);
        // Additional date parameter for proxy
        if (dateType !== 'none') {
            params.append('date', dateType);
        }

        return `${window.location.origin}/api/rss?${params.toString()}`;
    }

    // Copy Worker URL to clipboard
    function copyWorkerUrlToClipboard() {
        const text = workerUrl.textContent;
        if (!text) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showCopySuccessWorker();
            }).catch(() => {
                fallbackCopyWorker(text);
            });
        } else {
            fallbackCopyWorker(text);
        }
    }

    function fallbackCopyWorker(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showCopySuccessWorker();
    }

    function showCopySuccessWorker() {
        const originalText = copyWorkerUrlButton.textContent;
        copyWorkerUrlButton.textContent = 'Copied!';
        setTimeout(() => {
            copyWorkerUrlButton.textContent = originalText;
        }, 2000);
    }

    // Copy URL to clipboard
    function copyToClipboard() {
        const text = resultUrl.textContent;

        if (!text) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showCopySuccess();
            }).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showCopySuccess();
    }

    function showCopySuccess() {
        const originalText = copyUrlButton.textContent;
        copyUrlButton.textContent = 'Copied!';
        setTimeout(() => {
            copyUrlButton.textContent = originalText;
        }, 2000);
    }
});
