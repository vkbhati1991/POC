import React, { Component } from "react";
//import PropTypes from "prop-types";

export default class ModalFooter extends Component {

    getFooterAction = (onCustomEvent) => {
        this.props.closeModal();
        onCustomEvent && onCustomEvent();
    }

    renderButtons = () => {
        const { footerActions } = this.props;

        if (footerActions && footerActions.length < 0) {
            return;
        }

        const footerButtons = footerActions.map((fa) => {
            return (
                <div onClick={() => { this.getFooterAction(fa.onCustomEvent) }} key={fa.dataId} className="modal-button">{fa.label}</div>
            )
        });

        return (
            <div className="modal-footer-actions">
                {footerButtons}
            </div>
        )
    }
    render() {
        return (
            <div className="modal__footer">{this.renderButtons()}</div>
        );
    }
}