// app.js - Lógica de la aplicación de psicología personal

class PsicologiaApp {
    constructor() {
        this.currentEmotion = null;
        this.moodHistory = [];
        this.journalEntries = [];
        this.chatHistory = [
            { sender: 'bot', text: '¡Hola! Soy tu terapeuta virtual. ¿Cómo te sientes hoy? ¿Quieres contarme algo?' }
        ];
        
        this.initializeElements();
        this.loadData();
        this.setupEventListeners();
        this.showPage('diaryPage');
        this.updateMoodChart();
    }
    
    initializeElements() {
        // Navegación
        this.diaryBtn = document.getElementById('diaryBtn');
        this.trackingBtn = document.getElementById('trackingBtn');
this.therapyBtn = document.getElementById('therapyBtn');
        
        // Páginas
        this.diaryPage = document.getElementById('diaryPage');
        this.trackingPage = document.getElementById('trackingPage');
        this.therapyPage = document.getElementById('therapyPage');
        
        // Diario
        this.journalEntry = document.getElementById('journalEntry');
        this.saveJournalBtn = document.getElementById('saveJournalBtn');
        this.journalEntriesList = document.getElementById('journalEntriesList');
        
        // Seguimiento
        this.moodSlider = document.getElementById('moodSlider');
        this.moodValue = document.getElementById('moodValue');
        this.saveMoodBtn = document.getElementById('saveMoodBtn');
        this.moodChart = document.getElementById('moodChart');
        this.moodStats = document.getElementById('moodStats');
        
        // Terapia
        this.therapyChat = document.getElementById('therapyChat');
        this.therapyInput = document.getElementById('therapyInput');
        this.sendTherapyBtn = document.getElementById('sendTherapyBtn');
        
        // Herramientas de terapia
        this.breathingBtn = document.getElementById('breathingBtn');
        this.thoughtRecordBtn = document.getElementById('thoughtRecordBtn');
        this.gratitudeBtn = document.getElementById('gratitudeBtn');
    }
    
    setupEventListeners() {
        // Eventos de navegación
        this.diaryBtn.addEventListener('click', () => this.showPage('diaryPage'));
        this.trackingBtn.addEventListener('click', () => this.showPage('trackingPage'));
        this.therapyBtn.addEventListener('click', () => this.showPage('therapyPage'));
        
        // Eventos del diario
        this.saveJournalBtn.addEventListener('click', () => this.saveJournalEntry());
        
        // Eventos de emociones
        const emotionBtns = document.querySelectorAll('.emotion-btn');
        emotionBtns.forEach(btn => {
            btn.addEventListener('click', () => this.selectEmotion(btn.dataset.emotion, btn));
        });
        
        // Eventos de seguimiento emocional
        this.moodSlider.addEventListener('input', () => this.updateMoodValue());
        this.saveMoodBtn.addEventListener('click', () => this.saveMood());
        
        // Eventos de terapia
        this.sendTherapyBtn.addEventListener('click', () => this.sendMessage());
        this.therapyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Eventos de herramientas de terapia
        this.breathingBtn.addEventListener('click', () => this.startBreathingExercise());
        this.thoughtRecordBtn.addEventListener('click', () => this.openThoughtRecord());
        this.gratitudeBtn.addEventListener('click', () => this.recordGratitude());
    }
    
    showPage(pageId) {
        // Ocultar todas las páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Mostrar página seleccionada
        document.getElementById(pageId).classList.add('active');
        
        // Actualizar botones de navegación
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (pageId === 'diaryPage') this.diaryBtn.classList.add('active');
        if (pageId === 'trackingPage') this.trackingBtn.classList.add('active');
        if (pageId === 'therapyPage') this.therapyBtn.classList.add('active');
        
        // Actualizar contenido según la página
        if (pageId === 'diaryPage') {
            this.displayJournalEntries();
        } else if (pageId === 'trackingPage') {
            this.updateMoodChart();
            this.updateMoodStats();
        } else if (pageId === 'therapyPage') {
this.scrollToBottom();
        }
    }
    
