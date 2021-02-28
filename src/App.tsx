import Layout from 'components/Layout/Layout';
import ModalContextProvider from 'context/ModalContext';
import DashboardProvider from 'context/DashboardContext';

const App = () => (
  <ModalContextProvider>
    <DashboardProvider>
      <Layout />
    </DashboardProvider>
  </ModalContextProvider>
);
export default App;
