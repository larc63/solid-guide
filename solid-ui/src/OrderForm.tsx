import {
    Component,
    type ReactNode,
} from "react";

import { OrderFormState, OrderFormProps } from './types'
import { bases, proteins, dressings } from './data/MenuData'

import './OrderForm.css'

class OrderForm extends Component<OrderFormProps> {

    constructor(props: OrderFormProps) {
        super(props);
    }

    state: OrderFormState = {
        base: bases["dd4f089e-fe52-45a6-a58b-0c606adf2fb2"],
        protein: proteins["d3ea25f9-34f6-4bba-afa6-cf16a9ca53bc"],
        dressings: []
    }

    handleBaseChange = (e:any) => {
        this.setState({base: bases[e.target.value]})
    }
    handleProteinChange = (e:any) => {
        this.setState({protein: proteins[e.target.value]})
    }
    handleDressingChange = (e:any) => {
        if(e.target.checked) {
            this.setState({dressings: [...this.state.dressings, dressings[e.target.value]]})
        } else {
            this.setState({dressings: this.state.dressings.filter(d => d != dressings[e.target.value])})
        }
    }

    handleCreateOrder = (e:any) => {
        e.preventDefault();
        if(this.state.dressings.length === 0) {
            return;
        }
        this.props.addOrder(this.state.base, this.state.protein, this.state.dressings);
    }

    render(): ReactNode {
        return (
            <form onSubmit={this.handleCreateOrder}>
                <div className="row">
                    <label htmlFor="bases" className="label">Base: -{this.state.base}-</label>
                    <select id="bases" name="bases" onChange={this.handleBaseChange}>
                        <option value="dd4f089e-fe52-45a6-a58b-0c606adf2fb2">Brown Rice</option>
                        <option value="9a076f68-365d-4722-af8f-d182c3ff71de">White Sushi Rice</option>
                        <option value="d0147d1f-78dc-4fa1-8b5b-ce8840661be8">Polenta</option>
                        <option value="37c1308f-4484-41fc-a1e5-bfbbf4f57524">Quinoa</option>
                    </select>
                </div>
                <div className="row">
                    <label htmlFor="proteins" className="label">Protein: -{this.state.protein}-</label>
                    <select id="proteins" name="proteins" onChange={this.handleProteinChange}>
                        <option value="d3ea25f9-34f6-4bba-afa6-cf16a9ca53bc">Salmon</option>
                        <option value="30a1daa9-7d0a-4fdc-9ba0-0f5da1885387">Tuna</option>
                        <option value="6db3d8c7-01bf-4370-8a81-1b68f86123c9">Braised Pork</option>
                        <option value="cf73d6ba-3738-401d-a077-60b41aa11e12">Tofu</option>
                    </select>
                </div>

                <fieldset>
                    <legend className="label">Select Dressing -{this.state.dressings.join(', ').trim()}-</legend>
                    <label>
                        <input type="checkbox" name="dressings" value="71326741-fea5-4cb1-b65e-4c3594efd65b" onChange={this.handleDressingChange}/>
                            Teriyaki
                    </label>

                    <label>
                        <input type="checkbox" name="dressings" value="6356e9e8-81a8-48dd-9a98-9a37fdd05893" onChange={this.handleDressingChange}/>
                            Sriracha
                    </label>

                    <label>
                        <input type="checkbox" name="dressings" value="2d22181d-ed96-4eb9-ab32-f5b7609f16fe" onChange={this.handleDressingChange}/>
                            Brown Sauce
                    </label>

                    <label>
                        <input type="checkbox" name="dressings" value="1ab2dfdc-680e-4cd7-9b90-eb71dbcc2092" onChange={this.handleDressingChange}/>
                            Horseradish
                    </label>

                    <label>
                        <input type="checkbox" name="dressings" value="ad60261d-32ea-4a14-b558-e0bd3d874649" onChange={this.handleDressingChange}/>
                            Hoisin
                    </label>

                    <label>
                        <input type="checkbox" name="dressings" value="48ccef28-1ac2-42fd-91e9-02c801b14d7e" onChange={this.handleDressingChange}/>
                            Soy Sauce
                    </label>

                    <label>
                        <input type="checkbox" name="dressings" value="a01f24d4-df6a-4ec1-8d40-181add2631f2" onChange={this.handleDressingChange}/>
                            Furikake
                    </label>
                </fieldset>
                <input type="submit" value="Create order" />
            </form>
        )
    }
}

export default OrderForm;