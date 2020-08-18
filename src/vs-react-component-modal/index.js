import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "./index.css";
import ModalContainer from "./ModalContainer";

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    static propTypes = {
        element: PropTypes.any,
        title: PropTypes.string,
        children: PropTypes.any,
        modalClass: PropTypes.string,
        modalBodyClass: PropTypes.string,
        elementClass: PropTypes.string,
        maxWidth: PropTypes.number,
        overlay: PropTypes.bool,
        header: PropTypes.bool,
        footer: PropTypes.bool,
        footerActions: PropTypes.array,
        modalType: PropTypes.string
    }

    static defaultProps = {
        modalClass: "modal",
        modalBodyClass: "modal-body",
        elementClass: "modal-opener",
        maxWidth: 600,
        overlay: true,
        header: true,
        footer: true,
        modalType: "default"
    }

    openModal = () => {
        this.setState({ isOpen: true });
    }

    closeModal = () => {
        this.setState({ isOpen: false });
    }

    getElem = () => {
        const { element, elementClass } = this.props;
        return (
            <span className={elementClass} onClick={this.openModal}>{element}</span>
        );
    }

    render() {

        const modalProps = {
            children: this.props.children,
            title: this.props.title,
            modalClass: this.props.modalClass,
            modalBodyClass: this.props.modalBodyClass,
            maxWidth: this.props.maxWidth,
            overlay: this.props.overlay,
            header: this.props.header,
            footer: this.props.footer,
            closeModal: this.closeModal,
            footerActions: this.props.footerActions,
            modalType: this.props.modalType
        }

        return (
            <Fragment>
                {this.getElem()}
                {this.state.isOpen && <ModalContainer {...modalProps} />}
            </Fragment>
        );
    }
}

export default Modal;