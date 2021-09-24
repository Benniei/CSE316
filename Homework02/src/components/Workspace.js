import React from "react";
import ItemCard from "./ItemCard.js"

export default class Workspace extends React.Component {
    render() {
        const {currentList} = this.props;
        return (
            <div id="top5-workspace">
                <div id="workspace-edit">
                    <div id="edit-numbering">
                        <div className="item-number">1.</div>
                        <div className="item-number">2.</div>
                        <div className="item-number">3.</div>
                        <div className="item-number">4.</div>
                        <div className="item-number">5.</div>
                    </div>
                    <div id="edit-items">
                    {
                        (currentList != null) ? currentList.items.map((itName, index) => (
                            <ItemCard
                                itemName={itName}
                                itemIndex={index}
                            />
                        )) : null
                    }
                    </div>
                </div>
            </div>
        )
    }
}