    selectEmotion(emotion, element) {
        // Remover selección anterior
        document.querySelectorAll('.emotion-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Añadir selección nueva
        element.classList.add('selected');
        this.currentEmotion = emotion;
    }
    
    saveJournalEntry() {
        const content = this.journalEntry.value.trim();
        const emotion = this.currentEmotion;
        
        if (!content) {
            alert('Por favor, escribe algo en tu diario.');
            return;
        }
        
        const entry = {
            id: Date.now(),
            date: new Date().toLocaleString('es-ES'),
            content: content,
            emotion: emotion
        };
        
        this.journalEntries.unshift(entry);
        this.saveData();
        this.journalEntry.value = '';
        this.currentEmotion = null;
        
        // Remover selección de emociones
        document.querySelectorAll('.emotion-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        this.displayJournalEntries();
        alert('Entrada guardada exitosamente!');
    }
    
    displayJournalEntries() {
        if (!this.journalEntriesList) return;
        
        this.journalEntriesList.innerHTML = '';
        
        this.journalEntries.slice(0, 10).forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'journal-entry';
            
            let emotionSymbol = '';
            switch (entry.emotion) {
                case 'feliz': emotionSymbol = '😊'; break;
                case 'triste': emotionSymbol = '😢'; break;
                case 'ansioso': emotionSymbol = '😰'; break;
                case 'calmado': emotionSymbol = '😌'; break;
                case 'enojado': emotionSymbol = '😠'; break;
                case 'motivado': emotionSymbol = '💪'; break;
                default: emotionSymbol = '📝';
            }
            
            entryElement.innerHTML = `
                <div><strong>${emotionSymbol} ${entry.emotion || 'Sin emoción'}</strong> - ${entry.date}</div>
                <div>${entry.content.substring(0, 100)}${entry.content.length > 100 ? '...' : ''}</div>
            `;
            
            this.journalEntriesList.appendChild(entryElement);
        });
    }
    
    updateMoodValue() {
        const value = parseInt(this.moodSlider.value);
        let moodText = '';
        
        if (value <= 2) moodText = 'Muy mal';
        else if (value <= 4) moodText = 'Mal';
        else if (value <= 6) moodText = 'Neutral';
        else if (value <= 8) moodText = 'Bien';
        else moodText = 'Excelente';
        
        this.moodValue.textContent = `${value} - ${moodText}`;
    }
    
    saveMood() {
        const value = parseInt(this.moodSlider.value);
        const moodText = this.moodValue.textContent.split(' - ')[1];
        
        const moodEntry = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('es-ES'),
            value: value,
            text: moodText
        };
        
        this.moodHistory.push(moodEntry);
        this.saveData();
        this.updateMoodChart();
        this.updateMoodStats();
        
