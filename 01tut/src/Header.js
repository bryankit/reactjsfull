import React from 'react'

const Header = ({title}) => {
    const headerStyle = {
        backgroundColor : 'mediumblue', 
        color: '#fff'
    };

    return (
        <header style={headerStyle}>
            <h1>{title}</h1>
        </header>
    )
}

Header.defaultProps = {
    title : 'default title'
};

export default Header