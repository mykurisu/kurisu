import marked from 'marked'


const renderer = new marked.Renderer()

renderer.heading = function (text, level) {
    if (level === 1) {
        return `<h1 class="title"><p class="num">{{h1Title}}</p><p class="text">${text}</p></h1>
        `
    } else {
        return `<h${level}>${text}</h${level}>`
    }
}

const parseCallback = (error, parseResult) => {
    if (error) {
        return ''
    }
    let h1Title = 0
    parseResult = parseResult.replace(/{{h1Title}}/g, () => {
        return ++h1Title
    })
    return parseResult
}

const extension = {
    renderer,
    parseCallback
}

export default extension