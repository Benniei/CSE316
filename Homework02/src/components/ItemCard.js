import React from "react";

// Uses id + name
export default class ItemCard extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            itemName: this.props.name,
            editActive: false,
            indexDrag: null
        }
    }

    handleClick = (event) => {
        if(event.detail === 2){
            this.handleToggleEdit(event);
        }
    }

    handleToggleEdit = (event) => {
        this.setState({
            editActive: !this.state.editActive
        });
    }

    handleKeyPress = (event) => {
        if(event.code === "Enter") {
            this.handleBlur(event);
        }
    }

    handleBlur = (event) => {
        let itemIndex = this.props.index;
        let text = event.target.value;
        this.props.renameItemCallBack(itemIndex, text);
        this.handleToggleEdit();
    }

    handleUpdate = (event) => {
        this.setState({ itemName: event.target.value});
    }

    handleDragStart = (event) => {
        this.props.oldIndexCallBack(this.props.index)
        event.dataTransfer.setData("oldIndex", this.props.index);
    }

    handleOnDragOver = (event) => {
        event.preventDefault();
    }

    handleOnDropEnd = (event) => {
        let oldIndex = event.dataTransfer.getData("oldIndex");
        console.log("dropped: from " + oldIndex + " to " + this.props.oldIndex);
        this.props.moveItemCallBack(oldIndex, this.props.oldIndex);
    }
    
    handleOnDragEnter = (event) => {
        let oldIndex = this.props.oldIndex;  
        console.log("index: " + oldIndex + "    New Index: " + this.props.index);
        this.props.dragEnterHandler(oldIndex, this.props.index);
        if(this.props.index > oldIndex){
            this.props.oldIndexCallBack(oldIndex + 1);
        }
        else if(this.props.index < oldIndex){
            this.props.oldIndexCallBack(oldIndex - 1);
        }
        
    }

    render() {
        const{
            itemName, 
            index
        } = this.props;
        if(this.state.editActive){
            return(
                <div
                    id={"item-" + (index + 1)}
                    className={"top5-item"}
                >
                    <input
                        id={"item-input-text-" + (index + 1)}
                        type='text'
                        onBlur={this.handleBlur}
                        onKeyPress={this.handleKeyPress}
                        onChange={this.handleUpdate}
                        defaultValue={itemName}
                        autoFocus
                    />
                </div>
            )
        }
        else{
            return (
                (this.props.green)?
                <div
                    id={"item-" + (index + 1)}
                    className={"top5-item-dragged-to"}
                    onDragEnd={this.handleOnDropEnd}
                >
                </div>
                :
                <div
                    id={"item-" + (index + 1)}
                    className={"top5-item"}
                    onClick={this.handleClick}
                    draggable
                    onDragStart={this.handleDragStart}
                    onDragEnter={this.handleOnDragEnter}
                    onDragEnd={this.handleOnDropEnd}
                >
                {itemName}
                </div>
            )
        }
    }
}