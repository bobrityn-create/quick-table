// Анимации и статистика
let tablesCreated = 0;
let cellsProcessed = 0;
let exportsCompleted = 0;

function updateStats() {
    document.getElementById('tableCount').textContent = tablesCreated;
    document.getElementById('cellCount').textContent = cellsProcessed;
    document.getElementById('exportCount').textContent = exportsCompleted;
}

function changeColumns(delta) {
    const input = document.getElementById('columns');
    const newValue = parseInt(input.value) + delta;
    if (newValue >= parseInt(input.min) && newValue <= parseInt(input.max)) {
        input.value = newValue;
        updateTableSize();
    }
}

function changeRows(delta) {
    const input = document.getElementById('rows');
    const newValue = parseInt(input.value) + delta;
    if (newValue >= parseInt(input.min) && newValue <= parseInt(input.max)) {
        input.value = newValue;
        updateTableSize();
    }
}

function updateTableSize() {
    const columns = document.getElementById('columns').value;
    const rows = document.getElementById('rows').value;
    document.getElementById('tableSize').textContent = ${columns}×${rows};
}

// Обнови функцию createTable() для подсчета статистики
function createTable() {
    const columns = parseInt(document.getElementById('columns').value) || 3;
    const rows = parseInt(document.getElementById('rows').value) || 3;
    const table = document.getElementById('editableTable');
    
    table.innerHTML = '';
    currentTable = table;
    
    // Создание таблицы...
    
    // Обновляем статистику
    tablesCreated++;
    cellsProcessed += columns * rows;
    updateStats();
    updateTableSize();
// Глобальные переменные для управления таблицей
let currentTable = null;
let isResizing = false;
let currentCol = null;
let startX = 0;
let startWidth = 0;

function createTable() {
    const columns = parseInt(document.getElementById('columns').value) || 3;
    const rows = parseInt(document.getElementById('rows').value) || 3;
    const table = document.getElementById('editableTable');
    
    // Очищаем таблицу
    table.innerHTML = '';
    currentTable = table;
    
    // Создаем строку заголовков с возможностью изменения размера
    const headerRow = table.insertRow();
    headerRow.className = 'table-header';
    
    for (let i = 0; i < columns; i++) {
        const th = document.createElement('th');
        th.innerHTML = 
            <div class="col-header">
                <span>Колонка ${i + 1}</span>
                <div class="resize-handle"></div>
            </div>
        ;
        th.contentEditable = true;
        
        // Добавляем обработчики для изменения размера
        const resizeHandle = th.querySelector('.resize-handle');
        resizeHandle.addEventListener('mousedown', (e) => startResize(e, i));
        
        headerRow.appendChild(th);
    }
    
    // Создаем строки с данными
    for (let i = 0; i < rows; i++) {
        const row = table.insertRow();
        for (let j = 0; j < columns; j++) {
            const cell = row.insertCell();
            cell.contentEditable = true;
            cell.dataset.formula = '';
            cell.textContent = '';
            
            // Обработчик для ввода формул
            cell.addEventListener('input', handleCellInput);
            cell.addEventListener('blur', calculateFormulas);
            
            // Подсказка при фокусе
            cell.addEventListener('focus', function() {
                if (this.dataset.formula) {
                    this.title = Формула: ${this.dataset.formula};
                }
            });
        }
    }
    
    initResizeEvents();
}

// Функции для изменения размера колонок (остаются без изменений)
function startResize(e, colIndex) {
    isResizing = true;
    currentCol = colIndex;
    startX = e.clientX;
    startWidth = currentTable.rows[0].cells[colIndex].offsetWidth;
    
    e.preventDefault();
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
}

function handleResize(e) {
    if (!isResizing) return;
    
    const width = startWidth + (e.clientX - startX);
    if (width > 50) {
        currentTable.rows[0].cells[currentCol].style.width = width + 'px';
        
        for (let i = 1; i < currentTable.rows.length; i++) {
            currentTable.rows[i].cells[currentCol].style.width = width + 'px';
        }
    }
}

function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
}

function initResizeEvents() {
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
}

// Обработчик ввода в ячейку (для формул)
function handleCellInput(e) {
    const cell = e.target;
    const value = cell.textContent.trim();
    
    if (value.startsWith('=')) {
        cell.dataset.formula = value;
        cell.classList.add('formula-cell');
    } else {
        cell.dataset.formula = '';
        cell.classList.remove('formula-cell');
    }
}

// Вычисление формул (остается без изменений)
function calculateFormulas() {
    if (!currentTable) return;
    
    const rows = currentTable.rows;
    
    for (let i = 1; i < rows.length; i++) {
        for (let j = 0; j < rows[i].cells.length; j++) {
            const cell = rows[i].cells[j];
            const formula = cell.dataset.formula;

> Fertyni:
if (formula && formula.startsWith('=')) {
                try {
                    const result = evaluateFormula(formula, i, j);
                    if (result !== null) {
                        cell.dataset.originalText = cell.textContent;
                        cell.textContent = result;
                    }
                } catch (error) {
                    cell.textContent = '#ОШИБКА!';
                }
            }
        }
    }
}

