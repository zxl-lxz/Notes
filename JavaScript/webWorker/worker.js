onmessage = (e) => {
    console.log(e.data, 'worker.js');
    e.data.push(2);
    postMessage(e.data);
};