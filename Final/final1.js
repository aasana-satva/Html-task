// --- 1. Initialize ExcelJS Workbook & Worksheet ---
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Timesheet');

worksheet.columns = [
    { header: 'ID', key: 'id' },
    { header: 'Project', key: 'project' },
    { header: 'Date', key: 'date' },
    { header: 'Phase', key: 'phase' },
    { header: 'Status', key: 'status' },
    { header: 'Logged', key: 'logged' },
    { header: 'Billable', key: 'billable' },
    { header: 'Notes', key: 'notes' },
    { header: 'OOS', key: 'oos' },
    { header: 'BC', key: 'bc' },
    { header: 'BC Desc', key: 'bcdesc' }
];

let rowId = 0; // Will be set dynamically

// --- 2. Restoration Logic (Run on Page Load) ---
function init() {
    const savedData = JSON.parse(sessionStorage.getItem('timesheet') || '[]');
    
    // Clear existing HTML (if any)
    $('#entryTable tbody').empty();

    if (savedData.length > 0) {
        // REBUILD FROM SESSION
        savedData.forEach(data => {
            // Add to Excel
            worksheet.addRow(data);
            
            // Add to HTML
            $('#entryTable tbody').append(createRow(data.id));
            
            // Populate HTML values
            const row = $(`#entryTable tbody tr[data-id="${data.id}"]`);
            row.find('.project').val(data.project);
            row.find('.date').val(data.date);
            row.find('.phase').val(data.phase);
            row.find('.status').val(data.status);
            row.find('.logged').val(data.logged);
            row.find('.billable').val(data.billable);
            row.find('.notes').val(data.notes);
            row.find('.oos').prop('checked', data.oos);
            row.find('.bc').val(data.bc);
            row.find('.bcdesc').val(data.bcdesc);
        });
        
        // Update rowId tracker to the last ID found
        rowId = savedData[savedData.length - 1].id;
        
        // Render the display table immediately
        renderDisplay();
    } else {
        // DEFAULT START (1 Empty Row)
        rowId = 1;
        addRowToExcel(rowId);
        $('#entryTable tbody').append(createRow(rowId));
    }
}

// Call init immediately
init();

// --- 3. Helper Functions ---

function addRowToExcel(id) {
    worksheet.addRow({
        id: id,
        project: '', date: '', phase: '', status: '',
        logged: '', billable: '', notes: '', oos: false,
        bc: '', bcdesc: ''
    });
}

function createRow(id) {
    return `<tr data-id="${id}">
        <td class="id">${id}</td>
        <td><select class="form-select project" required>
            <option value="">Select</option>
            <option>Satva Internal</option>
            <option>Satva Training</option>
        </select></td>
        <td><input type="date" class="form-control date" required></td>
        <td><select class="form-select phase" required>
            <option value="">Select</option>
            <option>Bug Fixing</option>
            <option>Communication</option>
            <option>Analysis</option>
            <option>Development</option>
            <option>Deployment</option>
        </select></td>
        <td><select class="form-select status" required>
            <option value="">Select</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Working</option>
            <option>Solved</option>
        </select></td>
        <td><input type="time" class="form-control logged" min="0" required></td>
        <td><input type="time"  class="form-control billable" min="0" required></td>
        <td><input type="text" class="form-control notes" required></td>
        <td class="text-center"><input type="checkbox" class="oos"></td>
        <td><input type="url" class="form-control bc" required></td>
        <td><input type="text" class="form-control bcdesc" required></td>
    </tr>`;
}

function toMinutes(t) {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}

function validateHours(row) {
    const loggedVal = row.find('.logged').val();
    const billableVal = row.find('.billable').val();
    const logged = toMinutes(loggedVal);
    const billable = toMinutes(billableVal);
    
    if (billable > logged) {
        row.find('.billable').val(loggedVal);
    }
}

// --- 4. Core Logic: Sync Excel to Session Storage ---

function saveExcelToSession() {
    const sessionData = [];

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip Header

        const rowData = {
            id: row.getCell('id').value,
            project: row.getCell('project').value || '',
            date: row.getCell('date').value || '',
            phase: row.getCell('phase').value || '',
            status: row.getCell('status').value || '',
            logged: row.getCell('logged').value || '',
            billable: row.getCell('billable').value || '',
            notes: row.getCell('notes').value || '',
            oos: row.getCell('oos').value || false,
            bc: row.getCell('bc').value || '',
            bcdesc: row.getCell('bcdesc').value || ''
        };
        
        // Save EVERY row to session so we can restore partially filled forms on refresh
        sessionData.push(rowData);
    });

    sessionStorage.setItem('timesheet', JSON.stringify(sessionData));
    renderDisplay();
}

