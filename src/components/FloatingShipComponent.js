import React, {Component} from 'react';

class FloatingShipComponent extends Component {
    render() {
        return (<div>
            {this.props.ship.sections.map((_, index) => {
                return <div key={index} className='ship-square space' />;
            })}
        </div>);
    }
}

export default FloatingShipComponent;