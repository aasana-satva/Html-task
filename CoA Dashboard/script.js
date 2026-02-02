let masterData = []; //store master data excel file
let destinationData = []; //store destination data excel file
let mappings = {}; //mapping likely most likely possible
let currentFilter = 'All';  //currently selected fillter as global
let destinationFilter = 'All';  //destination filtter only
let usedDestinationIds = new Set(); //fillter -> map -> add

const typeMapping = {
  'COGS': ['Outside Professional Cost', 'Product Cost'],
  'Other Rev & Exp': { type: 'range', min: 8001, max: 9000 },
  'Expense': 'Expense',
  'Revenue': 'Revenue',
  'Asset': 'Asset',
  'Liability': 'Liability',
  'Equity': 'Equity'
};

/*  INITIALIZATION  */
document.addEventListener("DOMContentLoaded", async () => {         //this function use await and return promise
  await loadMasterFile();                                            //fetch the excel file -> load ->jsondata
  await loadDestinationFile();

  loadFromLocalStorage();
  createFilterButtons();
  createDestinationFilters();
  renderMappingRows();
  renderDestinationList();
  setupDragDrop();
  updateLastUpdated();

  // Event listeners
  document.getElementById('submitBtn').addEventListener('click', saveToLocalStorage);
  document.getElementById('clearAllBtn').addEventListener('click', clearAllTransactions);
  document.getElementById('searchDestination').addEventListener('input', handleSearch);
});

/*  LOAD MASTER FILE  */
async function loadMasterFile() {
  try {
    const res = await fetch("data/master.xlsx");        //load master file completely 
    const buffer = await res.arrayBuffer();
    const wb = XLSX.read(buffer, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    masterData = json
      .filter(row => {
        // Only include rows with an account number (filter out empty rows)
        return (row["Account Number"] || row["Number"] || row["Code"] || "").toString().trim() !== "";
      })
      .map((row, index) => ({
        id: "master_" + index,
        number: row["Account Number"] || row["Number"] || row["Code"] || "",
        name: row["Account Name"] || row["Name"] || row["Description"] || "",
        type: row["Type"] || row["Category"] || "Other",
        count: row["Count"] || ""
      }));
  } catch (error) {
    console.error('Error loading master file:', error);
  }
}

/*  LOAD DESTINATION FILE  */
async function loadDestinationFile() {
  try {
    const res = await fetch("data/destination.xlsx");
    const buffer = await res.arrayBuffer();
    const wb = XLSX.read(buffer, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    destinationData = json
      .filter(row => {
        // Include rows with an account code OR an account name (filter out completely empty rows)
        const hasCode = (row["AccountCode"] || "").toString().trim() !== "";
        const hasName = (row["AccountName"] || "").toString().trim() !== "";
        return hasCode || hasName;
      })
      .map((row, index) => ({
        id: "dest_" + index,
        number: String(row["AccountCode"] || ""),
        name: String(row["AccountName"] || ""),
        type: row["AccountTypeName"] || "Other"
      }));
    } catch (error) {
      console.error('Error loading destination file:', error);
    }
  }

/*  CREATE DYNAMIC FILTER BUTTONS  */
function createFilterButtons() {
  const types = ['All', ...new Set(masterData.map(item => item.type))];
  const container = document.getElementById('filterButtons');
  container.innerHTML = '';

  types.forEach(type => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-secondary tab-btn' + (type === 'All' ? ' active' : '');    //short hand condintion ? true:flase
    btn.textContent = type;
    btn.onclick = () => filterByType(type);
    container.appendChild(btn);
  });
}

/*  CREATE DESTINATION FILTER TABS WITH PAGINATION  */
function createDestinationFilters() {
  const types = ['All', ...new Set(destinationData.map(item => item.type))];
  const container = document.getElementById('destinationFilters');
  container.innerHTML = '';

  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'btn btn-sm btn-outline-secondary filter-nav-btn';
  prevBtn.innerHTML = '<i class="bi bi-caret-left-fill"></i>';
  prevBtn.onclick = () => {
    const wrapper = document.querySelector('.filter-buttons-wrapper');
    wrapper.scrollBy({ left: -150, behavior: 'smooth' });
  };
  container.appendChild(prevBtn);

  // Create a wrapper for filter buttons
  const filterWrapper = document.createElement('div');
  filterWrapper.className = 'filter-buttons-wrapper';

  // Add ALL filter buttons
  types.forEach(type => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm btn-outline-secondary filter-tab' + (type === destinationFilter ? ' active' : '');
    btn.textContent = type;
    btn.onclick = () => filterDestinationType(type);
    filterWrapper.appendChild(btn);
  });

  container.appendChild(filterWrapper);

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn-sm btn-outline-secondary filter-nav-btn';
  nextBtn.innerHTML = '<i class="bi bi-caret-right-fill"></i>';
  nextBtn.onclick = () => {
    const wrapper = document.querySelector('.filter-buttons-wrapper');
    wrapper.scrollBy({ left: 150, behavior: 'smooth' });
  };
  container.appendChild(nextBtn);
}

