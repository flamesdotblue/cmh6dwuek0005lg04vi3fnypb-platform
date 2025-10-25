import Dashboard from './screens/Dashboard'
import Jobs from './screens/Jobs'
import Customers from './screens/Customers'
import Finance from './screens/Finance'
import Expenses from './screens/Expenses'

const TabRouter = ({ state }) => {
  switch (state.activeTab) {
    case 'Dashboard':
      return <Dashboard state={state} />
    case 'Jobs':
      return <Jobs state={state} />
    case 'Customers':
      return <Customers state={state} />
    case 'Finance':
      return <Finance state={state} />
    case 'Expenses':
      return <Expenses state={state} />
    default:
      return <Dashboard state={state} />
  }
}

export default TabRouter
