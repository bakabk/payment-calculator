import React from "react";
import {Link} from "react-router-dom";

import './Navigation.scss'

const navigationList = [
    {title: 'Сводная таблица', url: '/'},
    {title: 'Добавить/изменнить данные', url: '/edit-page/0'},
    {title: 'Counter', url: '/counter'},
    {title: 'Learn', url: '/learn'}
];

type NavigationType = {
    title: string,
    url: string
}

function linkElement(list: Array<NavigationType>) {
    return list.map(({url, title}, i) => {
        return <li key={i} className='navigation-wrapper--list'>
            <Link to={url}>{title}</Link>
        </li>
    })
}

const Navigation: React.FC = () => {
    return <nav className='navigation'>
        <ul className='navigation-wrapper'>
            {linkElement(navigationList)}
        </ul>
    </nav>
}

export default Navigation;