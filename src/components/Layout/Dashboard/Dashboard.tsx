import React, { Component } from 'react';
import Summary from 'components/Layout/Dashboard/Summary/Summary';
import Investment from 'components/Layout/Dashboard/Investment/Investment';
import { IDashboardState } from 'interfaces/state.interfaces';

class Dashboard extends Component<IDashboardState, IDashboardState> {

  constructor(props: IDashboardState) {
    super(props);
    this.state = {
      investments: [],
    };
  }

  componentDidMount() {
    const { investments } = this.props;
    this.setState({ investments });
  }

  componentDidUpdate() {
    const { investments } = this.props;
    const { investments: stateInvestments } = this.state;
    if (JSON.stringify(investments) !== JSON.stringify(stateInvestments)) {
      // eslint-disable-next-line
      this.setState({ investments: stateInvestments });
    }
  }

  render() {
    const { investments } = this.state;
    return (
      <div>
        <h2>Dashboard</h2>
        <Summary investments={investments} />
        <Investment />
        <Investment />
        <Investment />
      </div>
    );
  }

}

export default Dashboard;
