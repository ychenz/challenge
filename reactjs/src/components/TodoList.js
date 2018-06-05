import React, {Component} from 'react';
import TodoItem from './TodoItem';
import io from 'socket.io-client';
import { Header,Input,Button,Grid,Divider } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
const server = io('http://localhost:3003/');


class TodoList extends Component {

    constructor() {
        super();
        this.state = {
            todos: [],
        };
    }

    //missing babel-preset-stage-0 for class properties!!!
    _handleAddItem = () =>{
        if (this.state.input && this.state.input !== ''){
            server.emit('make', {
                title : this.state.input
            });
        }
    };

    _handleInputChange = (e,{value}) => {
        this.setState({input:value})
    };

    _handleItemDelete = (id) =>{
        server.emit('delete', id);
    };

    _handleItemDeleteAll = () =>{
        server.emit('delete_all');
    };

    _handleItemCompleteAll = () =>{
        server.emit('complete_all');
    };

    _handleItemComplete = (id) =>{
        server.emit('complete', id);
    };

    componentDidMount(){
        server.on('load', (todos) => {
            this.setState({todos:todos})
        });

        server.on('new', (todo) => {
            this.setState({todos:this.state.todos.concat([todo])})
        });

        server.on('delete:sync', (id) => {
            this.setState({todos:this.state.todos.filter(todo => todo.id !== id)})
        });

        server.on('complete:sync', (id) => {
            console.log("Sync Completing item with id: " + id);
            let index = this.state.todos.findIndex(todo => todo.id === id);
            let newTodoS = Object.assign([],this.state.todos);
            newTodoS[index].completed = true;
            this.setState({todos:newTodoS});
        });

        server.on('delete_all:sync', () => {
            this.setState({todos:[]})
        });

        server.on('complete_all:sync', () => {
            let newTodoS = Object.assign([],this.state.todos);
            newTodoS.forEach(todo=>todo.completed=true);
            this.setState({todos:newTodoS});
        });

        server.on('error', function(ex) {
            console.log("Oops! Failed to connect");
            console.log(ex);
        });

    }

    render(){
        return (
            <div>
                <Header>Todo List</Header>
                <div>
                    <Input action={<Button content="Add" color="blue"
                                           onClick={this._handleAddItem} />}
                           onChange={this._handleInputChange}
                           placeholder='Add todo item...' />
                    <Button.Group>
                        <Button positive onClick={this._handleItemCompleteAll}>Complete all</Button>
                        <Button.Or text='or' />
                        <Button negative onClick={this._handleItemDeleteAll}>Delete all</Button>
                    </Button.Group>
                </div>
                <Divider/>
                <div>
                    <Grid doubling columns={6}>
                        {this.state.todos.map(todo => {
                            return <TodoItem handleItemComplete={this._handleItemComplete}
                                             handleItemDelete={this._handleItemDelete}
                                             todo={todo} />
                        })}
                    </Grid>
                </div>
            </div>

        )
    }
}

export default TodoList;
