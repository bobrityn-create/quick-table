function exportToExcel() {
    try {
        const table = document.getElementById('editableTable');
        const tableTitle = document.getElementById('tableTitle').value || 'Таблица';

        if (!table.rows.length) {
            alert('Таблица пустая! Сначала создайте таблицу.');
            return;
        }

        // Создаем XML для Excel
        let xmlContent = '<?xml version="1.0"?>\n';
        xmlContent += '<?mso-application progid="Excel.Sheet"?>\n';
        xmlContent += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
        xmlContent += ' xmlns:o="urn:schemas-microsoft-com:office:office"\n';
        xmlContent += ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n';
        xmlContent += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n';
        xmlContent += ' xmlns:html="http://www.w3.org/TR/REC-html40">\n';
        xmlContent += '<Worksheet ss:Name="' + tableTitle + '">\n';
        xmlContent += '<Table>\n';

        // Добавляем строки таблицы
        for (let i = 0; i < table.rows.length; i++) {
            xmlContent += '<Row>\n';
            const cells = table.rows[i].cells;
            
            for (let j = 0; j < cells.length; j++) {
                let cellValue = cells[j].textContent || '';
                // Экранируем специальные XML символы
                cellValue = cellValue.replace(/&/g, '&amp;')
                                    .replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;')
                                    .replace(/"/g, '&quot;')
                                    .replace(/'/g, '&apos;');
                
                xmlContent += '<Cell><Data ss:Type="String">' + cellValue + '</Data></Cell>\n';
            }
            xmlContent += '</Row>\n';
        }

        xmlContent += '</Table>\n';
        xmlContent += '</Worksheet>\n';
        xmlContent += '</Workbook>';

        // Создаем и скачиваем файл
        const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', tableTitle + '.xls');
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('Таблица "' + tableTitle + '" успешно экспортирована в Excel!');

    } catch (error) {
        console.error('Ошибка экспорта:', error);
        alert('Ошибка при экспорте: ' + error.message);
    }
}
