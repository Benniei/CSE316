import React from "react";

// Uses id + name
export default class ItemCard extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            itemName: this.props.name,
            itemIndex: this.props.index + 1,
            editActive: false
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
            this.handleBlur();
        }
    }

    handleBlur = (event) => {
        //TODO: Save list
        this.handleToggleEdit();
    }

    handleUpdate = (event) => {
        this.setState({ itemName: event.target.value});
    }

    render() {
        const{
            itemName, 
            itemIndex
        } = this.props;
        if(this.state.editActive){
            return(
                <div
                    id={"item-" + itemIndex}
                    className={"top5-item"}
                >
                    <input
                        id={"item-input-text-" + itemIndex}
                        type='text'
                        onBlur={this.handleBlur}
                        onChange={this.handleUpdate}
                        defaultValue={itemName}
                        autoFocus
                    />
                </div>
            )
        }
        else{
            return (
                <div
                    id={"item-" + itemIndex}
                    className={"top5-item"}
                    onClick={this.handleClick}
                >
                {itemName}
                </div>
            )
        }
    }
}