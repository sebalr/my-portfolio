import Layout from 'components/Layout/Layout';
import DashboardProvider from 'context/DashboardContext';

const App = () => (
  <div>
    <DashboardProvider>
      <Layout />
    </DashboardProvider>
  </div>
);
export default App;