/*  FILTER SOURCE BY TYPE (GLOBAL - APPLIES TO BOTH)  */
function filterByType(type) {
  currentFilter = type;
  destinationFilter = type; // Global filter also applies to destination
  
  // Mapping from global button names to destination button names
  const globalToDestinationMapping = {
    'Assets': 'ASSETS',
    'Liabilities': 'LIABILITIES',
    'Equity': 'EQUITY/CAPITAL',
    'Revenue': 'Professional Services Revenue',
    'COGS': 'Outside (or "1099") Professional Services Costs',
    'Expense': 'Labor Expense'
  };
  
  // Update global filter buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent === type);       //toggle active class 
  });
  
  // Sync destination filter tabs to show selected type
  const mappedDestinationName = globalToDestinationMapping[type] || type;
  document.querySelectorAll('.filter-tab').forEach(btn => {
    const isActive = btn.textContent === mappedDestinationName;
    btn.classList.toggle('active', isActive);
    
    // Scroll the active button into view
 if (isActive) {
  setTimeout(() => {
    const wrapper = btn.closest('.filter-buttons-wrapper');
    if (!wrapper) return;

    const btnRect = btn.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    const isFullyVisible =
      btnRect.left >= wrapperRect.left &&
      btnRect.right <= wrapperRect.right;

    // Scroll only if Revenue (or any tab) is not visible
    if (!isFullyVisible) {
      const scrollLeft =
        btn.offsetLeft -
        wrapper.offsetLeft -
        wrapper.clientWidth / 2 +
        btn.clientWidth / 2;

      wrapper.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, 100);
}


  });
  
  renderMappingRows();
  renderDestinationList();
}

/*  FILTER DESTINATION BY TYPE (DESTINATION ONLY)  */
function filterDestinationType(type) {
  // Update ONLY destination filter
  destinationFilter = type;

  // Update destination filter tabs
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === type);
  });

  // DO NOT update currentFilter here
  // currentFilter = type;  // <-- REMOVED (this was the bug)

  // Re-render ONLY destination list
  renderDestinationList();
}


/* HANDLE SEARCH    */
function handleSearch(e) {
  // Clear any previous search timeout
  if (handleSearch.timeout) {
    clearTimeout(handleSearch.timeout);
  }

  // Debounce search for better performance
  handleSearch.timeout = setTimeout(() => {
    renderDestinationList();
  }, 150);
}

/*   UPDATE USED DESTINATION IDS    */
function updateUsedDestinationIds() {
  // Note: We no longer track used IDs since duplicates are allowed
  // This function is kept for backward compatibility but can be removed
  usedDestinationIds.clear();
}

