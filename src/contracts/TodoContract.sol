// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title OnchainTodo
 * @dev A simple todo list contract deployed on Base
 * @notice Each user has their own list of todos stored onchain
 */
contract OnchainTodo {
    struct Todo {
        uint256 id;
        string text;
        bool completed;
        uint256 createdAt;
    }

    // User address => array of todos
    mapping(address => Todo[]) private userTodos;
    
    // User address => next todo ID
    mapping(address => uint256) private nextTodoId;

    event TodoCreated(address indexed user, uint256 indexed id, string text, uint256 createdAt);
    event TodoToggled(address indexed user, uint256 indexed id, bool completed);
    event TodoDeleted(address indexed user, uint256 indexed id);

    /**
     * @dev Create a new todo
     * @param _text The todo text content
     */
    function createTodo(string calldata _text) external {
        require(bytes(_text).length > 0, "Todo text cannot be empty");
        require(bytes(_text).length <= 500, "Todo text too long");

        uint256 todoId = nextTodoId[msg.sender];
        nextTodoId[msg.sender]++;

        userTodos[msg.sender].push(Todo({
            id: todoId,
            text: _text,
            completed: false,
            createdAt: block.timestamp
        }));

        emit TodoCreated(msg.sender, todoId, _text, block.timestamp);
    }

    /**
     * @dev Toggle a todo's completed status
     * @param _id The todo ID to toggle
     */
    function toggleTodo(uint256 _id) external {
        Todo[] storage todos = userTodos[msg.sender];
        bool found = false;
        
        for (uint256 i = 0; i < todos.length; i++) {
            if (todos[i].id == _id) {
                todos[i].completed = !todos[i].completed;
                emit TodoToggled(msg.sender, _id, todos[i].completed);
                found = true;
                break;
            }
        }
        
        require(found, "Todo not found");
    }

    /**
     * @dev Delete a todo
     * @param _id The todo ID to delete
     */
    function deleteTodo(uint256 _id) external {
        Todo[] storage todos = userTodos[msg.sender];
        bool found = false;
        
        for (uint256 i = 0; i < todos.length; i++) {
            if (todos[i].id == _id) {
                // Move last element to deleted position and pop
                todos[i] = todos[todos.length - 1];
                todos.pop();
                emit TodoDeleted(msg.sender, _id);
                found = true;
                break;
            }
        }
        
        require(found, "Todo not found");
    }

    /**
     * @dev Get all todos for the caller
     * @return Array of todos
     */
    function getTodos() external view returns (Todo[] memory) {
        return userTodos[msg.sender];
    }

    /**
     * @dev Get the count of todos for the caller
     * @return Number of todos
     */
    function getTodoCount() external view returns (uint256) {
        return userTodos[msg.sender].length;
    }
}
