import Layout from 'components/Layout/Layout';
import DashboardProvider from 'context/DashboardContext';

const App = () => (
  <DashboardProvider>
    <Layout />
  </DashboardProvider>
);
export default App;
