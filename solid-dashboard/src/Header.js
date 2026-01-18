import React, { Component } from "react";

import Metals from 'metals/Metals'
import './Header.css'

class Header extends Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div className="headerContents">
                <div className="widget"><Metals /></div>
                <div className="widget">Widget coming soon!</div>
                <div className="widget">Widget coming soon!</div>
            </div>
        )
    }
}

export default Header;