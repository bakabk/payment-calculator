import React from 'react';
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom'
import {Counter} from './features/counter/Counter';
import Learn from './Learn';
import Statistic from "./components/Statistic/Statistic";
import Edit from './Edit';
import Add from './Add';
import Navigation from './components/navigation/Navigation';

import './App.scss'

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
                        <Switch>
                            <Route path="/add-page">
                                <Add/>
                            </Route>
                            <Route path="/edit-page">
                                <Edit/>
                            </Route>
                            <Route path="/counter">
                                <Counter/>
                            </Route>
                            <Route path="/learn">
                                <Learn/>
                            </Route>
                            <Route path="/">
                                <Statistic/>
                            </Route>
                        </Switch>
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
