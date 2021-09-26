import React from "react";

export default class EditToolbar extends React.Component {
    render() {
        const {
            closeCallback,
            undo,
            redo,
            close
        } = this.props;
        return (
            <div id="edit-toolbar">
                {   undo ? 
                    <div 
                    id='undo-button' 
                    className="top5-button">
                        &#x21B6;
                    </div> 
                    :
                    <div 
                    id='undo-button' 
                    className="top5-button-disabled"
                    >
                        &#x21B6;
                    </div>
                }
                {   redo ? 
                    <div
                    id='redo-button'
                    className="top5-button">
                        &#x21B7;
                    </div>
                    :
                    <div
                    id='redo-button'
                    className="top5-button-disabled">
                        &#x21B7;
                    </div>
                }
                {
                    close ?
                    <div
                        id='close-button'
                        className="top5-button"
                        onClick={closeCallback}
                    >
                        &#x24E7;
                    </div>
                    :
                    <div
                        id='close-button'
                        className="top5-button-disabled"
                    >
                        &#x24E7;
                    </div>
                }   
            </div>
        )
    }
}