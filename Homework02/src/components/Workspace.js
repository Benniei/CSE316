import React from "react";
import ItemCard from "./ItemCard.js"

export default class Workspace extends React.Component {
    render() {
        const { currentList,
                renameItemCallBack,
                moveItemCallBack,
                dragEnterHandler,
                currentIndex,
                oldIndexCallBack,
                oldIndex} = this.props;
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
                            (index !== currentIndex)?
                            <ItemCard
                                itemName={itName}
                                key={index + 1}
                                index={index}
                                renameItemCallBack={renameItemCallBack}
                                moveItemCallBack={moveItemCallBack}
                                dragEnterHandler={dragEnterHandler}
                                oldIndexCallBack={oldIndexCallBack}
                                oldIndex={oldIndex}
                            />
                            :
                            <ItemCard
                                key={index + 1}
                                index={index}
                                green={true}
                                moveItemCallBack={moveItemCallBack}
                                oldIndexCallBack={oldIndexCallBack}
                                oldIndex={oldIndex}
                            />
                        )) : null
                    }
                    </div>
                </div>
            </div>
        )
    }
}