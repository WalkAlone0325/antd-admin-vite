import { Route, Router, Switch } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { GlobalContext } from '@/context'
import history from '@/history'
import rootReducer from '@/redux'
import Login from '@/pages/login'
import PageLayout from '@/layout/page-layout'

const store = createStore(rootReducer)

function App() {

  const contextValue = {}

  return (
    <Router history={history}>
      <ConfigProvider>
        <Provider store={store}>
          <GlobalContext.Provider value={contextValue}>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/" component={PageLayout} />
            </Switch>
          </GlobalContext.Provider>
        </Provider>
      </ConfigProvider>
    </Router>
  )
}

export default App
