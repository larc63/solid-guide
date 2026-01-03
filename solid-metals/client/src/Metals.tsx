import React, { Component } from "react";

import './Metals.css'
export default class Metals extends Component {


    render() {
        return (
            <div className="container">
                <div className="quotecontainer">
                    <div className="item">Gold</div>
                    <div className="item">$1000</div>
                    <div className="item">Silver</div>
                    <div className="item">$50</div>
                    <div className="item">Platinum</div>
                    <div className="item">$1200</div>
                    <div className="footnote">Last updated 1/2/2026 10:33:00</div>
                </div>
            </div>
        );
    }
}