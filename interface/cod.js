document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('user-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const userList = document.getElementById('user-list');

  const apiUrl = 'http://localhost:3000/usuarios';

  let editingUserId = null;

  // Listar todos os usuários
  function loadUsers() {
    fetch(apiUrl)
      .then(res => res.json())
      .then(users => {
        userList.innerHTML = '';
        users.forEach(user => {
          const li = document.createElement('li');
          li.textContent = `${user.username} (${user.email})`;

          // Botão de editar
          const editBtn = document.createElement('button');
          editBtn.textContent = 'Editar';
          editBtn.onclick = () => loadUserForEdit(user);

          // Botão de excluir
          const delBtn = document.createElement('button');
          delBtn.textContent = 'Excluir';
          delBtn.onclick = () => deleteUser(user.id);

          li.appendChild(editBtn);
          li.appendChild(delBtn);
          userList.appendChild(li);
        });
      })
      .catch(err => console.error('Erro ao carregar usuários:', err));
  }

  const loginForm = document.getElementById('login-form');
  const loginMessage = document.getElementById('login-message');

  loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //Login de usuario
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  fetch('http://localhost:3000/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
   })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('token', data.token); // Armazenar o token JWT
        loginMessage.style.color = 'green';
        loginMessage.textContent = data.message;
        loginMessage.style.display = 'block';
        loadUsers();
      } else {
        loginMessage.style.color = 'red';
        loginMessage.textContent = data.message || 'Usuário ou senha inválidos';
        loginMessage.style.display = 'block';
      }
    })
    .catch(err => {
      loginMessage.style.color = 'red';
      loginMessage.textContent = 'Erro de rede';
      loginMessage.style.display = 'block';
      console.error(err);
    });
  });


  // Carregar dados no formulário para edição
  function loadUserForEdit(user) {
    nameInput.value = user.username;
    emailInput.value = user.email;
    passwordInput.value = user.password || '';
    editingUserId = user.id;
    form.querySelector('button').textContent = 'Atualizar';
  }

  // Criar ou atualizar usuário
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = {
      username: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value
    };

    if (editingUserId) {
      // Atualizar
      fetch(`${apiUrl}/${editingUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
        .then(() => {
          resetForm();
          loadUsers();
        })
        .catch(err => console.error('Erro ao atualizar usuário:', err));
    } else {
      // Criar
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
        .then(() => {
          resetForm();
          loadUsers();
        })
        .catch(err => console.error('Erro ao criar usuário:', err));
    }
  });

  // Excluir usuário
  function deleteUser(id) {
    fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    })
      .then(() => loadUsers())
      .catch(err => console.error('Erro ao deletar usuário:', err));
  }

  // Resetar formulário
  function resetForm() {
    form.reset();
    editingUserId = null;
    form.querySelector('button').textContent = 'Cadastrar';
  }
});
