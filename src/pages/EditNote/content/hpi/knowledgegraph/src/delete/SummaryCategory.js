import React from 'react'

class SummaryCategory extends React.Component {
    constructor() {
        super()
        this.state = {
            categoryData: []
        }
    }

    function() {
        this.setState({
            categoryData: this.props.array.map(item =>
                <div>
                    {item.question}
                    <div> {item.response.map(ans => ans)} </div>
                </div>
            )})
    }

    render() {
        return (
            <div> {this.state.categoryData} </div>
        )
    }
}

export default SummaryCategory