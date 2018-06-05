/**
 * Created by yzhao on 7/19/17.
 */
import React, {Component} from 'react';
import './CardView.css';

class PlainCard extends Component {

    render() {

        return (
            <div style={this.props.style} className="plain-card" >
                <div className="plain-card-container">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default PlainCard;
