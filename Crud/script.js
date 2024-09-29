document.getElementById('agendamento-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    
    const novoAgendamento = { nome, data, hora };

    fetch('/agendamentos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoAgendamento),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Agendamento criado:', data);
        adicionarAgendamentoNaLista(data);
        document.getElementById('agendamento-form').reset();
    })
    .catch((error) => {
        console.error('Erro ao criar agendamento:', error);
    });
});

function adicionarAgendamentoNaLista(agendamento) {
    const agendamentosList = document.getElementById('agendamentos-list');
    const li = document.createElement('li');
    li.textContent = `${agendamento.nome} - ${agendamento.data} ${agendamento.hora}`;
    
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.onclick = () => editarAgendamento(agendamento._id);
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Deletar';
    deleteButton.onclick = () => deletarAgendamento(agendamento._id, li);

    li.appendChild(editButton);
    li.appendChild(deleteButton);
    agendamentosList.appendChild(li);
}

function editarAgendamento(id) {
    const nome = prompt('Novo Nome:');
    const data = prompt('Nova Data (YYYY-MM-DD):');
    const hora = prompt('Nova Hora (HH:MM):');

    if (nome && data && hora) {
        const agendamentoAtualizado = { nome, data, hora };

        fetch(`/agendamentos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(agendamentoAtualizado),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Agendamento atualizado:', data);
            location.reload(); // Recarrega a página para ver as mudanças
        })
        .catch((error) => {
            console.error('Erro ao atualizar agendamento:', error);
        });
    }
}

function deletarAgendamento(id, listItem) {
    fetch(`/agendamentos/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log('Agendamento deletado');
            listItem.remove(); // Remove o item da lista
        } else {
            console.error('Erro ao deletar agendamento');
        }
    })
    .catch((error) => {
        console.error('Erro ao deletar agendamento:', error);
    });
}

window.onload = function() {
    fetch('/agendamentos')
        .then(response => response.json())
        .then(data => {
            data.forEach(agendamento => {
                adicionarAgendamentoNaLista(agendamento);
            });
        })
        .catch((error) => {
            console.error('Erro ao carregar agendamentos:', error);
        });
};
