document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('user-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const userList = document.getElementById('user-list');

  const apiUrl = 'http://localhost:3000/usuarios';

  // Listar todos os usuários
  function loadUsers() {
    fetch(apiUrl)
      .then(res => res.json())
      .then(users => {
        userList.innerHTML = '';
        users.forEach(user => {
          const li = document.createElement('li');
          li.textContent = `${user.username} (${user.email})`;

          const delBtn = document.createElement('button');
          delBtn.textContent = 'Excluir';
          delBtn.onclick = () => deleteUser(user.id);

          li.appendChild(delBtn);
          userList.appendChild(li);
        });
      })
      .catch(err => console.error('Erro ao carregar usuários:', err));
  }

  // Criar novo usuário
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = {
      username: nameInput.value,
      email: emailInput.value,
      password: '1234' // senha fixa só para teste
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
      .then(() => {
        form.reset();
        loadUsers();
      })
      .catch(err => console.error('Erro ao criar usuário:', err));
  });

  // Excluir usuário
  function deleteUser(id) {
    fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    })
      .then(() => loadUsers())
      .catch(err => console.error('Erro ao deletar usuário:', err));
  }

  loadUsers();
});
