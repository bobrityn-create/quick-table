function exportToExcel() {
    try {
        const table = document.getElementById('editableTable');
        const tableTitle = document.getElementById('tableTitle').value || 'Таблица';

        if (!table.rows.length) {
            alert('Таблица пустая! Сначала создайте таблицу.');
            return;
        }

        // Создаем HTML таблицу с границами для Excel
        let htmlContent = 
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <!--[if gte mso 9]>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>${tableTitle}</x:Name>
                            <x:WorksheetOptions>
                                <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
            <![endif]-->
            <style>
                table {
                    border-collapse: collapse;
                    border: 2px solid #000000;
                    width: 100%;
                }
                th {
                    background-color: #4CAF50;
                    color: white;
                    border: 1px solid #000000;
                    padding: 8px;
                    font-weight: bold;
                    text-align: center;
                }
                td {
                    border: 1px solid #000000;
                    padding: 8px;
                    text-align: left;
                }
                .row-header {
                    background-color: #2196F3;
                    color: white;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
        <table>
        ;

        // Добавляем строки таблицы в HTML
        for (let i = 0; i < table.rows.length; i++) {
            htmlContent += '<tr>';
            const cells = table.rows[i].cells;
            
            for (let j = 0; j < cells.length; j++) {
                const cellValue = cells[j].textContent || '';
                const cellClass = cells[j].className;
                
                // Определяем тег и классы для ячейки
                let tag = 'td';
                let style = '';
                
                if (cellClass.includes('column-header') || cellClass.includes('row-header')) {
                    tag = 'th';
                    if (cellClass.includes('row-header')) {
                        style = ' class="row-header"';
                    }
                }
                
                htmlContent += <${tag}${style}>${cellValue}</${tag}>;
            }
            htmlContent += '</tr>';
        }

        htmlContent += 
        </table>
        </body>
        </html>
        ;

        // Создаем и скачиваем файл
        const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', tableTitle + '.xls');
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('Таблица "' + tableTitle + '" успешно экспортирована в Excel с границами!');

    } catch (error) {
        console.error('Ошибка экспорта:', error);
        alert('Ошибка при экспорте: ' + error.message);
    }
}

function createTable() {
    try {
        const columns = parseInt(document.getElementById('columns').value) || 3;
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
