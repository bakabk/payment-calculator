import React from 'react';
import {Link, Route, Switch, BrowserRouter as Router} from 'react-router-dom'
import {Counter} from './features/counter/Counter';
import Learn from './Learn';
import Table from './Table';
import Edit from './Edit';
import Add from './Add';

import './App.scss'

function App() {
    return (
        <Router>
            <div className="App">
                <header className='app__header'>
                    шапка
                </header>

                <body className='app__body'>
                <nav className='app__body-navigation'>
                    <ul className='app__body-navigation-wrapper'>
                        <li className='app__body-navigation-wrapper--list'>
                            <Link to="/">Сводная таблица</Link>
                        </li>
                        <li className='app__body-navigation-wrapper--list'>
                            <Link to="/add-page">Добавить данные за месяц</Link>
                        </li>
                        <li className='app__body-navigation-wrapper--list'>
                            <Link to="/edit-page">Изменить данные за месяц</Link>
                        </li>
                        <li className='app__body-navigation-wrapper--list'>
                            <Link to="/counter">Counter</Link>
                        </li>
                        <li className='app__body-navigation-wrapper--list'>
                            <Link to="/learn">Learn</Link>
                        </li>
                    </ul>
                </nav>

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
                            <Table/>
                        </Route>
                    </Switch>
                </div>
                </body>

                <footer className='app__footer'>
                    подвал
                </footer>
            </div>
        </Router>
    );
}

export default App;