function renderDisplay() {
    const tbody = $('#displayTable tbody');
    tbody.empty();
    $('#displayWrapper').addClass('d-none');

    const rawData = JSON.parse(sessionStorage.getItem('timesheet') || '[]');
    
    // Filter for "Complete" rows only for the display table
    const completedRows = rawData.filter(r => {
        return r.project && r.date && r.phase && r.status && 
               r.logged && r.billable && r.notes && r.bc && r.bcdesc;
    });

    if (completedRows.length === 0) return;

    $('#displayWrapper').removeClass('d-none');

    completedRows.forEach(r => {
        tbody.append(`
          <tr>
            <td>${r.id}</td>
            <td>${r.project}</td>
            <td>${r.date}</td>
            <td>${r.phase}</td>
            <td>${r.status}</td>
            <td>${r.logged}</td>
            <td>${r.billable}</td>
            <td>${r.notes}</td>
            <td>${r.oos ? 'Yes' : 'No'}</td>
            <td>${r.bc}</td>
            <td>${r.bcdesc}</td>
          </tr>
        `);
    });
}

// --- 5. Event Listeners ---

// ADD ROW
$('#addRow').on('click', function () {
    const count = parseInt($('#rowCount').val());
    if (!count || count <= 0) {
        alert('Enter valid number of rows');
        return;
    }

    for (let i = 0; i < count; i++) {
        rowId++;
        addRowToExcel(rowId);
        $('#entryTable tbody').append(createRow(rowId));
    }
    saveExcelToSession(); // Save the new blank rows to session immediately
});

// DELETE ROW
$('#deleteRow').on('click', function () {
    // Determine how many rows constitute the header. 
    // In ExcelJS, rowCount includes the header row.
    // If rowCount is 1, it's just the header. 
    // If rowCount is 2, it's header + 1 data row.
    
    // Logic: If there is only 1 data row left, warn user but allow delete if they confirm? 
    // Usually, you might want to keep at least one row, but if you want full deletion support:
    if (worksheet.rowCount <= 1) {
        alert("No rows to delete.");
        return;
    }

    if (!confirm('Are you sure you want to delete the last row?')) return;

    // 1. Remove from Excel
    const lastRowIndex = worksheet.rowCount; // Get index of last row
    worksheet.spliceRows(lastRowIndex, 1);

    // 2. Remove from HTML
    $('#entryTable tbody tr:last').remove();

    // 3. Update ID tracker (optional, prevents ID gaps if you continue adding)
    rowId--; 

    // 4. Update Session immediately
    saveExcelToSession();
});

// INPUT CHANGE
$('#entryTable').on('input change', 'input, select', function () {
    const input = $(this);
    const row = input.closest('tr');
    
    // Validate Hours First
    if (input.hasClass('logged') || input.hasClass('billable')) {
        validateHours(row); 
    }

    // Find the correct row in Excel using the data-id
    const id = row.data('id');
    
    // We iterate to find the specific Excel row with this ID because splicing/deleting 
    // might have shifted the physical row numbers, but IDs remain unique.
    let excelRow;
    worksheet.eachRow((r, number) => {
        if(r.getCell('id').value == id) {
            excelRow = r;
        }
    });

    if (excelRow) {
        excelRow.getCell('project').value = row.find('.project').val();
        excelRow.getCell('date').value = row.find('.date').val();
        excelRow.getCell('phase').value = row.find('.phase').val();
        excelRow.getCell('status').value = row.find('.status').val();
        excelRow.getCell('logged').value = row.find('.logged').val();
        excelRow.getCell('billable').value = row.find('.billable').val();
        excelRow.getCell('notes').value = row.find('.notes').val();
        excelRow.getCell('oos').value = row.find('.oos').is(':checked');
        excelRow.getCell('bc').value = row.find('.bc').val();
        excelRow.getCell('bcdesc').value = row.find('.bcdesc').val();
        
        excelRow.commit();
        saveExcelToSession();
    }
});