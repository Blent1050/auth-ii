import React, { Component } from 'react';
import axios from 'axios';

//HOC validating token before showing page.
import requiresAuth from '../auth/requiresAuth';

class Homeview extends Component {
  state = {
    users: [],
  };

  render() {
    return this.displayUsers();
  }

  componentDidMount() {
    this.getUsers();
  }

  displayUsers = () => {
    return (
      <>
        <button onClick={this.logout}>Logout</button>
        {this.state.users.map(user => {
          return <p key={user.id}>{user.username}</p>;
        })}
      </>
    );
  };

  getUsers = () => {
    axios
      .get('/api/users')
      .then(res => {
        console.log(res.data);
        this.setState({ users: res.data.users });
      })
      .catch(err => console.log(err));
  };
  logout = () => {
    localStorage.removeItem('jwt');

    this.props.history.push('/login');
  };
}

export default requiresAuth(Homeview);
