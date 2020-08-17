//Book class: represents a Book
class Book {
    constructor(title, author, isbn) {
        //we want to take what is passed-in as these parameters and assign it to the property of the object
        this.title = title; //title will be set to the title that is passed-in
        this.author = author;//author will be set to the author that is passed-in and so on
        this.isbn = isbn;
    }
}

//UI class: to handle UI Tasks
//the class UI is going to have a few methods: display box, add book to list, remove book from list, show alert, etc
//we don't want to instantiate the UI class, so we are going to make all the methods static
class UI {
    static displayBooks() {
        //this array is a hard coded data
        /*const StoredBooks = [
            {
                title: 'The Catcher in the Rye',
                author: 'J.D. Salinger',
                isbn: '7543321726'
            },
            {
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                isbn: '9780743273565'
            },
        ]*/

        //after we delete our dummy date, we can set our books to our stored method
        const books = Store.getBooks();

        //now we want to loop through all the books in the array, and then call the method add book to list
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        //we're going to create the row to put into the tbody
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        //we need to append the row to the list
        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
          el.parentElement.parentElement.remove();
        }
      }

 
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        
        //Vanish showAlert in 3 seconds
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    //to clear input fields after submitting a new book
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

//Store class: handles storage. Is a local storage within the browser.
class Store {
    static getBooks(){
        //you can't store objects, it has to be a string
        //before we add it to local storage we have to stringify it, and then when we pull it out we have to parse it 
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            //if there is something found in the books item.
            //it's going to stored as a string so we need to run this through a JASON.parse method, so we can use it as a Javascript array
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        //stringify because the browser only stores strings
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        //removed it by isbn because it should be unique
        const books = Store.getBooks();

        //loop through them
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            } 
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event: Display Books
//we need to call DisplayBooks() and it will take the books that we have hardcoded in the array, it's going to loop through them and it's going to add each one to the list with the static method addBookToList(book)
document.addEventListener('DOMContentLoaded', UI.displayBooks); //as soon as the DOM loads, we're going to call UI.displayBooks


//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // prevent actual submit
    e.preventDefault();

    //get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        //once we get the from values we want to instantiate the book from class Book (line 2);
        // Instantiate book
        const book = new Book(title, author, isbn);

        //Add Book to UI
        UI.addBookToList(book);

        //Add book to store
        Store.addBook(book);

        //Show success message
        UI.showAlert('Book Added', 'success');

        //clears input fields after submitting a new book
        UI.clearFields();
    }
});

//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remove book from UI
    UI.deleteBook(e.target);

    //Remove book from local storage
    //we need to passed the isbn, e.target is going to give us the link itself that we clicked, then we need to navigate to the parent element <td>, then previous element sibling to get to the <td> that is storing the isbn, text content to get the isbn
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Show success message
    UI.showAlert('Book Removed', 'success');
  });

