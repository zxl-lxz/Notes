import React, {useState} from 'react';
import Dots from './Dots';

const Index = () => {
    const [show, setShow] = useState(false);
    const [btnShow, setBtnShow] = useState(true);

    const handleClick = () => {
        setBtnShow(false);
        setShow(true);
    }
    return (
        <div>
            {btnShow && <button onClick={handleClick}>show</button>}
            {show && <Dots />}
        </div>
    );
};

export default Index;