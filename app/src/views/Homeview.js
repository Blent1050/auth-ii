import React, { Component } from 'react';
import requiresAuth from '../auth/requiresAuth';

class Homeview extends Component {
  render() {
    return (
      <div>
        <h1>Welcome home</h1>
      </div>
    );
  }
}

export default requiresAuth(Homeview);
