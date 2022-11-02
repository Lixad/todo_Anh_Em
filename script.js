const input = document.getElementById('input');
const counter = document.getElementById('counter');
const form = document.getElementById('form');
const list = document.getElementById('list');

let tasks = [];

input.focus();

const getTasks = () => {
  fetch('https://todo-store.herokuapp.com/')
    .then(res => res.json())
    .then(data => {
      tasks = [...data];
      updateTasks();
      list.innerHTML = '';
      data.forEach(el => {
        const li = document.createElement('li');
        li.innerHTML = `<label>${el.name} <input type="checkbox" id="${el.id}" ${el.checked ? 'checked' : ''}></label><button type="button" class="delete" id="del${el.id}">delete</button>`;
        li.style.color = el.checked ? 'green' : 'black';
        list.prepend(li);
        const checkbox = document.getElementById(el.id);
        checkbox.addEventListener('click', () => {
          if(checkbox.checked) {
            tasks.find(e => e.id === parseInt(checkbox.id)).checked = true;
            fetch(`https://todo-store.herokuapp.com/${parseInt(checkbox.id)}`, { method: 'PUT' })
              .then(() => {
                getTasks();
                updateTasks();
              })
          } else {
            tasks.find(e => e.id === parseInt(checkbox.id)).checked = false;
            fetch(`https://todo-store.herokuapp.com/${parseInt(checkbox.id)}`, { method: 'PUT' })
              .then(() => {
                getTasks();
                updateTasks();
              })
          }
        })
        const delBtn = document.getElementById(`del${el.id}`);
        delBtn.addEventListener('click', () => {
          fetch(`https://todo-store.herokuapp.com/${parseInt(checkbox.id)}`, { method: 'DELETE' })
            .then(() => {
              getTasks();
              updateTasks();
            })
        })
      });
    });
}

const updateTasks = () => {
  counter.innerText = `${tasks.filter(e => e.checked).length} / ${tasks.length}`;
}

getTasks();

form.addEventListener('submit', e => {
  e.preventDefault();
  if(!input.value) return alert('task name cannot be empty');
  fetch('https://todo-store.herokuapp.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ task: input.value })
  })
    .then(async res => {
      if(res.ok) {
        const li = document.createElement('li');
        li.innerText = input.value;
        list.prepend(li);
        input.value = '';
        getTasks();
      } else {
        alert(await res.text());
      }
    });
});