/*    RENDER SOURCE ACCOUNTS AND MAPPING ROWS    */
/* Helper function to format account display - show number-name if both exist */
function formatAccountDisplay(number, name) {
  const trimmedNumber = (number || '').trim();
  const trimmedName = (name || '').trim();

  // If both are empty, return null (item should not be displayed)
  if (!trimmedNumber && !trimmedName) {
    return null;
  }
  // If both exist, show "number - name"
  if (trimmedNumber && trimmedName) {
    return `${trimmedNumber} - ${trimmedName}`;
  }
}

function renderMappingRows() {
  const container = document.getElementById("mappingRowsContainer");
  container.innerHTML = "";

  const filtered = currentFilter === 'All'
    ? masterData
    : masterData.filter(item => item.type === currentFilter);

  filtered.forEach(acc => {
    const mapping = mappings[acc.number] || { mostLikely: null, likely: null, possible: null };

    const rowDiv = document.createElement("div");
    rowDiv.className = "row g-2 mb-2 align-items-stretch";
    rowDiv.setAttribute('data-source-number', acc.number);

    rowDiv.innerHTML = `
      <div class="col-3">
        <div class="account-box">
          <span class="account-number">${acc.number} - ${acc.name}</span>
          ${acc.count ? `<span class="account-count">${acc.count}</span>` : ''}
        </div>
      </div>
      
      <div class="col-9">
        <div class="row g-2 h-100">
          <div class="col-4">
            <div class="drop-box" data-source-number="${acc.number}" data-zone="mostLikely">
              ${mapping.mostLikely ? createMappedAccountHTML(mapping.mostLikely) : '<div class="empty-slot">Drop here</div>'}
            </div>
          </div>
          <div class="col-4">
            <div class="drop-box" data-source-number="${acc.number}" data-zone="likely">
              ${mapping.likely ? createMappedAccountHTML(mapping.likely) : '<div class="empty-slot">Drop here</div>'}
            </div>
          </div>
          <div class="col-4">
            <div class="drop-box" data-source-number="${acc.number}" data-zone="possible">
              ${mapping.possible ? createMappedAccountHTML(mapping.possible) : '<div class="empty-slot">Drop here</div>'}
            </div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(rowDiv);
  });

  // Reinitialize drag and drop
  setupDragDrop();
}

/*    CREATE MAPPED ACCOUNT HTML    */
function createMappedAccountHTML(item) {
  return `
    <div class="dest-item mapped-item" draggable="true" data-id="${item.id}">
      <span>${item.number} - ${item.name}</span>
    </div>
  `;
}

/*    RENDER DESTINATION LIST (NO PAGINATION)    */
function renderDestinationList() {
  const el = document.getElementById("destinationList");
  const searchInput = document.getElementById('searchDestination');
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';

  // Get the mapped type for the current destination filter
  const mappedType = typeMapping[destinationFilter] || destinationFilter;

  // Filter by type - flexible matching with type mapping
  let filtered = destinationFilter === 'All'
    ? destinationData
    : destinationData.filter(item => {
      const itemNumberLower = (item.number || '').toLowerCase().trim();

      // Items WITHOUT a number - show them if they have a name (don't filter by type)
      if (!itemNumberLower) {
        return (item.name || '').toString().trim() !== '';
      }

      // Items WITH a number - filter by type matching or range
      const itemTypeLower = (item.type || '').toLowerCase().trim();
      const filterLower = destinationFilter.toLowerCase().trim();
      const itemNumber = parseInt(item.number) || 0;

      // Handle range-based mapping (for Other Revenue/Expense)
      if (mappedType && typeof mappedType === 'object' && mappedType.type === 'range') {
        return itemNumber >= mappedType.min && itemNumber <= mappedType.max;
      }

      // Handle both single and array mappings
      const mappedTypes = Array.isArray(mappedType) ? mappedType : [mappedType];

      // Try multiple matching strategies:
      // 1. Exact match on destination type
      if (itemTypeLower === filterLower) return true;

      // 2. Match on mapped types
      for (let mType of mappedTypes) {
        if (!mType) continue;
        const mappedLower = (mType || '').toLowerCase().trim();
        if (itemTypeLower === mappedLower) return true;
        // 3. Substring match in either direction
        if (itemTypeLower.includes(mappedLower) || mappedLower.includes(itemTypeLower)) return true;
      }

      return false;
    });

  // Filter by search - search in both number and name
  if (searchTerm) {
    filtered = filtered.filter(item => {
      const numberMatch = String(item.number).toLowerCase().includes(searchTerm);
      const nameMatch = String(item.name).toLowerCase().includes(searchTerm);
      return numberMatch || nameMatch;
    });
  }

  // NO LONGER filter out used accounts - duplicates are allowed
  // updateUsedDestinationIds();
  // filtered = filtered.filter(item => !usedDestinationIds.has(item.id));

  // Filter out items where both number and name are empty
  filtered = filtered.filter(item => formatAccountDisplay(item.number, item.name) !== null);

  // Show message if no results
  if (filtered.length === 0) {
    el.innerHTML = '<div class="text-muted text-center p-3">No accounts found</div>';
    return;
  }

  // Render all items (no pagination)
  el.innerHTML = filtered.map(acc => `
    <div class="dest-item" draggable="true" data-id="${acc.id}" data-type="${acc.type}">
      <span>${acc.number} - ${acc.name}</span>
    </div>
  `).join('');
}

/*    HELPERS: PARTIAL UPDATES TO AVOID FULL RERENDERS    */
function passesDestinationFilters(item, searchTerm) {
  const mappedType = typeMapping[destinationFilter] || destinationFilter;

  // Items with neither number nor name should be hidden
  if (formatAccountDisplay(item.number, item.name) === null) return false;

  // Filter by type / mapping
  if (destinationFilter !== 'All') {
    if (mappedType && typeof mappedType === 'object' && mappedType.type === 'range') {
      const itemNumber = parseInt(item.number) || 0;
      if (!(itemNumber >= mappedType.min && itemNumber <= mappedType.max)) return false;
    } else {
      const mappedTypes = Array.isArray(mappedType) ? mappedType : [mappedType];
      const itemTypeLower = (item.type || '').toLowerCase().trim();
      const filterLower = destinationFilter.toLowerCase().trim();
      if (itemTypeLower === filterLower) {
        // ok
      } else {
        let matched = false;
        for (let mType of mappedTypes) {
          if (!mType) continue;
          const mappedLower = (mType || '').toLowerCase().trim();
          if (itemTypeLower === mappedLower || itemTypeLower.includes(mappedLower) || mappedLower.includes(itemTypeLower)) {
            matched = true;
            break;
          }
        }
        if (!matched) return false;
      }
    }
  }

  // Search term check
  if (searchTerm) {
    const numberMatch = String(item.number).toLowerCase().includes(searchTerm);
    const nameMatch = String(item.name).toLowerCase().includes(searchTerm);
    if (!(numberMatch || nameMatch)) return false;
  }

  // NO LONGER filter out used destination ids - duplicates are allowed
  // updateUsedDestinationIds();
  // if (usedDestinationIds.has(item.id)) return false;

  return true;
}

function createDestinationElement(item) {
  const div = document.createElement('div');
  div.className = 'dest-item';
  div.setAttribute('draggable', 'true');
  div.setAttribute('data-id', item.id);
  div.setAttribute('data-type', item.type || '');
  div.innerHTML = `<span>${item.number} - ${item.name}</span>`;
  return div;
}

function updateMappingRow(sourceNumber) {
  const rowDiv = document.querySelector(`#mappingRowsContainer [data-source-number=\"${CSS.escape(sourceNumber)}\"]`);
  if (!rowDiv) return;

  const mapping = mappings[sourceNumber] || { mostLikely: null, likely: null, possible: null };

  const most = rowDiv.querySelector('[data-zone="mostLikely"]');
  const likely = rowDiv.querySelector('[data-zone="likely"]');
  const poss = rowDiv.querySelector('[data-zone="possible"]');

  if (most) most.innerHTML = mapping.mostLikely ? createMappedAccountHTML(mapping.mostLikely) : '<div class="empty-slot">Drop here</div>';
  if (likely) likely.innerHTML = mapping.likely ? createMappedAccountHTML(mapping.likely) : '<div class="empty-slot">Drop here</div>';
  if (poss) poss.innerHTML = mapping.possible ? createMappedAccountHTML(mapping.possible) : '<div class="empty-slot">Drop here</div>';
}

function updateDestinationVisibilityForId(itemId) {
  // This function is no longer needed since we don't hide used items
  // Kept for backward compatibility
  return;
}

/*    CHECK IF ACCOUNT ID ALREADY EXISTS IN ROW    */
function isAccountAlreadyInRow(sourceNumber, accountId) {
  const mapping = mappings[sourceNumber];
  if (!mapping) return false;
  
  // Check all three zones in the row
  if (mapping.mostLikely && mapping.mostLikely.id === accountId) return true;
  if (mapping.likely && mapping.likely.id === accountId) return true;
  if (mapping.possible && mapping.possible.id === accountId) return true;
  
  return false;
}

/*    SETUP DRAG & DROP    */
function setupDragDrop() {
  const container = document.getElementById("mappingRowsContainer");
  const destList = document.getElementById("destinationList");

  // Make destination items draggable
  destList.addEventListener('dragstart', handleDragStartFromDestination);

  // Make mapped items draggable
  container.addEventListener('dragstart', handleDragStartFromMapping);

  // Handle drop zones on mapping container
  container.addEventListener('dragover', handleDragOver);
  container.addEventListener('dragleave', handleDragLeave);
  container.addEventListener('drop', handleDrop);

  // Handle drop zones on destination list (to put items back)
  destList.addEventListener('dragover', handleDragOverDestination);
  destList.addEventListener('dragleave', handleDragLeaveDestination);
  destList.addEventListener('drop', handleDropOnDestination);

  // Cleanup
  document.addEventListener('dragend', handleDragEnd);
}

/*    DRAG START FROM DESTINATION    */
function handleDragStartFromDestination(e) {
  if (e.target.classList.contains('dest-item')) {
    const itemId = e.target.getAttribute('data-id');
    e.dataTransfer.setData('text/plain', JSON.stringify({
      source: 'destination',
      itemId: itemId
    }));
    e.target.classList.add('dragging');
    // Set effectAllowed to 'copy' to indicate this is a copy operation
    e.dataTransfer.effectAllowed = 'copy';
  }
}

/*    DRAG START FROM MAPPING    */
function handleDragStartFromMapping(e) {
  if (e.target.classList.contains('mapped-item')) {
    const dropBox = e.target.closest('.drop-box');
    const sourceNumber = dropBox.getAttribute('data-source-number');
    const zone = dropBox.getAttribute('data-zone');
    const itemId = e.target.getAttribute('data-id');

    e.dataTransfer.setData('text/plain', JSON.stringify({
      source: 'mapping',
      sourceNumber: sourceNumber,
      zone: zone,
      itemId: itemId
    }));
    e.target.classList.add('dragging');
    // Set effectAllowed to 'move' for items being moved from mapping
    e.dataTransfer.effectAllowed = 'move';
  }
}

/*    DRAG OVER    */
function handleDragOver(e) {
  e.preventDefault();
  const dropBox = e.target.closest('.drop-box');
  if (dropBox) {
    dropBox.classList.add('drag-over');
  }
}

/*    DRAG LEAVE    */
function handleDragLeave(e) {
  const dropBox = e.target.closest('.drop-box');
  if (dropBox && !dropBox.contains(e.relatedTarget)) {
    dropBox.classList.remove('drag-over');
  }
}

/*    DRAG OVER DESTINATION LIST    */
function handleDragOverDestination(e) {
  e.preventDefault();
  const destList = document.getElementById('destinationList');
  if (destList) {
    destList.classList.add('drag-over');
  }
}

/*    DRAG LEAVE DESTINATION LIST    */
function handleDragLeaveDestination(e) {
  const destList = document.getElementById('destinationList');
  if (destList && !destList.contains(e.relatedTarget)) {
    destList.classList.remove('drag-over');
  }
}

/*    HANDLE DROP    */
function handleDrop(e) {
  e.preventDefault();
  const dropBox = e.target.closest('.drop-box');
  if (!dropBox) return;

  dropBox.classList.remove('drag-over');

  const sourceNumber = dropBox.getAttribute('data-source-number');
  const targetZone = dropBox.getAttribute('data-zone');
  const data = JSON.parse(e.dataTransfer.getData('text/plain'));

  if (data.source === 'destination') {
    // Check if this account already exists in the row
    if (isAccountAlreadyInRow(sourceNumber, data.itemId)) {
      // Show SweetAlert warning
      Swal.fire({
        icon: 'warning',
        title: 'Duplicate Account',
        text: 'This account is already mapped in this row. Please select a different account.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return; // Don't proceed with the drop
    }
    
    // Copy the account from destination (don't remove it)
    handleDropFromDestination(data.itemId, sourceNumber, targetZone);
    // Update only affected row (no need to update destination visibility)
    updateMappingRow(sourceNumber);
  } else if (data.source === 'mapping') {
    // When moving from mapping, check if it's a duplicate (unless moving within same row)
    const item = destinationData.find(d => d.id === data.itemId);
    if (item && data.sourceNumber !== sourceNumber && isAccountAlreadyInRow(sourceNumber, data.itemId)) {
      // Show SweetAlert warning
      Swal.fire({
        icon: 'warning',
        title: 'Duplicate Account',
        text: 'This account is already mapped in this row. Please select a different account.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return; // Don't proceed with the drop
    }
    
    handleDropFromMapping(data, sourceNumber, targetZone);
    // Update target row
    updateMappingRow(sourceNumber);
    // If moved from another source, update that row as well
    if (data.sourceNumber && data.sourceNumber !== sourceNumber) updateMappingRow(data.sourceNumber);
  }
}

/*    HANDLE DROP ON DESTINATION LIST (PUT BACK)    */
function handleDropOnDestination(e) {
  e.preventDefault();
  const destList = document.getElementById('destinationList');
  if (destList) {
    destList.classList.remove('drag-over');
  }

  try {
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));

    // Only allow dropping mapped items back to destination
    if (data.source === 'mapping') {
      const sourceMapping = mappings[data.sourceNumber];
      if (sourceMapping && sourceMapping[data.zone]) {
        // Remove the item from the mapping
        sourceMapping[data.zone] = null;

        // Update only the affected row
        updateMappingRow(data.sourceNumber);
        // No need to update destination visibility since items are always visible
      }
    }
  } catch (err) {
    console.error('Error dropping on destination:', err);
  }
}

/*    HANDLE DROP FROM DESTINATION    */
function handleDropFromDestination(itemId, sourceNumber, targetZone) {
  const item = destinationData.find(d => d.id === itemId);
  if (!item) return;

  if (!mappings[sourceNumber]) {
    mappings[sourceNumber] = { mostLikely: null, likely: null, possible: null };
  }

  const mapping = mappings[sourceNumber];

  // Handle replacement and cascading
  if (targetZone === 'mostLikely') {
    const displaced = mapping.mostLikely;
    mapping.mostLikely = { ...item };

    if (displaced) {
      const displaced2 = mapping.likely;
      mapping.likely = displaced;

      if (displaced2) {
        mapping.possible = displaced2;
      }
    }
  } else if (targetZone === 'likely') {
    const displaced = mapping.likely;
    mapping.likely = { ...item };

    if (displaced) {
      mapping.possible = displaced;
    }
  } else if (targetZone === 'possible') {
    mapping.possible = { ...item };
  }
  // Return the id that was mapped
  return item.id;
}

/*    HANDLE DROP FROM MAPPING (REORDERING)    */
function handleDropFromMapping(data, targetSourceNumber, targetZone) {
  if (data.sourceNumber === targetSourceNumber) {
    // Same source - reordering
    const mapping = mappings[targetSourceNumber];
    if (!mapping) return;

    const item = mapping[data.zone];
    if (!item) return;

    // Remove from original zone
    mapping[data.zone] = null;

    // Add to target zone with cascading
    if (targetZone === 'mostLikely') {
      const displaced = mapping.mostLikely;
      mapping.mostLikely = item;

      if (displaced) {
        const displaced2 = mapping.likely;
        mapping.likely = displaced;

        if (displaced2) {
          mapping.possible = displaced2;
        }
      }
    } else if (targetZone === 'likely') {
      const displaced = mapping.likely;
      mapping.likely = item;

      if (displaced) {
        mapping.possible = displaced;
      }
    } else if (targetZone === 'possible') {
      mapping.possible = item;
    }
    return [];
  } else {
    // Different source - move between sources
    const sourceMapping = mappings[data.sourceNumber];
    if (!sourceMapping) return;

    const item = sourceMapping[data.zone];
    if (!item) return;

    // Remove from source
    sourceMapping[data.zone] = null;

    // Add to target
    const affectedId = handleDropFromDestination(item.id, targetSourceNumber, targetZone);
    return affectedId ? [affectedId] : [];
  }
}

/* DRAG END*/
function handleDragEnd(e) {
  document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
  document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
}

/*    SAVE TO LOCAL STORAGE    */
function saveToLocalStorage() {
  const dataToSave = {
    mappings,
    timestamp: new Date().toISOString()
  };

  localStorage.setItem('accountMappings', JSON.stringify(dataToSave));
  updateLastUpdated();
  Swal.fire({
    icon: 'success',
    title: 'Saved!',
    text: 'Data saved successfully!',
    timer: 2000,
    showConfirmButton: false
  });
}

/*    LOAD FROM LOCAL STORAGE    */
function loadFromLocalStorage() {
  const saved = localStorage.getItem('accountMappings');
  if (saved) {
    const data = JSON.parse(saved);
    mappings = data.mappings || {};
  }
}

/*    CLEAR ALL TRANSACTIONS    */
function clearAllTransactions() {
  Swal.fire({
    title: 'Are you sure?',
    text: 'All transactions will be cleared. This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, clear all!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      // Clear mappings from localStorage
      localStorage.removeItem('accountMappings');
      // Reset mappings object
      mappings = {};
      // Re-render the UI
      renderMappingRows();
      renderDestinationList();
      // Update last updated timestamp (will show nothing since cleared)
      updateLastUpdated();
      
      Swal.fire({
        icon: 'success',
        title: 'Cleared!',
        text: 'All transactions cleared successfully!',
        timer: 2000,
        showConfirmButton: false
      });
    }
  });
}

/*    UPDATE LAST UPDATED TIMESTAMP    */
function updateLastUpdated() {
  const saved = localStorage.getItem('accountMappings');
  if (saved) {
    const data = JSON.parse(saved);
    const date = new Date(data.timestamp);
    const formatted = date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    document.getElementById('lastUpdated').textContent = `Last Updated on ${formatted}`;
  } else {
    document.getElementById('lastUpdated').textContent = 'Last Updated on --';
  }
}

/* ================= LOGOUT FUNCTIONALITY ================= */
document.getElementById('logoutLink')?.addEventListener('click', (e) => {
  e.preventDefault();
  Swal.fire({
    title: 'Logout',
    text: 'Are you sure you want to logout?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('loginEmail');
      window.location.href = 'login.html';
    }
  });
});