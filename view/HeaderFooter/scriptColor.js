// function alternarCSS() {
//     var cssFile = document.getElementById("cssFile");
//     var currentCSS = cssFile.getAttribute("href");
//     var newCSS = currentCSS === "style.css" ? "style1.css" : "style.css";
//     cssFile.setAttribute("href", newCSS);
// }

const properties = [
    '--btn-color', 
    '--btn-hover-color', 
    '--hour-table-selected-state',
    '--btn-hour-table-available-state',
    '--text-hour-table-available-state',
    '--border',
];

const defaultTheme = [
    '#0082E0',
    '#0063E0',
    '#0082E0',
    '#DEEFFB',
    '#0082E0',
    'none'
];

const darkTheme = [
    '#0500FF',
    '#131184',
    '#0500FF',
    '#131184',
    'white',
    '2px solid black'
];

const applyTheme = (theme) => {
    let root = document.querySelector(':root');

    properties.forEach((prop, index) => {
        root.style.setProperty(prop, theme[index]);
    });
}

function loadTheme() {
    const theme = localStorage.getItem('theme') ?? false;

    if(!theme || theme == 'default') {
        localStorage.setItem('theme', 'default');
        applyTheme(defaultTheme);
    } else {
        localStorage.setItem('theme', 'dark');
        applyTheme(darkTheme);
    } 
}

function toggleTheme() {
    const theme = localStorage.getItem('theme');

    // default theme
    if(theme == 'dark') {
        localStorage.setItem('theme', 'default');
        applyTheme(defaultTheme);
    } else {
        localStorage.setItem('theme', 'dark');
        applyTheme(darkTheme);
    }
}

document.getElementById("btnColor").addEventListener("click", toggleTheme);

loadTheme();