        alert(`Estado de ánimo registrado: ${value}/10 (${moodText})`);
    }
    
    updateMoodChart() {
        if (!this.moodChart) return;
        
        const ctx = this.moodChart.getContext('2d');
        ctx.clearRect(0, 0, this.moodChart.width, this.moodChart.height);
        
        // Dibujar fondo
        ctx.fillStyle = '#F4F1DE';
        ctx.fillRect(0, 0, this.moodChart.width, this.moodChart.height);
        
        if (this.moodHistory.length === 0) {
            ctx.fillStyle = '#2C3E50';
            ctx.font = '14px Arial';
ctx.textAlign = 'center';
            ctx.fillText('No hay datos suficientes para mostrar el gráfico', 
                         this.moodChart.width / 2, this.moodChart.height / 2);
            return;
        }
        
        // Configurar dimensiones
        const padding = 30;
        const chartWidth = this.moodChart.width - 2 * padding;
        const chartHeight = this.moodChart.height - 2 * padding;
        
        // Encontrar valores mínimos y máximos
        const values = this.moodHistory.map(entry => entry.value);
        const minValue = Math.min(...values, 1);
        const maxValue = Math.max(...values, 10);
        
        // Dibujar ejes
        ctx.strokeStyle = '#2C3E50';
        ctx.lineWidth = 1;
        
        // Eje Y
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, this.moodChart.height - padding);
        ctx.stroke();
        
        // Eje X
        ctx.beginPath();
        ctx.moveTo(padding, this.moodChart.height - padding);
        ctx.lineTo(this.moodChart.width - padding, this.moodChart.height - padding);
        ctx.stroke();
        
        // Dibujar línea de estado de ánimo
        if (this.moodHistory.length > 1) {
            ctx.strokeStyle = '#5E8B7E';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            this.moodHistory.forEach((entry, index) => {
                const x = padding + (index * chartWidth) / (this.moodHistory.length - 1);
                const y = this.moodChart.height - padding - ((entry.value - minValue) / (maxValue - minValue)) * chartHeight;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
            
            // Dibujar puntos
            this.moodHistory.forEach((entry, index) => {
                const x = padding + (index * chartWidth) / (this.moodHistory.length - 1);
                const y = this.moodChart.height - padding - ((entry.value - minValue) / (maxValue - minValue)) * chartHeight;
                
                ctx.fillStyle = '#2C3E50';
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }
    
    updateMoodStats() {
        if (!this.moodStats || this.moodHistory.length === 0) return;
        
        const values = this.moodHistory.map(entry => entry.value);
        const average = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
        const latest = values[values.length - 1];
        const highest = Math.max(...values);
        const lowest = Math.min(...values);
        
        this.moodStats.innerHTML = `
            <div><strong>Promedio:</strong> ${average}/10</div>
            <div><strong>Último:</strong> ${latest}/10</div>
            <div><strong>Máximo:</strong> ${highest}/10</div>
            <div><strong>Mínimo:</strong> ${lowest}/10</div>
            <div><strong>Total registros:</strong> ${this.moodHistory.length}</div>
        `;
    }
    
    sendMessage() {
        const message = this.therapyInput.value.trim();
        
        if (!message) return;
        
        // Añadir mensaje del usuario
        this.chatHistory.push({ sender: 'user', text: message });
        this.therapyInput.value = '';
        
        // Añadir mensaje del bot (respuesta simulada)
        setTimeout(() => {
            const botResponse = this.generateTherapyResponse(message);
            this.chatHistory.push({ sender: 'bot', text: botResponse });
            this.displayChatMessages();
            this.scrollToBottom();
        }, 1000);
        
        this.displayChatMessages();
        this.scrollToBottom();
    }
    
    generateTherapyResponse(userMessage) {
        // Respuestas simuladas de terapeuta virtual
        const responses = [
"Gracias por compartir eso. ¿Podrías decirme más sobre cómo te hizo sentir?",
            "Eso suena como una experiencia significativa. ¿Qué pensamientos vinieron a tu mente en ese momento?",
            "Es completamente válido sentir eso. ¿Has notado patrones similares en tus emociones últimamente?",
            "Esa es una gran observación. ¿Cómo crees que podrías manejar esta situación de manera diferente?",
            "A veces reconocer nuestros sentimientos es el primer paso hacia el cambio. ¿Qué necesitas en este momento?"
        ];
        
        // Palabras clave para respuestas más específicas
        const keywords = {
            'triste': 'Lamento que te sientas así. La tristeza es una emoción válida y necesaria. ¿Quieres contarme qué te ha estado afectando?',
            'ansioso': 'El sentimiento de ansiedad puede ser abrumador. Respira profundamente y recuerda que estás a salvo. ¿Hay algo específico que te cause ansiedad?',
            'enojado': 'Sentir enojo es humano. Es importante reconocerlo y encontrar formas saludables de expresarlo. ¿Qué te ha estado molestando?',
            'bien': 'Me alegra que te sientas bien. ¿Qué ha contribuido a este buen estado de ánimo?',
            'ayuda': 'Estoy aquí para ayudarte. ¿Qué necesitas en este momento? Puedo ofrecerte ejercicios de respiración, técnicas de relajación o simplemente escucharte.',
            'pensamiento': 'Los pensamientos pueden influir en nuestras emociones. ¿Podrías identificar algún pensamiento que te esté afectando?'
        };
        
        const lowerMessage = userMessage.toLowerCase();
        
        for (const [keyword, response] of Object.entries(keywords)) {
            if (lowerMessage.includes(keyword)) {
                return response;
            }
        }
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    displayChatMessages() {
        if (!this.therapyChat) return;
        
        this.therapyChat.innerHTML = '';
        
        this.chatHistory.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${message.sender}-message`;
            messageElement.textContent = message.text;
            this.therapyChat.appendChild(messageElement);
        });
    }
    
    scrollToBottom() {
        if (this.therapyChat) {
            this.therapyChat.scrollTop = this.therapyChat.scrollHeight;
        }
    }
    
    startBreathingExercise() {
        alert('Ejercicio de respiración iniciado. Sigue estas instrucciones:\n\n1. Inhala profundamente por la nariz durante 4 segundos\n2. Mantén la respiración durante 4 segundos\n3. Exhala lentamente por la boca durante 6 segundos\n4. Repite durante 5 minutos\n\nEste ejercicio ayuda a reducir la ansiedad y promover la relajación.');
    }
    
    openThoughtRecord() {
        const thought = prompt('¿Cuál es el pensamiento que quieres examinar?\n(Ej: "Nunca haré nada bien")');
        if (!thought) return;
        
        const evidenceFor = prompt(`¿Qué evidencia apoya este pensamiento?\n"${thought}"`);
        const evidenceAgainst = prompt(`¿Qué evidencia contradice este pensamiento?\n"${thought}"`);
        const balancedThought = prompt('¿Cuál podría ser un pensamiento más equilibrado?');
        
        const entry = {
            id: Date.now(),
            date: new Date().toLocaleString('es-ES'),
            type: 'thought-record',
            original: thought,
            evidenceFor: evidenceFor || '',
            evidenceAgainst: evidenceAgainst || '',
            balanced: balancedThought || ''
        };
        
        this.journalEntries.unshift(entry);
        this.saveData();
        
        alert('Registro de pensamiento guardado en tu diario.');
    }
    
    recordGratitude() {
        const gratitude = prompt('Escribe algo por lo que estés agradecido hoy:');
        if (!gratitude) return;
        
        const entry = {
id: Date.now(),
            date: new Date().toLocaleString('es-ES'),
            type: 'gratitude',
            content: gratitude
        };
        
        this.journalEntries.unshift(entry);
        this.saveData();
        
        alert('Registro de gratitud guardado.');
    }
    
    saveData() {
        const data = {
            journalEntries: this.journalEntries,
            moodHistory: this.moodHistory,
            chatHistory: this.chatHistory
        };
        
        localStorage.setItem('psicologiaAppData', JSON.stringify(data));
    }
    
    loadData() {
        const savedData = localStorage.getItem('psicologiaAppData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.journalEntries = data.journalEntries || [];
            this.moodHistory = data.moodHistory || [];
            this.chatHistory = data.chatHistory || [
                { sender: 'bot', text: '¡Hola! Soy tu terapeuta virtual. ¿Cómo te sientes hoy? ¿Quieres contarme algo?' }
            ];
        }
    }
}

// Inicializar la aplicación cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    new PsicologiaApp();
});

// Registra el service worker para hacer que la PWA funcione offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registrado con éxito:', registration);
            })
            .catch(error => {
                console.log('Error registrando Service Worker:', error);
            });
    });
}

