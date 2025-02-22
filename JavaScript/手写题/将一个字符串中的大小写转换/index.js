const str1 = 'abcABC';

const transCase = (str) => {
    return str.replace(/([a-z]*)([A-Z]*)/g, (m, s1, s2) => {
        return `${s1.toLowerCase()}${s2.toUpperCase()}`
    })
}

transCase(str1);
