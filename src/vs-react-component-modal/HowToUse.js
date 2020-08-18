import React from 'react';
import Modal from "./index";
import "./css/theme1/theme.css";


const clickFooter = () => {
    console.log("click footer");
}

function HowToUse() {

    const footerArray = [{
        label: "OK",
        dataId: 1,
        onCustomEvent: clickFooter()
    },
    {
        label: "cancel",
        dataId: 2,
        onCustomEvent: null
    }
    ];

    return (
        <Modal
            element={<div className="button bg-brand ht32 wt32 mid pointer">op</div>}
            modalClass="modal"
            modalBodyClass="modal-body"
            elementClass="modalbtn"
            title="Modal"
            footerActions={footerArray}
            maxWidth={1000}
            modalType="LEFTDIAGONAL"
        >
            Cras mattis consectetur purus sit amet fermentum. Cras
            justo odio, dapibus ac facilisis in, egestas eget quam. Morbi
            leo risus, porta ac consectetur ac, vestibulum at eros.
        </Modal>
    );

}

export default HowToUse;
