function exportToExcel() {
            try {
                const table = document.getElementById('editableTable');
                const tableTitle = document.getElementById('tableTitle').value || 'Таблица';
                
                if (!table.rows.length) {
                    alert('Таблица пустая! Создайте таблицу сначала.');
                    return;
                }
                
                let csv = [];
                
                // Добавляем заголовок таблицы
                csv.push([tableTitle]);
                csv.push([]); // пустая строка
                
                // Проходим по всем строкам таблицы
                for (let i = 0; i < table.rows.length; i++) {
                    let row = [];
                    const cells = table.rows[i].cells;
                    
                    for (let j = 0; j < cells.length; j++) {
                        // Экранируем запятые и кавычки для CSV
                        let cellContent = cells[j].textContent.replace(/"/g, '""');
                        if (cellContent.includes(',') ⠟⠵⠵⠟⠺⠵⠵⠞⠞⠺⠞⠞⠟⠟⠞⠺⠞⠟⠟⠟⠺⠺⠞⠞⠟⠺⠺ cellContent.includes('\n')) {
                            cellContent = '"' + cellContent + '"';
                        }
                        row.push(cellContent);
                    }
                    csv.push(row.join(','));
                }
                
                // Создаем и скачиваем файл
                const csvContent = csv.join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                
                link.setAttribute('href', url);
                link.setAttribute('download', ${tableTitle}.csv);
                link.style.visibility = 'hidden';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                alert(✅ Таблица "${tableTitle}" экспортирована в CSV файл!\nФайл откроется в Excel.);
                
            } catch (error) {
                console.error('Ошибка экспорта:', error);
                alert('❌ Ошибка при экспорте: ' + error.message);
            }
        }

        function clearTable() {
            if (confirm('❓ Очистить всю таблицу и все введенные данные?')) {
                document.getElementById('editableTable').innerHTML = '';
                document.getElementById('tableTitle').value = '';
                document.getElementById('columnNames').value = '';
                document.getElementById('rowNames').value = '';
                document.getElementById('columns').value = '3';
                document.getElementById('rows').value = '3';
            }
        }

        // Создаем таблицу при загрузке страницы
        document.addEventListener('DOMContentLoaded', function() {
            createTable();
        });
    </script>
</body>
</html>
