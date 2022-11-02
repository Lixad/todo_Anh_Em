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
      tasks = [...data.tasks];
      updateTasks();
      list.innerHTML = '';
      data.tasks.forEach(el => {
        const li = document.createElement('li');
        li.innerHTML = `<label class="container"><input type="checkbox" id="${el._id}" ${el.checked ? 'checked' : ''}><span class="checkmark"></span><div class="labellino ${el.checked ? 'bg-checked' : ''}">${el.value}</div></label><button type="button" class="delete" id="del${el._id}">
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          width="24px" height="24px" viewBox="0 0 408.483 408.483"
          xml:space="preserve">
          <path d="M87.748,388.784c0.461,11.01,9.521,19.699,20.539,19.699h191.911c11.018,0,20.078-8.689,20.539-19.699l13.705-289.316
            H74.043L87.748,388.784z M247.655,171.329c0-4.61,3.738-8.349,8.35-8.349h13.355c4.609,0,8.35,3.738,8.35,8.349v165.293
            c0,4.611-3.738,8.349-8.35,8.349h-13.355c-4.61,0-8.35-3.736-8.35-8.349V171.329z M189.216,171.329
            c0-4.61,3.738-8.349,8.349-8.349h13.355c4.609,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.737,8.349-8.349,8.349h-13.355
            c-4.61,0-8.349-3.736-8.349-8.349V171.329L189.216,171.329z M130.775,171.329c0-4.61,3.738-8.349,8.349-8.349h13.356
            c4.61,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.738,8.349-8.349,8.349h-13.356c-4.61,0-8.349-3.736-8.349-8.349V171.329z"/>
          <path d="M343.567,21.043h-88.535V4.305c0-2.377-1.927-4.305-4.305-4.305h-92.971c-2.377,0-4.304,1.928-4.304,4.305v16.737H64.916
            c-7.125,0-12.9,5.776-12.9,12.901V74.47h304.451V33.944C356.467,26.819,350.692,21.043,343.567,21.043z"/>
        </svg>
        </button>`;
        list.prepend(li);
        const checkbox = document.getElementById(el._id);
        checkbox.addEventListener('click', () => {
          fetch(`https://todo-store.herokuapp.com/${checkbox.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ checked: checkbox.checked })
            })
            .then(() => {
              getTasks();
              updateTasks();
            })
          }
        )
        const delBtn = document.getElementById(`del${el._id}`);
        delBtn.addEventListener('click', () => {
          fetch(`https://todo-store.herokuapp.com/${checkbox.id}`, { method: 'DELETE' })
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

setInterval(getTasks, 30000);
