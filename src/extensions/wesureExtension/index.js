import marked from 'marked'


const FOOTER = `
<img src="https://resource.wesure100.com/AT-Config/config/9fd6c58183c45fd0c4877cb034d19b7f.png" />

<img src="https://resource.wesure100.com/AT-Config/config/501958c621203be1c789abbfb0938622.png" />
`
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
    parseResult += FOOTER
    return parseResult
}

const extension = {
    renderer,
    parseCallback
}

export default extension