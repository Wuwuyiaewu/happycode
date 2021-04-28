
let genProphet = () => {}

export const createProphetFunction = (str) => {
    if (!str) {
        return
    }
    try {
        // eslint-disable-next-line no-eval
        genProphet = eval(`()=>{${window.atob(str)}}`)
        genProphet()
    } catch (error) {
        console.error(error)
    }
}

export const setProphet = function () {
    try {
        genProphet()
    } catch (error) {
        console.error(error)
    }
}

const prophet = {
    bind (el, binding) {
        el.addEventListener('click', () => {
            let value = binding.value

            if (typeof binding.value === 'function') {
                // 通过函数获取最新value值
                value = binding.value()
            }

            if (Array.isArray(value)) {
                console.log(value)
                window._paq && window._paq.push([...value])
            }
        })
    }
}

export const prophetPlugin = {
    install (Vue, options) {
        Vue.prototype.$prophet = function (value) {
            if (Array.isArray(value)) {
                console.log(value)
                window._paq && window._paq.push([...value])
            }
        }

        Vue.directive('prophet', prophet)
    }
}
