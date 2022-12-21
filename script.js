function createCard(cat, index) {
    let heart;
    cat.favorite ? heart = 'fa-solid': heart = '';
    return `
    <div data-index="${index}" data-id="${cat.id}" class="card">
    <div class="card_image" style="background-image: url('${cat.image}')">
    </div>
    <div class="card_description">
        <h3>Имя: ${cat.name}</h3>
        <p>Возраст: ${cat.age}</p>
        <i class="favorite fa-regular fa-heart ${heart}"></i>
        <p>Описание: ${cat.description}</p>
        <div class="edit_components">
            <button data-action="edit" id="edit_cat" title="Редактировать"><i class="fa-solid fa-pencil"></i></button>
            <button data-action="delete" id="delete_cat" title="Удалить"><i class="fa-solid fa-xmark"></i></button>
        </div>
    </div>
    </div>`
}

let container = document.querySelector('.container');
async function renderCards() {
    const response = await fetch('https://cats.petiteweb.dev/api/single/li3rd/show/');
    const arr = await response.json();
    container.insertAdjacentHTML('afterbegin', arr.map((cat, index) => createCard(cat, index)).join(''));
       
}
renderCards();

function createModal(cat) {                                                                   //модалка для редактирования карточки
    let $modal = document.createElement('div');
    $modal.setAttribute('data-modal-form', 'edit');
    $modal.classList.add('modal');
    $modal.insertAdjacentHTML('afterbegin', `
    <div class="modal_overlay">
    <div class="modal_window">
        <span class="modal_close">&times;</span>
        <form data-put="PUT" class="modal_form" action="">
        <label for="cat_name">Имя</label>
        <input id="cat_name" type="text" name="name" placeholder="Введите имя" value="${cat.name}" readonly>
        <label for="cat_age">Возраст</label>
        <input id="cat_age" name="age" type="number" placeholder="Введите возраст" value="${cat.age}">
        <label for="cat_id">id</label>
        <input id="cat_id" name="id" type="number" placeholder="Введите id" value="${cat.id}" readonly>
        <label for="cat_rate">Оценка</label>
        <input id="cat_rate" type="number" min="1" max="10" name="rate" placeholder="Как Вы оцениваете от 1 до 10?" value="${cat.rate}">
        <label for="cat_description">Описание</label>
        <input id="cat_description" type="text" placeholder="Краткое описание" name="description" value="${cat.description}">
        <label for="cat_image">Фото</label>
        <input id="cat_image" type="text" name="image" placeholder="Укажите ссылку на картинку" value="${cat.image}">
        <div class="checkbox">
            <p>Нравится?</p>
            <label for="cat_favorite1"></label>Да</label>
            <input id="cat_favorite1" name="favorite" type="radio" value="true" ${cat.favorite ? 'checked' : ''}>
            <label for="cat_favorite2">Нет</label>
            <input id="cat_favorite2" name="favorite" type="radio" value="false" ${cat.favorite ? '' : 'checked'}>
        </div>
        <button class='JSbutton'>Подтвердить</button>
    </form>
     </div>
</div>`);
    return document.body.append($modal);
}
function createModalForView(cat) {                                                            //модалка для просмотра детальной информации при клике на картинку
    let $viewModal = document.createElement('div');
    $viewModal.setAttribute('data-view','');
    $viewModal.classList.add('modal');
    let heart;
    cat.favorite ? heart = 'fa-solid': heart = '';
    $viewModal.insertAdjacentHTML('afterbegin', `
    <div class="modal_overlay">
    <div class="modal_window modal_view">
        <span class="modal_close">&times;</span>
        <div class="view">
            <div class="view_image" style="background-image: url('${cat.image}')"></div>
            <div class="view_description">
                <div class="view_description_upper">
                    <p>Имя кота: <strong>${cat.name}</strong> </p>
                    <p>Возраст: ${cat.age}</p>
                    <p>Описание: ${cat.description}</p>
                    <p id="view-rating">Рейтинг: ${cat.rate}</p>
                    <div class="rating-result">
                        <span data-rating="1"></span>	
                        <span data-rating="2"></span>    
                        <span data-rating="3"></span>  
                        <span data-rating="4"></span>    
                        <span data-rating="5"></span>
                        <span data-rating="6"></span>
                        <span data-rating="7"></span>
                        <span data-rating="8"></span>
                        <span data-rating="9"></span>
                        <span data-rating="10"></span>
                    </div>
                </div>
                <div class="view_description_lower">
                    <span title="Id"></span>
                    <i><i class="favorite fa-regular fa-heart ${heart}"></i></i>
                </div>
            </div>
        </div>
    </div>
</div>`)
return document.body.append($viewModal)
}
function open(elem) {
    elem.classList.add('open')
}
function close(elem) {
    elem.classList.remove('open')
    elem.classList.add('fading')
    setTimeout(() => {
        elem.classList.remove('fading')
    }, 400)
}
// функция для изменения рейтинга и лайка в окне просмотра (на карточке и на бекэнде)
function updateCat(event, cat) {
    let index = event.target.closest('[data-index]').dataset.index
    let $catCard = event.target.closest('.card');
    let catId = $catCard.dataset.id;
    fetch(`https://cats.petiteweb.dev/api/single/li3rd/update/${catId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(cat)
            })
            .then(res => {
                if (res.status === 200) {
                    $catCard.remove()
                    if (document.querySelector(`[data-index='${index - 1}']`) === null) container.insertAdjacentHTML('afterbegin', createCard(cat, index))
                    else document.querySelector(`[data-index='${index - 1}']`).insertAdjacentHTML('afterend', createCard(cat, index))
                }
                else alert(`Не вышло`)
            }).catch(err => alert(`Ошибка ${err}`))
}
function likeChange() {
    let $heart = document.querySelector('.view_description_lower .favorite')
    $heart.classList.toggle('fa-solid')
}
function ratingChange(n) {
    let $stars = document.querySelectorAll('.rating-result > span')
    let $rating = document.querySelector('#view-rating')
    $stars.forEach(el => el.classList.remove('active'))
    for(let i = 0; i < n; i++) {
        $stars[i].classList.toggle('active')
    }
    $rating.innerText = `Рейтинг: ${n}`
}
container.addEventListener('click',                                                            //общий обработчик                       
async (ev) => {
    let $catCard = ev.target.closest('.card');
    let catId = $catCard.dataset.id;
    if (ev.target.closest('#delete_cat')) {                                                    //удаление карточки
        await fetch(`https://cats.petiteweb.dev/api/single/li3rd/delete/${catId}`, {                              
            method: 'DELETE'
        }).then(res => {
            if (res.status === 200) return $catCard.remove();
            alert(`Не получилось удалить кота с Id ${catId}`)
        })
    } 
    if (ev.target.closest('#edit_cat')) {                                                       //редактирование карточки
        let response = await fetch(`https://cats.petiteweb.dev/api/single/li3rd/show/${catId}`) 
        let cat = await response.json();
        let index = ev.target.closest('[data-index]').dataset.index;
        createModal(cat);
        let $editModalForm = document.querySelector('[data-modal-form]');
        setTimeout(() => open($editModalForm), 10);
        document.addEventListener('click', function clack(event) {                               //обработчик на закрытие модального окна при клики на крестик или оверлэй
            const layout = event.target.classList.contains('modal_overlay');
            const times = event.target.classList.contains('modal_close');
            if (layout || times) {
                close($editModalForm);
                setTimeout(() => $editModalForm.remove(), 410);
                document.removeEventListener('click', clack);
            }
        })
        let $putForm = document.querySelector('[data-put]');                                     //передаём данные с формы
        $putForm.addEventListener('submit', function(ev) {
            ev.preventDefault();
            let formData = new FormData(ev.target);
            let obj = {};
            formData.forEach((value, key) => obj[key] = value);
            obj = {
                ...obj,
                'favorite' : JSON.parse(obj['favorite'])
            }
            fetch(`https://cats.petiteweb.dev/api/single/li3rd/update/${catId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(obj)
            })
            .then(res => {
                if (res.status === 200) {
                    $catCard.remove()
                    if (document.querySelector(`[data-index='${index - 1}']`) === null) container.insertAdjacentHTML('afterbegin', createCard(obj, index))     //получаем изменённую карточку в том же месте без обновления страницы
                    else document.querySelector(`[data-index='${index - 1}']`).insertAdjacentHTML('afterend', createCard(obj, index))
                    close($editModalForm)
                    setTimeout(() => $editModalForm.remove(), 410)
                }
                else alert(`Не вышло`)
            }).catch(err => alert(`Ошибка ${err}`))
        })
    }
    if (ev.target.closest('.card_image')) {                                                        //просмотр детальной информации
        let response = await fetch(`https://cats.petiteweb.dev/api/single/li3rd/show/${catId}`)
        let cat = await response.json();
        createModalForView(cat);
        let $viewModal = document.querySelector('[data-view]');
        ratingChange(cat.rate)
        setTimeout(() => open($viewModal), 10);
        $viewModal.addEventListener('click', (e) => {
            if (e.target.closest('[data-rating]')) {
                let catRating = e.target.closest('[data-rating]').dataset.rating
                cat.rate = +catRating;
                ratingChange(cat.rate)
            }
            if (e.target.closest('.favorite')) {
                likeChange()
                cat.favorite = !cat.favorite
            }
        })
        document.addEventListener('click', function clack(event) {
            const layout = event.target.classList.contains('modal_overlay');
            const times = event.target.classList.contains('modal_close');
            if (layout || times) {
                updateCat(ev, cat)
                close($viewModal)
                setTimeout(() => $viewModal.remove(), 410);
                document.removeEventListener('click', clack);
            }
        })
    }
});

class Modal {                                                                             //модалка для добавления новой карточки, но сделанная через класс
    modal = document.createElement('div');
    closing = false;
    create (obj = {
        name: '',
        age: '',
        id: '',
        rate: '',
        description: '',
        image: '',
        favorite: ''
    }) {
        this.modal.classList.add('modal');
        this.modal.insertAdjacentHTML('afterbegin', `
        <div class="modal_overlay">
            <div class="modal_window">
                <span class="modal_close">&times;</span>
                <form data-post="POST" class="modal_form" action="">
                <label for="cat_name">Имя</label>
                <input id="cat_name" type="text" name="name" placeholder="Введите имя" value="${obj.name}">
                <label for="cat_age">Возраст</label>
                <input id="cat_age" name="age" type="number" placeholder="Введите возраст" value="${obj.age}">
                <label for="cat_id">id</label>
                <input id="cat_id" name="id" type="number" placeholder="Введите id" value="${obj.id}">
                <label for="cat_rate">Оценка</label>
                <input id="cat_rate" type="number" min="1" max="10" name="rate" placeholder="Как Вы оцениваете от 1 до 10?" value="${obj.rate}">
                <label for="cat_description">Описание</label>
                <input id="cat_description" type="text" placeholder="Краткое описание" name="description" value="${obj.description}">
                <label for="cat_image">Фото</label>
                <input id="cat_image" type="text" name="image" placeholder="Укажите ссылку на картинку" value="${obj.image}">
                <div class="checkbox">
                    <p>Нравится?</p>
                    <label for="cat_favorite1"></label>Да</label>
                    <input id="cat_favorite1" name="favorite" type="radio" value="true" ${obj.favorite ? 'checked' : ''}>
                    <label for="cat_favorite2">Нет</label>
                    <input id="cat_favorite2" name="favorite" type="radio" value="false" ${obj.favorite ? '' : 'checked'}>
                </div>
                <button class='JSbutton'>Подтвердить</button>
            </form>
             </div>
        </div>`)
        document.body.appendChild(this.modal);
        return this.modal
    }
    open() {
        setTimeout(() => {
            !this.closing && this.modal.classList.add('open')
        })
     }
    close() {
        this.closing = true;
        this.modal.classList.remove('open')
        this.modal.classList.add('fading')
        setTimeout(() => {
            this.modal.classList.remove('fading')
            this.closing = false
            this.modal.remove()
        }, 400)
    }
}


document.querySelector('#add_cat').addEventListener('click', ev => {                      //добавление и обработка клика для создания новой карточки
    let storageCat = JSON.parse(localStorage.getItem('Cat')) || undefined
    let modal = new Modal()
    modal.create(storageCat)
    modal.open();
    let $postForm = document.querySelector('[data-post]');
    $postForm.addEventListener('change', function(e) {                                    //сохранение введённый данных в localStorage до отправки формы
        let formData = new FormData($postForm);
        let obj = {};
        formData.forEach((value, key) => obj[key] = value);
        obj = {
            ...obj,
            'favorite' : JSON.parse(obj['favorite'])
        };
        localStorage.setItem(`Cat`, `${JSON.stringify(obj)}`)
    })
    document.addEventListener('click', function clack(event) {
        const layout = event.target.classList.contains('modal_overlay');
        const times = event.target.classList.contains('modal_close');
        if (layout || times) {
            modal.close();
            document.removeEventListener('click', clack);
        }
    })
    $postForm.addEventListener('submit', function(ev) {
        ev.preventDefault();
        let formData = new FormData(ev.target);
        let obj = {};
        formData.forEach((value, key) => obj[key] = value);
        obj = {
            ...obj,
            'favorite' : JSON.parse(obj['favorite'])
        }
         fetch('https://cats.petiteweb.dev/api/single/li3rd/add/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(obj)
          })
          .then(res => {
            if (res.status === 200) {
                let lastIndex = document.querySelectorAll('[data-index]').length
                container.insertAdjacentHTML('beforeend', createCard(obj, lastIndex));
                modal.close()
                localStorage.clear()
            } else alert(`Не вышло`)
          }).catch(err => alert(`Ошибка ${err}`))
    })
})