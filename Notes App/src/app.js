// Custom Element untuk Loading Spinner
class LoadingSpinner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(255, 255, 255, 0.8);
                    z-index: 1000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid rgba(52, 152, 219, 0.2);
                    border-radius: 50%;
                    border-top-color: #3498db;
                    animation: spin 1s ease-in-out infinite;
                }
                
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
                
                .loading-text {
                    margin-top: 15px;
                    color: #3498db;
                    font-weight: bold;
                }
            </style>
            
            <div class="spinner-container">
                <div class="spinner"></div>
                <div class="loading-text">Loading...</div>
            </div>
        `;
    }

    // Metode untuk menampilkan loading spinner
    show() {
        this.style.display = 'flex';
    }

    // Metode untuk menyembunyikan loading spinner
    hide() {
        this.style.display = 'none';
    }
}

// Mendefinisikan custom element untuk loading spinner
customElements.define('loading-spinner', LoadingSpinner);

// Global loading state manager
const loadingManager = {
    showLoading() {
        const loadingElement = document.querySelector('loading-spinner');
        if (loadingElement) {
            loadingElement.show();
        }
    },
    
    hideLoading() {
        const loadingElement = document.querySelector('loading-spinner');
        if (loadingElement) {
            loadingElement.hide();
        }
    }
};

async function fetchNotes() {
    loadingManager.showLoading(); // Menampilkan loading sebelum fetch
    try {
        const response = await fetch("https://notes-api.dicoding.dev/v2/notes");
        const data = await response.json();
        console.log(data);
        return data.data;
    } catch (error) {
        console.error("Error fetching notes:", error);
        return [];
    } finally {
        loadingManager.hideLoading(); // Menyembunyikan loading setelah fetch selesai
    }
}

// Custom Element untuk App Header
class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
                
                .app-header {
                    background-color: #3498db;
                    color: white;
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .app-title {
                    font-size: 24px;
                    font-weight: bold;
                    margin: 0;
                }
                
                .app-subtitle {
                    font-size: 14px;
                    margin-top: 5px;
                }
            </style>
            
            <div class="app-header">
                <div class="container">
                    <div>
                        <h1 class="app-title">Notes App</h1>
                        <div class="app-subtitle">Catat semua ide dan rencana anda</div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Custom Element untuk Daftar Catatan
class NotesList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.notes = [];
        this.filteredNotes = [];
        this.searchQuery = '';
        this.isLoading = true;
    }

    static get observedAttributes() {
        return ['data-notes'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-notes') {
            this.notes = JSON.parse(newValue);
            this.render();
        }
    }

    async connectedCallback() {
        this.isLoading = true;
        this.render(); // Render dengan status loading
        
        const allNotes = await fetchNotes();
        this.notes = allNotes;
        this.isLoading = false;
        this.render();

        document.addEventListener('note-added', (e) => {
            this.notes.unshift(e.detail);
            this.render();
        });

        document.addEventListener('note-deleted', (e) => {
            this.notes = this.notes.filter(note => note.id !== e.detail);
            this.render();
        });

        document.addEventListener('note-archived', (e) => {
            this.notes = this.notes.map(note => note.id === e.detail ? { ...note, archived: true } : note);
            this.render();
        });

        document.addEventListener('note-unarchived', (e) => {
            this.notes = this.notes.map(note => note.id === e.detail ? { ...note, archived: false } : note);
            this.render();
        });
    }

    render() {
        // Jika sedang loading, tampilkan placeholder
        if (this.isLoading) {
            this.shadowRoot.innerHTML = `
                <style>
                    .loading-placeholder {
                        text-align: center;
                        padding: 40px;
                        color: #7f8c8d;
                    }
                    
                    .placeholder-item {
                        background-color: #f0f0f0;
                        border-radius: 8px;
                        height: 150px;
                        margin-bottom: 20px;
                        animation: pulse 1.5s infinite;
                    }
                    
                    @keyframes pulse {
                        0% { opacity: 0.6; }
                        50% { opacity: 1; }
                        100% { opacity: 0.6; }
                    }
                    
                    .notes-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        gap: 20px;
                    }
                    
                    .section-title {
                        font-size: 22px;
                        margin-bottom: 20px;
                        color: #2c3e50;
                        border-bottom: 2px solid #3498db;
                        padding-bottom: 10px;
                    }
                </style>
                <div class="notes-section">
                    <h2 class="section-title">Catatan Aktif</h2>
                    <div class="notes-grid">
                        <div class="placeholder-item"></div>
                        <div class="placeholder-item"></div>
                        <div class="placeholder-item"></div>
                    </div>
                </div>
            `;
            return;
        }
        
        const activeNotes = this.notes.filter(note => !note.archived);
        const archivedNotes = this.notes.filter(note => note.archived);
        
        let filteredActiveNotes = activeNotes;
        let filteredArchivedNotes = archivedNotes;
        
        if (this.searchQuery) {
            filteredActiveNotes = activeNotes.filter(note => 
                note.title.toLowerCase().includes(this.searchQuery)
            );
            filteredArchivedNotes = archivedNotes.filter(note => 
                note.title.toLowerCase().includes(this.searchQuery)
            );
        }
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                .notes-section {
                    margin-bottom: 30px;
                }
                
                .section-title {
                    font-size: 22px;
                    margin-bottom: 20px;
                    color: #2c3e50;
                    border-bottom: 2px solid #3498db;
                    padding-bottom: 10px;
                }
                
                .notes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                }
                
                .no-notes {
                    background-color: white;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                    color: #7f8c8d;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                
                @media (max-width: 768px) {
                    .notes-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                .search-input {
                    margin-bottom: 20px;
                    padding: 10px;
                    width: 100%;
                    font-size: 16px;
                    border-radius: 8px;
                    border: 1px solid #ccc;
                }
                
                .search-status {
                    margin-bottom: 15px;
                    font-style: italic;
                    color: #7f8c8d;
                }
            </style>
            <input type="text" placeholder="Cari catatan..." class="search-input" />
            ${this.searchQuery ? `<div class="search-status">Menampilkan hasil pencarian untuk: "${this.searchQuery}"</div>` : ''}
            
            <div class="notes-section">
                <h2 class="section-title">Catatan Aktif</h2>
                <div class="notes-grid">
                    ${filteredActiveNotes.length > 0 ?
                        filteredActiveNotes.map(note => `
                            <note-card 
                                data-id="${note.id}"
                                data-title="${note.title}"
                                data-body="${note.body}"
                                data-date="${note.createdAt}"
                                data-archived="${note.archived}">
                            </note-card>
                        `).join('') :
                        `<div class="no-notes">Tidak ada catatan aktif${this.searchQuery ? ' yang sesuai dengan pencarian' : ''}.</div>`
                    }
                </div>
            </div>

            <div class="notes-section">
                <h2 class="section-title">Catatan Diarsipkan</h2>
                <div class="notes-grid">
                    ${filteredArchivedNotes.length > 0 ?
                        filteredArchivedNotes.map(note => `
                            <note-card 
                                data-id="${note.id}"
                                data-title="${note.title}"
                                data-body="${note.body}"
                                data-date="${note.createdAt}"
                                data-archived="${note.archived}">
                            </note-card>
                        `).join('') :
                        `<div class="no-notes">Tidak ada catatan diarsipkan${this.searchQuery ? ' yang sesuai dengan pencarian' : ''}.</div>`
                    }
                </div>
            </div>
        `;
        
        this.shadowRoot.querySelector('.search-input').addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.render(); // render ulang dengan filter
        });
    }
}

