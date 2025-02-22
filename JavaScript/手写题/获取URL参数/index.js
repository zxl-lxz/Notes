
const parse = (url) => {
    let params = {};
    if (!url) {
        url = window.location.search;
    }
    url.replace(/([^&=?]+)=([^&=?]+)/g, (m, s1, s2) => {
        let key = decodeURIComponent(s1);
        let value = decodeURIComponent(s2);
        params[key] = value;
    });
    return params;
};
