<!-- FileReader -->

```js
function getBase64(imgUrl) {
    window.URL = window.URL || window.webkitURL;
    var xhr = new XMLHttpRequest();
    xhr.open('get', imgUrl, true);
    // 至关重要
    xhr.responseType = 'blob';
    xhr.onload = function () {
        if (this.status == 200) {
            //得到一个blob对象
            var blob = this.response;
            console.log('blob', blob);
            // 至关重要
            let oFileReader = new FileReader();
            oFileReader.onloadend = function (e) {
                // 此处拿到的已经是 base64的图片了
                let base64 = e.target.result;
                console.log('方式一》》》》》》》》》', base64);
            };
            oFileReader.readAsDataURL(blob);
        }
    };
    xhr.send();
}
```

<!-- canvas -->

```js
const getBase64 = (url) => {
    return new Promise((resolve, reject) => {
        const Img = new Image();
        let dataURL = '';
        Img.crossOrigin = '';
        Img.onload = function () {
            // 要先确保图片完整获取到，这是个异步事件
            var canvas = document.createElement('canvas'); // 创建canvas元素
            var width = Img.width; // 确保canvas的尺寸和图片一样
            var height = Img.height;
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(Img, 0, 0, width, height); // 将图片绘制到canvas中
            dataURL = canvas.toDataURL(); // 转换图片为dataURL
            console.log(dataURL, 'base64转换');
            resolve(dataURL);
        };
        Img.src = url + '?v=' + Math.random();
    });
};
```
