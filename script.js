const rows = parseInt(document.getElementById('rows').value) || 3;
        const table = document.getElementById('editableTable');
        const columnNamesInput = document.getElementById('columnNames').value;
        const rowNamesInput = document.getElementById('rowNames').value;
        
        table.innerHTML = '';
        
        const columnNames = columnNamesInput ? columnNamesInput.split(',').map(function(name) { 
            return name.trim(); 
        }) : [];
        
        const rowNames = rowNamesInput ? rowNamesInput.split(',').map(function(name) { 
            return name.trim(); 
        }) : [];
        
        const headerRow = table.insertRow();
        const emptyHeader = document.createElement('th');
        emptyHeader.textContent = '';
        emptyHeader.className = 'column-header';
        headerRow.appendChild(emptyHeader);
        
        for (let i = 0; i < columns; i++) {
            const th = document.createElement('th');
            th.textContent = columnNames[i] || 'Колонка ' + (i + 1);
            th.contentEditable = true;
            th.className = 'column-header';
            headerRow.appendChild(th);
        }
        
        for (let i = 0; i < rows; i++) {
            const row = table.insertRow();
            const rowHeader = row.insertCell();
            rowHeader.textContent = rowNames[i] || 'Строка ' + (i + 1);
            rowHeader.contentEditable = true;
            rowHeader.className = 'row-header';
            
            for (let j = 0; j < columns; j++) {
                const cell = row.insertCell();
                cell.contentEditable = true;
                cell.textContent = '';
                cell.className = 'data-cell';
            }
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при создании таблицы: ' + error.message);
    }
}

function clearTable() {
    if (confirm('Очистить всю таблицу?')) {
        document.getElementById('editableTable').innerHTML = '';
        document.getElementById('tableTitle').value = '';
        document.getElementById('columnNames').value = '';
        document.getElementById('rowNames').value = '';
        document.getElementById('columns').value = '3';
        document.getElementById('rows').value = '3';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    createTable();
    document.getElementById('createBtn').addEventListener('click', createTable);
    document.getElementById('exportBtn').addEventListener('click', exportToExcel);
    document.getElementById('clearBtn').addEventListener('click', clearTable);
});
