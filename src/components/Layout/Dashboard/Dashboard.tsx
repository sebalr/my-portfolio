import React, { Component } from 'react';
import Summary from 'components/Layout/Dashboard/Summary/Summary';
import Investment from 'components/Layout/Dashboard/Investment/Investment';

class Dashboard extends Component {
  constructor(props: any) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div>
        <h2>Dashboard</h2>
        <Summary />
        <Investment />
        <Investment />
        <Investment />
      </div>
    );
  }
}

export default Dashboard;
