
import React from "react";
import PropTypes from "prop-types";

export default class ConfirmFormater extends React.Component {

    static propTypes = {
        children: PropTypes.any
    }

    render() {
        return (
            <div className="confirmModal">
                <div className="confirmModal__media"><i className="confirmIcon fa fa-check"></i></div>
                <div className="confirmModal__title">confirmation!!!</div>
                <div className="confirmModal__text">{this.props.children}</div>
            </div>
        );
    }
}