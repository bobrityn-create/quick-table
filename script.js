function createTable() {
    const columns = parseInt(document.getElementById('columns').value);
    const rows = parseInt(document.getElementById('rows').value);
    const table = document.getElementById('editableTable');
    
    // Очищаем таблицу
    table.innerHTML = '';
    
    // Создаем заголовок
    const headerRow = table.insertRow();
    for (let i = 0; i < columns; i++) {
        const th = document.createElement('th');
        th.textContent = Колонка ${i + 1};
        th.contentEditable = true;
        headerRow.appendChild(th);
    }
    
    // Создаем строки
    for (let i = 0; i < rows; i++) {
        const row = table.insertRow();
        for (let j = 0; j < columns; j++) {
            const cell = row.insertCell();
            cell.contentEditable = true;
            cell.textContent = '';
        }
    }
}

function exportToPDF() {
    alert('PDF экспорт будет добавлен после запуска сайта! Сейчас можно копировать таблицу прямо из браузера.');
}

function clearTable() {
    if (confirm('Очистить всю таблицу?')) {
        document.getElementById('editableTable').innerHTML = '';
    }
}

// Создаем таблицу при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    createTable();
});
