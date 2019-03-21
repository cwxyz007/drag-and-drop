const rootEl = document.getElementById('root')
const width = rootEl.clientWidth
const height = rootEl.clientHeight

const dragObj = {
  current: {
    el: null,
    pos: {
      x: 0,
      y: 0,
    },
  },
  isMove: false,
  type: 'root',
  zIndex: 0,
}

window.onload = () => {
  const $root = document.getElementById('root')
  const $toolbox = document.getElementById('toolbox')
  const $current = document.getElementById('current')

  function addRootObj(el) {
    el.addEventListener('mousedown', (e) => {
      dragObj.current.el = el
      dragObj.type = 'root'
      dragObj.zIndex++
      el.style.zIndex = dragObj.zIndex
    })
  }

  document.getElementById('edit').addEventListener('click', (e) => {
    dragObj.isMove = !dragObj.isMove
    e.currentTarget.innerText = dragObj.isMove
    document.querySelectorAll('input, select').forEach((el) => {
      el.disabled = dragObj.isMove
    })
  })

  const els = document.querySelectorAll('#root .area')
  els.forEach((el) => {
    addRootObj(el)
  })

  document.querySelectorAll('#toolbox .area').forEach((el) => {
    el.addEventListener('mousedown', (e) => {
      if (!dragObj.isMove) return

      const clone = e.currentTarget.cloneNode(true)
      const style = getComputedStyle(e.currentTarget)
      clone.style.left = parseInt(style.left) + 7 + 'px'
      clone.style.top = parseInt(style.top) + 450 + 'px'
      clone.style.opacity = 0.5

      $current.innerHTML = ''
      $current.appendChild(clone)

      dragObj.current.el = clone
      dragObj.type = 'toolbox'
    })
  })

  document.addEventListener('mousemove', (e) => {
    if (!dragObj.isMove || !dragObj.current.el) return
    const el = dragObj.current.el
    const style = getComputedStyle(el)
    dragObj.current.pos = {
      x: parseInt(style.left),
      y: parseInt(style.top),
    }

    const pos = dragObj.current.pos

    pos.x += e.movementX
    pos.y += e.movementY

    if (dragObj.type === 'root') {
      if (pos.x < 0) {
        pos.x = 0
      } else if (pos.x > width - el.clientWidth) {
        pos.x = width - el.clientWidth
      }

      if (pos.y < 0) {
        pos.y = 0
      } else if (pos.y > height - el.clientHeight) {
        pos.y = height - el.clientHeight
      }
    }

    el.style.left = pos.x + 'px'
    el.style.top = pos.y + 'px'
  })

  document.addEventListener('mouseup', (e) => {
    if (!dragObj.current.el) {
      return
    }

    if (dragObj.type === 'toolbox') {
      const style = getComputedStyle($root)
      const rect = {
        x: parseInt(style.left),
        y: parseInt(style.top),
        w: $root.clientWidth,
        h: $root.clientHeight,
      }

      const objStyle = getComputedStyle(dragObj.current.el)
      const pos = {
        x: parseInt(objStyle.left),
        y: parseInt(objStyle.top),
      }

      if (pos.x > rect.x && pos.x < rect.x + rect.w && pos.y > rect.y && pos.y < rect.y + rect.h) {
        const el = dragObj.current.el
        addRootObj(el)

        el.style.left = pos.x - 7 + 'px'
        el.style.top = pos.y - 50 + 'px'
        el.style.opacity = 1
        $root.appendChild(el)
      } else {
        dragObj.current.el.remove()
      }
    }

    dragObj.current.el = null
  })
}
