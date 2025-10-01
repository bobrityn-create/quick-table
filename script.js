> Fertyni:
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

// Функция для начала изменения размера колонки
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
    if (width > 50) { // Минимальная ширина 50px
        currentTable.rows[0].cells[currentCol].style.width = width + 'px';
        
        // Применяем ширину ко всем ячейкам в колонке
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
    
    // Проверяем, является ли ввод формулой (начинается с =)
    if (value.startsWith('=')) {
        cell.dataset.formula = value;
        cell.classList.add('formula-cell');
    } else {
        cell.dataset.formula = '';
        cell.classList.remove('formula-cell');
    }
}

// Вычисление формул
function calculateFormulas() {
    if (!currentTable) return;
    
    const rows = currentTable.rows;
    
    for (let i = 1; i < rows.length; i++) {
        for (let j = 0; j < rows[i].cells.length; j++) {
            const cell = rows[i].cells[j];

> Fertyni:
const formula = cell.dataset.formula;
            
            if (formula && formula.startsWith('=')) {
                try {
                    const result = evaluateFormula(formula, i, j);
                    if (result !== null) {
                        // Сохраняем оригинальную формулу в data-атрибуте
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

// Функция вычисления простых формул
function evaluateFormula(formula, rowIndex, colIndex) {
    // Убираем знак = и пробелы
    let expr = formula.substring(1).replace(/\s/g, '');
    
    // Поддерживаемые операции: СУММ(), СРЗНАЧ(), +, -, *, /
    
    // Обработка СУММ(A1:A5)
    if (expr.toUpperCase().startsWith('СУММ(')) {
        const range = expr.match(/СУММ\(([^)]+)\)/i)[1];
        return sumRange(range, rowIndex);
    }
    
    // Обработка СРЗНАЧ(A1:A5)
    if (expr.toUpperCase().startsWith('СРЗНАЧ(')) {
        const range = expr.match(/СРЗНАЧ\(([^)]+)\)/i)[1];
        return averageRange(range, rowIndex);
    }
    
    // Простые арифметические операции
    try {
        // Заменяем ссылки на ячейки их значениями
        expr = expr.replace(/[A-Z](\d+)/gi, (match) => {
            return getCellValue(match, rowIndex);
        });
        
        // Вычисляем выражение
        const result = eval(expr);
        return isNaN(result) ? null : Math.round(result * 100) / 100;
    } catch (error) {
        return null;
    }
}

// Получение значения ячейки по ссылке (например, A1)
function getCellValue(cellRef, currentRow) {
    if (!currentTable) return 0;
    
    const colLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const colChar = cellRef.charAt(0).toUpperCase();
    const rowNum = parseInt(cellRef.substring(1)) - 1; // -1 потому что первая строка это заголовок
    
    const colIndex = colLetters.indexOf(colChar);
    
    if (colIndex >= 0 && rowNum >= 0 && currentTable.rows[rowNum + 1]) {
        const cell = currentTable.rows[rowNum + 1].cells[colIndex];
        const value = parseFloat(cell.textContent) || 0;
        return value;
    }
    
    return 0;
}

// Сумма диапазона
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

// Среднее значение диапазона
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