// Функция вычисления простых формул (остается без изменений)
function evaluateFormula(formula, rowIndex, colIndex) {
    let expr = formula.substring(1).replace(/\s/g, '');
    
    if (expr.toUpperCase().startsWith('СУММ(')) {
        const range = expr.match(/СУММ\(([^)]+)\)/i)[1];
        return sumRange(range, rowIndex);
    }
    
    if (expr.toUpperCase().startsWith('СРЗНАЧ(')) {
        const range = expr.match(/СРЗНАЧ\(([^)]+)\)/i)[1];
        return averageRange(range, rowIndex);
    }
    
    try {
        expr = expr.replace(/[A-Z](\d+)/gi, (match) => {
            return getCellValue(match, rowIndex);
        });
        
        const result = eval(expr);
        return isNaN(result) ? null : Math.round(result * 100) / 100;
    } catch (error) {
        return null;
    }
}

// Вспомогательные функции для формул (остаются без изменений)
function getCellValue(cellRef, currentRow) {
    if (!currentTable) return 0;
    
    const colLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const colChar = cellRef.charAt(0).toUpperCase();
    const rowNum = parseInt(cellRef.substring(1)) - 1;
    
    const colIndex = colLetters.indexOf(colChar);
    
    if (colIndex >= 0 && rowNum >= 0 && currentTable.rows[rowNum + 1]) {
        const cell = currentTable.rows[rowNum + 1].cells[colIndex];
        const value = parseFloat(cell.textContent) || 0;
        return value;
    }
    
    return 0;
}

function sumRange(range, currentRow) {
    const [start, end] = range.split(':');
    let sum = 0;
    let count = 0;
    
    const startCol = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(start.charAt(0).toUpperCase());
    const endCol = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(end.charAt(0).toUpperCase());
    const startRow = parseInt(start.substring(1)) - 1;
    const endRow = parseInt(end.substring(1)) - 1;
    
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            if (currentTable.rows[row + 1] && currentTable.rows[row + 1].cells[col]) {
                const value = parseFloat(currentTable.rows[row + 1].cells[col].textContent) || 0;
                sum += value;
                count++;
            }
        }
    }
    
    return count > 0 ? sum : 0;
}

function averageRange(range, currentRow) {
    const [start, end] = range.split(':');
    let sum = 0;
    let count = 0;
    
    const startCol = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(start.charAt(0).toUpperCase());
    const endCol = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(end.charAt(0).toUpperCase());
    const startRow = parseInt(start.substring(1)) - 1;
    const endRow = parseInt(end.substring(1)) - 1;
    
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            if (currentTable.rows[row + 1] && currentTable.rows[row + 1].cells[col]) {
                const value = parseFloat(currentTable.rows[row + 1].cells[col].textContent) || 0;
                sum += value;
                count++;
            }
        }
    }
    
    return count > 0 ? Math.round((sum / count) * 100) / 100 : 0;
}

// НОВАЯ ФУНКЦИЯ: Экспорт в Excel
function exportToExcel() {
    if (!currentTable || currentTable.rows.length === 0) {
        alert('Сначала создайте таблицу!');
        return;
    }

    try {
        // Создаем рабочую книгу
        const workbook = XLSX.utils.book_new();
        const worksheetData = [];

> Fertyni:
// Добавляем заголовки
        const headerRow = [];
        for (let i = 0; i < currentTable.rows[0].cells.length; i++) {
            headerRow.push(currentTable.rows[0].cells[i].textContent || Колонка ${i + 1});
        }
        worksheetData.push(headerRow);

        // Добавляем данные
        for (let i = 1; i < currentTable.rows.length; i++) {
            const row = currentTable.rows[i];
            const rowData = [];
            
            for (let j = 0; j < row.cells.length; j++) {
                const cell = row.cells[j];
                let cellValue = cell.textContent;
                
                // Обрабатываем числовые значения
                if (cellValue && !isNaN(cellValue) && cellValue.trim() !== '') {
                    cellValue = parseFloat(cellValue);
                }
                
                rowData.push(cellValue || '');
            }
            worksheetData.push(rowData);
        }

        // Создаем worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // Настраиваем ширину колонок
        const colWidths = [];
        for (let i = 0; i < currentTable.rows[0].cells.length; i++) {
            const width = currentTable.rows[0].cells[i].offsetWidth;
            colWidths.push({ wch: Math.max(8, width / 8) }); // Конвертируем пиксели в символы
        }
        worksheet['!cols'] = colWidths;

        // Добавляем worksheet в workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Таблица');

        // Скачиваем файл
        const fileName = table_export_${new Date().toISOString().slice(0, 10)}.xlsx;
        XLSX.writeFile(workbook, fileName);
        
        showSuccess('Файл успешно экспортирован в Excel!');
        
    } catch (error) {
        console.error('Ошибка при экспорте:', error);
        alert('Произошла ошибка при экспорте. Проверьте консоль для подробностей.');
    }
}

// Функция для показа успешного сообщения
function showSuccess(message) {
    // Создаем или находим контейнер для сообщений
    let messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
        messageContainer.style.cssText = 
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        ;
        document.body.appendChild(messageContainer);
    }

    // Создаем сообщение
    const messageEl = document.createElement('div');
    messageEl.className = 'success-message';
    messageEl.textContent = message;
    messageEl.style.cssText = 
        background: var(--success-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: var(--shadow);
        animation: slideInRight 0.3s ease-out;
    ;

    messageContainer.appendChild(messageEl);

    // Удаляем сообщение через 3 секунды
    setTimeout(() => {
        messageEl.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 3000);
}

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = 
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
;
document.head.appendChild(style);

function clearTable() {
    if (confirm('Очистить всю таблицу?')) {
        document.getElementById('editableTable').innerHTML = '';
        currentTable = null;
    }
}
