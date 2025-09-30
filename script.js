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
// Управление подпиской и пробным периодом
let trialTimeLeft = 60; // 1 минут в секундах
let isTrialActive = false;
let isPremium = false;

function startTrial() {
    isTrialActive = true;
    trialTimeLeft = 60; // 1 минут
    localStorage.setItem('trialStart', Date.now().toString());
    localStorage.setItem('trialActive', 'true');
    hideSubscriptionModal();
    startTrialTimer();
    updateUI();
}

function subscribe() {
    // Здесь интеграция с платежной системой
    isPremium = true;
    isTrialActive = false;
    localStorage.setItem('premium', 'true');
    hideSubscriptionModal();
    updateUI();
    alert('🎉 Спасибо за покупку подписки! Теперь все функции доступны!');
}

function showSubscriptionModal() {
    document.getElementById('subscriptionModal').style.display = 'flex';
}

function hideSubscriptionModal() {
    document.getElementById('subscriptionModal').style.display = 'none';
}

function startTrialTimer() {
    const timerElement = document.getElementById('trialTimer');
    const trialBanner = document.getElementById('trialInfo');
    
    trialBanner.style.display = 'flex';
    
    const timer = setInterval(() => {
        if (trialTimeLeft <= 0) {
            clearInterval(timer);
            trialBanner.style.display = 'none';
            isTrialActive = false;
            showSubscriptionModal();
            return;
        }
        
        const minutes = Math.floor(trialTimeLeft / 60);
        const seconds = trialTimeLeft % 60;
        timerElement.textContent = ${minutes}:${seconds.toString().padStart(2, '0')};
        trialTimeLeft--;
    }, 1000);
}

function checkTrialStatus() {
    const trialStart = localStorage.getItem('trialStart');
    const trialActive = localStorage.getItem('trialActive');
    const premium = localStorage.getItem('premium');
    
    if (premium === 'true') {
        isPremium = true;
        return;
    }
    
    if (trialActive === 'true' && trialStart) {
        const timePassed = Math.floor((Date.now() - parseInt(trialStart)) / 1000);
        trialTimeLeft = Math.max(0, 600 - timePassed);
        
        if (trialTimeLeft > 0) {
            isTrialActive = true;
            startTrialTimer();
        } else {
            showSubscriptionModal();
        }
    } else {
        showSubscriptionModal();
    }
}

function updateUI() {
    const exportBtn = document.getElementById('exportBtn');
    
    if (isPremium || isTrialActive) {
        exportBtn.disabled = false;
        exportBtn.style.opacity = '1';
    } else {
        exportBtn.disabled = true;
        exportBtn.style.opacity = '0.6';
    }
}

// Модифицируем функцию экспорта для проверки подписки
function exportToExcel() {
    if (!isPremium && !isTrialActive) {
        showSubscriptionModal();
        return;
    }
    
    // Твоя существующая функция экспорта
    try {
        const table = document.getElementById('editableTable');
        const tableTitle = document.getElementById('tableTitle').value || 'Таблица';

        if (!table.rows.length) {
            alert('Таблица пустая! Сначала создайте таблицу.');
            return;
        }

        // ... остальной код экспорта ...
        
    } catch (error) {
        console.error('Ошибка экспорта:', error);
        alert('Ошибка при экспорте: ' + error.message);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    checkTrialStatus();
    updateUI();
    
    // Закрытие модального окна
    document.querySelector('.close').addEventListener('click', hideSubscriptionModal);
    
    // Закрытие при клике вне модального окна
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('subscriptionModal');
        if (event.target === modal) {
            hideSubscriptionModal();
        }
    });
});
