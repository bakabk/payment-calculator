import React, {lazy, Suspense} from 'react';
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom'

import Navigation from './components/navigation/Navigation';

import './App.scss'

const Statistic = lazy(() => import('./components/Statistic/Statistic'));
const Counter = lazy(() => import('./features/counter/Counter'));
const Learn = lazy(() => import('./Learn'));
const EditForm = lazy(() => import('./features/EditForm/EditForm'));

function App() {
    return (
        <Router>
            <div className="App">
                <header className='app__header'>
                    шапка
                </header>

                <div className='app__body'>
                    <Navigation />

                    <div className='app__body-content'>
                        <Suspense fallback={<div>Загрузка...</div>}>
                            <Switch>
                                <Route path="/edit-page/:formId" component={EditForm} />
                                <Route path="/counter" component={Counter} />
                                <Route path="/learn" component={Learn} />
                                <Route path="/" component={Statistic} />
                            </Switch>
                        </Suspense>
                    </div>
                </div>

                <footer className='app__footer'>
                    подвал
                </footer>
            </div>
        </Router>
    );
}

export default App;
