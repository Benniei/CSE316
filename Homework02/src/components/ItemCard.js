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

    render() {
        const{
            itemName, 
            itemIndex
        } = this.props;
        if(this.state.editActive){
            return(
                <input
                />
            )
        }
        else{
            return (
                <div
                    id={"item-" + itemIndex}
                    className={"top5-item"}
                >
                {itemName}
                </div>
            )
        }
    }
}