// Custom Element untuk Card Catatan
class NoteCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isDeleting = false;
        this.isArchiving = false;
    }

    static get observedAttributes() {
        return ['data-id', 'data-title', 'data-body', 'data-date', 'data-archived'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.shadowRoot.querySelector('.delete-btn').addEventListener('click', () => {
            if (this.isDeleting) return; // Mencegah klik ganda
            
            const id = this.getAttribute('data-id');
            this.isDeleting = true;
            this.render(); // Render dengan status loading pada tombol
            
            loadingManager.showLoading();
            
            fetch(`https://notes-api.dicoding.dev/v2/notes/${id}`, {
                method: 'DELETE'
            })
                .then(response => response.json())
                .then(result => {
                    if (result.status === 'success') {
                        const deletedEvent = new CustomEvent("note-deleted", {
                            detail: id,
                            bubbles: true,
                            composed: true
                        });
                        this.dispatchEvent(deletedEvent);
                    } else {
                        alert("Gagal menghapus catatan");
                    }
                })
                .catch(error => {
                    console.error("Error deleting note:", error);
                    alert("Gagal menghapus catatan");
                })
                .finally(() => {
                    this.isDeleting = false;
                    loadingManager.hideLoading();
                    this.render();
                });
        });
        
        this.shadowRoot.querySelector('.archive-btn').addEventListener('click', () => {
            if (this.isArchiving) return; // Mencegah klik ganda
            
            const id = this.getAttribute('data-id');
            const archived = this.getAttribute('data-archived') === 'true';
            this.isArchiving = true;
            this.render(); // Render dengan status loading pada tombol
            
            loadingManager.showLoading();
            
            fetch(`https://notes-api.dicoding.dev/v2/notes/${id}/${archived ? 'unarchive' : 'archive'}`, {
                method: 'POST'
            })
                .then(res => res.json())
                .then(result => {
                    if (result.status === 'success') {
                        const eventName = archived ? 'note-unarchived' : 'note-archived';
                        const archiveEvent = new CustomEvent(eventName, {
                            detail: id,
                            bubbles: true,
                            composed: true
                        });
                        this.dispatchEvent(archiveEvent);
                    } else {
                        alert("Gagal mengarsipkan catatan");
                    }
                })
                .catch(error => {
                    console.error("Error archiving note:", error);
                    alert("Gagal mengarsipkan catatan");
                })
                .finally(() => {
                    this.isArchiving = false;
                    loadingManager.hideLoading();
                    this.render();
                });
        });
    }

    render() {
        const id = this.getAttribute('data-id');
        const title = this.getAttribute('data-title');
        const body = this.getAttribute('data-body');
        const date = this.getAttribute('data-date');
        const isArchived = this.getAttribute('data-archived') === 'true';
        
        const formattedDate = new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                .note-card {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                
                .note-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }
                
                .note-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #2c3e50;
                }
                
                .note-body {
                    font-size: 14px;
                    line-height: 1.5;
                    color: #555;
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 5;
                    -webkit-box-orient: vertical;
                }
                
                .note-date {
                    font-size: 12px;
                    color: #999;
                    margin-top: 15px;
                    text-align: right;
                }
                
                .button {
                    margin-top: 10px;
                    padding: 8px;
                    font-size: 14px;
                    background-color: rgb(54, 170, 247);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: background-color 0.3s;
                }
                
                .button:hover {
                    background-color: #2980b9;
                }
                
                .button-loading {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                .spinner-small {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                    margin-right: 6px;
                }
                
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
                
                .delete-btn {
                    background-color:rgb(54, 170, 247);
                }
                
                .delete-btn:hover {
                    background-color: #2980b9;
                }
            </style>
            
            <div class="note-card">
                <div class="note-title">${title}</div>
                <div class="note-body">${body}</div>
                <div class="note-date">${formattedDate}</div>
                
                <button class="button delete-btn ${this.isDeleting ? 'button-loading' : ''}">
                    ${this.isDeleting ? '<div class="spinner-small"></div>' : ''}
                    Hapus
                </button>
                
                <button class="button archive-btn ${this.isArchiving ? 'button-loading' : ''}">
                    ${this.isArchiving ? '<div class="spinner-small"></div>' : ''}
                    ${isArchived ? 'Kembalikan' : 'Arsipkan'}
                </button>
            </div>
        `;
        
        // Re-setup event listeners jika tombol-tombol dirender ulang
        if (this.isConnected) {
            this.setupEventListeners();
        }
    }
}

// Custom Element untuk Form Catatan
class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isSubmitting = false;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                
                .note-form-container {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                }
                
                .form-title {
                    font-size: 20px;
                    margin-bottom: 20px;
                    color: #3498db;
                    border-bottom: 2px solid #3498db;
                    padding-bottom: 10px;
                }
                
                .form-group {
                    margin-bottom: 15px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                }
                
                .form-control {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                }
                
                .form-control:focus {
                    outline: none;
                    border-color: #3498db;
                    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
                }
                
                .form-control.error {
                    border-color: #e74c3c;
                }
                
                .error-message {
                    color: #e74c3c;
                    font-size: 12px;
                    margin-top: 5px;
                    display: none;
                }
                
                .error-message.show {
                    display: block;
                }
                
                textarea.form-control {
                    min-height: 150px;
                    resize: vertical;
                }
                
                .btn {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 10px 20px;
                    background-color: rgb(54, 170, 247);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.3s;
                }
                
                .btn:hover {
                    background-color: #2980b9;
                }
                
                .btn-block {
                    display: block;
                    width: 100%;
                }
                
                .btn-loading {
                    opacity: 0.8;
                    cursor: not-allowed;
                }
                
                .spinner-small {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                    margin-right: 8px;
                }
                
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            </style>
            
            <div class="note-form-container">
                <h2 class="form-title">Tambah Catatan Baru</h2>
                
                <form id="noteForm">
                    <div class="form-group">
                        <label for="noteTitle">Judul</label>
                        <input type="text" id="noteTitle" class="form-control" placeholder="Masukkan judul catatan">
                        <div id="titleError" class="error-message">Judul tidak boleh kosong</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="noteBody">Isi Catatan</label>
                        <textarea id="noteBody" class="form-control" placeholder="Masukkan isi catatan"></textarea>
                        <div id="bodyError" class="error-message">Isi catatan tidak boleh kosong</div>
                    </div>
                    
                    <button type="submit" class="btn btn-block ${this.isSubmitting ? 'btn-loading' : ''}">
                        ${this.isSubmitting ? '<div class="spinner-small"></div>' : ''}
                        Simpan Catatan
                    </button>
                </form>
            </div>
        `;
    }

    setupEventListeners() {
        const form = this.shadowRoot.getElementById('noteForm');
        const titleInput = this.shadowRoot.getElementById('noteTitle');
        const bodyInput = this.shadowRoot.getElementById('noteBody');
        const titleError = this.shadowRoot.getElementById('titleError');
        const bodyError = this.shadowRoot.getElementById('bodyError');

        // Validasi real-time
        titleInput.addEventListener('input', () => {
            if (titleInput.value.trim() !== '') {
                titleInput.classList.remove('error');
                titleError.classList.remove('show');
            }
        });

        bodyInput.addEventListener('input', () => {
            if (bodyInput.value.trim() !== '') {
                bodyInput.classList.remove('error');
                bodyError.classList.remove('show');
            }
        });

        // Submit handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.isSubmitting) return; // Mencegah multiple submit

            let isValid = true;

            if (titleInput.value.trim() === '') {
                titleInput.classList.add('error');
                titleError.classList.add('show');
                isValid = false;
            } else {
                titleInput.classList.remove('error');
                titleError.classList.remove('show');
            }

            if (bodyInput.value.trim() === '') {
                bodyInput.classList.add('error');
                bodyError.classList.add('show');
                isValid = false;
            } else {
                bodyInput.classList.remove('error');
                bodyError.classList.remove('show');
            }

            if (isValid) {
                const newNote = {
                    title: titleInput.value.trim(),
                    body: bodyInput.value.trim(),
                };
                
                this.isSubmitting = true;
                this.render(); // Render ulang untuk menampilkan status loading
                
                loadingManager.showLoading();

                fetch("https://notes-api.dicoding.dev/v2/notes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newNote)
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.status === "success") {
                            const noteAddedEvent = new CustomEvent("note-added", {
                                detail: result.data,
                                bubbles: true,
                                composed: true
                            });
                            this.dispatchEvent(noteAddedEvent);
                            form.reset();
                        } else {
                            alert("Gagal menambahkan catatan.");
                        }
                    })
                    .catch(error => {
                        console.error("Error adding note:", error);
                        alert("Gagal menambahkan catatan.");
                    })
                    .finally(() => {
                        this.isSubmitting = false;
                        loadingManager.hideLoading();
                        this.render();
                    });
            }
        });
    }
}

// HTML utama untuk menginisialisasi aplikasi
document.addEventListener('DOMContentLoaded', () => {
    // Tambahkan loading spinner di awal
    document.body.insertAdjacentHTML('afterbegin', '<loading-spinner></loading-spinner>');
    
    // Sembunyikan loading spinner setelah semua elemen dimuat
    window.addEventListener('load', () => {
        loadingManager.hideLoading();
    });
});

// Mendefinisikan custom elements
customElements.define('app-header', AppHeader);
customElements.define('notes-list', NotesList);
customElements.define('note-card', NoteCard);
customElements.define('note-form', NoteForm);