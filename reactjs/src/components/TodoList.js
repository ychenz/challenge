import React, {Component} from 'react';
import PropTypes from 'prop-types';

class TodoList extends Component {
    static propTypes = {
        todos:PropTypes.array,
    };
}

export default TodoList;
