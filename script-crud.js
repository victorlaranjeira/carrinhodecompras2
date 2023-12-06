const btnAddNovaTarefa = document.querySelector('.app__button--add-task');
const form = document.querySelector('.app__form-add-task');
const ulTarefas = document.querySelector('.app__section-task-list');
const paragrfoDescricaoTarefa = document.querySelector('.app__section-active-task-description')
const textArea = document.querySelector('.app__form-textarea');
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const btnRemovertodas = document.querySelector('#btn-remover-todas')
let tarefaSelecionada = null;
let liTarefaSelecionada = null;


function atualizaTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function criaNovaTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = ` 
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    
    `

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description')

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');
    botao.onclick = () => {
        const novaDescricao = prompt('Qual a nova descrição');
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atualizaTarefas();
        }
    }

    const imgBotao = document.createElement('img');
    imgBotao.setAttribute('src', '/imagens/edit.png');

    botao.append(imgBotao)

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if(tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
    }else {
        li.onclick = () => {
        
            document.querySelectorAll('.app__section-task-list-item-active').forEach(elemento => {
                elemento.classList.remove('app__section-task-list-item-active')
            })
            if(tarefaSelecionada==tarefa){
                paragrfoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return;
    
            }
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            paragrfoDescricaoTarefa.textContent = tarefa.descricao;
            
            li.classList.add('app__section-task-list-item-active')
        }
    }

    return li;
}

btnAddNovaTarefa.addEventListener('click', () => {
    form.classList.toggle('hidden');
})

form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textArea.value

    }
    tarefas.push(tarefa);
    const elementoTarefa = criaNovaTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizaTarefas()
    textArea.value = '';
    form.classList.add('hidden')
})

tarefas.forEach(tarefa => {
    const elementoTarefa = criaNovaTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
});

document.addEventListener('focoFinalizado', () => {
    if(tarefaSelecionada && liTarefaSelecionada){
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizaTarefas()

    }
})

const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizaTarefas()

}

btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemovertodas.onclick = () => removerTarefas(false);









/*const taskListContainer = document.querySelector('.app__section-task-list')
const formTask = document.querySelector('.app__form-add-task')
const toggleFormTaskBtn = document.querySelector('.app__button--add-task')
const formLabel = document.querySelector('.app__form-label')
const cancelFormTaskBtn = document.querySelector('.app__form-footer__button--cancel')
const taskAtiveDescription = document.querySelector('.app__section-active-task-description')
const textarea = document.querySelector('.app__form-textarea')
const btnCancelar = document.querySelector('.app__form-footer__button--cancel')

const btnDeletar = document.querySelector('.app__form-footer__button--delete')

const btnDeletarConcluidas = document.querySelector('#btn-remover-concluidas')
const btnDeletarTodas = document.querySelector('#btn-remover-todas')

const localStorageTarefas = localStorage.getItem('tarefas')
let tarefas = localStorageTarefas ? JSON.parse(localStorageTarefas) : []

const taskIconSvg = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E" />
</svg>
`
let tarefaSelecionada = null
let itemTarefaSelecionada = null
let tarefaEmEdicao = null
let paragraphEmEdicao = null

const removerTarefas = (somenteConcluidas) => {
    const seletor = somenteConcluidas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach((element) => {
        element.remove();
    });

    tarefas = somenteConcluidas ? tarefas.filter(t => !t.concluida) : []
    updateLocalStorage()
}

const selecionaTarefa = (tarefa, elemento) => {
    if (tarefa.concluida) {
        return
    }
    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('app__section-task-list-item-active')
    })
    if (tarefaSelecionada == tarefa) {
        taskAtiveDescription.textContent = null
        itemTarefaSelecionada = null
        tarefaSelecionada = null
        return
    }
    tarefaSelecionada = tarefa
    itemTarefaSelecionada = elemento
    taskAtiveDescription.textContent = tarefa.descricao
    elemento.classList.add('app__section-task-list-item-active')
}
const limparForm = () => {
    tarefaEmEdicao = null
    paragraphEmEdicao = null
    textarea.value = ''
    formTask.classList.add('hidden')
}
const selecionaTarefaParaEditar = (tarefa, elemento) => {
    if (tarefaEmEdicao == tarefa) {
        limparForm()
        return
    }
    formLabel.textContent = 'Editando tarefa'
    tarefaEmEdicao = tarefa
    paragraphEmEdicao = elemento
    textarea.value = tarefa.descricao
    formTask.classList.remove('hidden')
}
function createTask(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')
    const svgIcon = document.createElement('svg')
    svgIcon.innerHTML = taskIconSvg
    const paragraph = document.createElement('p')
    paragraph.classList.add('app__section-task-list-item-description')
    paragraph.textContent = tarefa.descricao
    const button = document.createElement('button')
    button.classList.add('app_button-edit')
    const editIcon = document.createElement('img')
    editIcon.setAttribute('src', '/imagens/edit.png')
    button.appendChild(editIcon)
    button.addEventListener('click', (event) => {
        event.stopPropagation()
        selecionaTarefaParaEditar(tarefa, paragraph)
    })
    li.onclick = () => {
        selecionaTarefa(tarefa, li)
    }
    svgIcon.addEventListener('click', (event) => {
        if (tarefa == tarefaSelecionada) {
            event.stopPropagation()
            button.setAttribute('disabled', true)
            li.classList.add('app__section-task-list-item-complete')
            tarefaSelecionada.concluida = true
            updateLocalStorage()
        }
    })
    if (tarefa.concluida) {
        button.setAttribute('disabled', true)
        li.classList.add('app__section-task-list-item-complete')
    }
    li.appendChild(svgIcon)
    li.appendChild(paragraph)
    li.appendChild(button)

    return li
}
tarefas.forEach(task => {
    const taskItem = createTask(task)
    taskListContainer.appendChild(taskItem)
})
cancelFormTaskBtn.addEventListener('click', () => {
    formTask.classList.add('hidden')
})
btnCancelar.addEventListener('click', limparForm)
toggleFormTaskBtn.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando tarefa'
    formTask.classList.toggle('hidden')
})
btnDeletar.addEventListener('click', () => {
    if (tarefaSelecionada) {
        const index = tarefas.indexOf(tarefaSelecionada);
        if (index !== -1) {
            tarefas.splice(index, 1);
        }

        itemTarefaSelecionada.remove()
        tarefas.filter(t => t != tarefaSelecionada)
        itemTarefaSelecionada = null
        tarefaSelecionada = null
    }
    updateLocalStorage()
    limparForm()
})
const updateLocalStorage = () => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}
formTask.addEventListener('submit', (evento) => {
    evento.preventDefault()
    if (tarefaEmEdicao) {
        tarefaEmEdicao.descricao = textarea.value
        paragraphEmEdicao.textContent = textarea.value
    } else {
        const task = {
            descricao: textarea.value,
            concluida: false
        }
        tarefas.push(task)
        const taskItem = createTask(task)
        taskListContainer.appendChild(taskItem)
    }
    updateLocalStorage()
    limparForm()
})

btnDeletarConcluidas.addEventListener('click', () => removerTarefas(true))
btnDeletarTodas.addEventListener('click', () => removerTarefas(false))

document.addEventListener("TarefaFinalizada", function (e) {
    if (tarefaSelecionada) {
        tarefaSelecionada.concluida = true
        itemTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        itemTarefaSelecionada.querySelector('button').setAttribute('disabled', true)
        updateLocalStorage()
    }
});*/





