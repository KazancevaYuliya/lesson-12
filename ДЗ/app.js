class ToDo {
    data = []
    isEdit = false
    formCreateElement = document.querySelector('#formCreate')
    listElement = document.querySelector('#list')
    inputSearchTitleElement = document.querySelector('#searchTitle')
    selectSortElement = document.querySelector('#sort')
  
  
    constructor() {
      this.#init()
    }
  
    #init() {
      this.handleInputSearchTitle = this.#handleInputSearchTitle.bind(this)
      this.handleChangeSort = this.#handleChangeSort.bind(this)
      this.handleChangeTodo = this.#handleChangeTodo.bind(this)
      this.handleRemoveTodo = this.#handleRemoveTodo.bind(this)
      this.handleEditTodo = this.#handleEditTodo.bind(this)
      this.handleSubmitFormEdit = this.#handleSubmitFormEdit.bind(this)
  
  
      this.formCreateElement.addEventListener('submit', this.handleSubmitFormCreate)
      this.inputSearchTitleElement.addEventListener('input', this.handleInputSearchTitle)
      this.selectSortElement.addEventListener('change', this.handleChangeSort)
      this.listElement.addEventListener('change', this.handleChangeTodo)
      this.listElement.addEventListener('click', this.handleRemoveTodo)
      this.listElement.addEventListener('click', this.handleEditTodo)
      this.listElement.addEventListener('submit', this.handleSubmitFormEdit)
      window.addEventListener('beforeunload', this.handleBeforeUnload)
      window.addEventListener('DOMContentLoaded', this.handleDOMReady)
    }
  
  
    #handleSubmitFormCreate(event) {
      event.preventDefault()
  
  
      const todo = {
        id: new Date().getTime(),
        createdAt: date,
        isChecked: false,
      }
  
      const formData = new FormData(this.formCreateElement)
  
      for (let [name, value] of formData.entries()) {
        todo[name] = value
      }
  
      this.data.push(todo)
      this.formCreateElement.reset()
  
  
  
      this.render()
    }
  
    #handleSubmitFormEdit(event) {
      event.preventDefault()
  
      const { target } = event
      this.inputElement = target.querySelector('input[name="title"]')
      const { value } = this.inputElement
      const { id } = target.dataset
  
      this.data.forEach((item) => {
        if (item.id == id) {
          item.title = value
        }
      })
  
  
  
      const parentElement = target.closest('.island__item')
      parentElement.classList.remove('island__item_edit')
  
      this.isEdit = false
  
      this.render()
    }
  
    #handleInputSearchTitle(event) {
      const { target } = event
      const queryString = target.value
  
      const matches = this.data.filter(item => {
        if (item.title.includes(queryString)) {
          return true
        }
      })
  
      this.render()
    }
  
    #handleChangeSort(event) {
      const { target } = event
      const { value } = target
  
      let sortedData = []
  
      if (value) {
        sortedData = this.data.sort((a, b) => b[value] - a[value])
      } else {
        sortedData = this.data
      }
  
      this.render()
    }
  
    #todoTemplate({ id, title, isChecked, createdAt, priority, estimate }) {
      const idAttr = 'todo' + id
      const checkedAttr = isChecked ? 'checked' : ''
      const dateCreatedAt = buildDate(createdAt)
      const stars = buildPriority(priority)
  
      return `
        <div class="island__item ${isChecked ? 'island__item_checked' : ''}">
          <div class="form-check d-flex align-items-center">
            <input
              class="form-check-input"
              type="checkbox"
              ${checkedAttr}
              id="${idAttr}"
              data-id="${id}">
            <label class="form-check-label ms-3" for="${idAttr}">
              ${title}
            </label>
            <form class="form-edit ms-3" data-id="${id}">
              <input type="text" class="form-control" name="title" placeholder="Заголовок" value="${title}">
              <button
                class="btn btn-sm btn-primary ms-3"
                type="submit">
              Save
            </button>
            </form>
            <span class="badge bg-dark ms-auto">${stars}</span>
            <span class="ms-3">${estimate + 'ч.'}</span>
            <time class="ms-3">${dateCreatedAt}</time>
            <button
              class="btn btn-sm btn-warning ms-3"
              type="button"
              data-role="edit"
              data-id="${id}">
              Редактировать
            </button>
            <button
              class="btn btn-sm btn-danger ms-3"
              type="button"
              data-role="remove"
              data-id="${id}">
              <span class="pointer-events-none">Delet</span>
            </button>
          </div>
        </div>
      `
    }
  
    #handleChangeTodo(event) {
      const { target } = event
      const { id } = target.dataset
  
      if (target.type != 'checkbox') return
  
      this.data.forEach((item) => {
        if (item.id == id) {
          item.isChecked = target.checked
        }
      })
  
      const { parentElement } = target.closest('.island__item')
      parentElement.classList.toggle('island__item_checked')
    }
  
    #handleRemoveTodo(event) {
      const { target } = event
  
      if (target.dataset.role != 'remove') return
  
      const { id } = target.dataset
  
      this.data.forEach((item, index) => {
        if (item.id == id) {
          this.data.splice(index, 1)
        }
      })
  
      this.render()
    }
  
    #handleEditTodo(event) {
      const { target } = event
  
      if (target.dataset.role != 'edit') return
  
      if (this.isEdit) {
        alert('Задача уже редактируется')
        return
      }
  
      const { parentElement } = target.closest('.island__item')
      parentElement.classList.add('island__item_edit')
      this.isEdit = true
    }
  
    #transformTime(time) {
      return time < 10 ? `0${time}` : time
    }
  
    #buildDate(date) {
      const objectDate = new Date(date)
      const day = transformTime(objectDate.getDate())
      const month = transformTime(objectDate.getMonth() + 1)
      const year = transformTime(objectDate.getFullYear())
  
      return `${day}.${month}.${year}`
    }
  
    #buildPriority(count) {
      let stars = ''
  
      for (let i = 0; i < count; i++) {
        stars = stars + '⭐'
      }
  
      return stars
    }
  
    #render(todoList) {
      let result = ''
  
      this.todoList.forEach((todo) => {
        const template = this.todoTemplate(todo)
  
        result = result + template
      })
  
      this.listElement.innerHTML = result
    }
  }
  new ToDo()