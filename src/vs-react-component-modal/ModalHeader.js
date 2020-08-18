import React, { Component } from "react";
//import PropTypes from "prop-types";

export default class ModalHeader extends Component {

    getTitle = () => {
        return (
            <div className="modal-header__title">{this.props.title}</div>
        )
    }

    getClose = () => {
        return (
            <div onClick={this.props.closeModal} className="modal-header__close">X Close</div>
        )
    }

    render() {
        return (
            <div className="modal__header">
                {this.getTitle()}
                {this.getClose()}
            </div>
        );
    }
}