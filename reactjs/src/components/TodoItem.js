import React, {Component} from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class TodoItem extends Component {

    static propTypes = {
        handleItemDelete: PropTypes.func.isRequired,
        handleItemComplete: PropTypes.func.isRequired,
        todo: PropTypes.object.isRequired,
    };

    _handleItemDelete=()=>{
        this.props.handleItemDelete(this.props.todo.id);
    };

    _handleItemComplete=()=>{
        this.props.handleItemComplete(this.props.todo.id);
    };

    render(){
        return (
            <Grid.Column>
                <Card>
                    <Card.Content>
                        <Card.Header>{this.props.todo.title}</Card.Header>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui two buttons'>
                            <Button basic={!this.props.todo.completed} color='green' onClick={this._handleItemComplete}>
                                {this.props.todo.completed? "Completed":"Complete"}
                            </Button>
                            <Button basic color='red' onClick={this._handleItemDelete}>
                                delete
                            </Button>
                        </div>
                    </Card.Content>
                </Card>
            </Grid.Column>
        )
    }
}

export default TodoItem;
