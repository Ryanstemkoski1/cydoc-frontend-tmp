import React, { Component, Fragment } from 'react';
import { Menu, Button } from 'semantic-ui-react'
import Masonry from 'react-masonry-css';
import './src/css/App.css';
import ButtonItem from "./src/components/ButtonItem.js";
import diseaseData from "./src/components/data/Diseases";
import PositiveDiseases from "./src/components/PositiveDiseases";
import DiseaseForm from "./src/components/DiseaseForm";
import API from "./src/API.js";
import HPIContext from "../../../contexts/HPIContext";
import '../../../../css/content/hpi.css';
import {ROS_LARGE_BP, ROS_MED_BP, ROS_SMALL_BP} from '../../../constants/breakpoints';

class HPIContent extends Component {
    static contextType = HPIContext
    constructor(context) {
        super(context) 
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            diseaseArray: diseaseData,
            graphData: {},
            isLoaded: false, 
            children: [],
            activeItem: "",
            categories: {}
        }
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    componentDidMount() {
        const data = API;
        data.then(res => {
            var categories = Set()
            var category_dict = {}
            var nodes = res.data['nodes'] 
            for (var node in nodes) {categories.add(nodes[node]["category"])}
            for (var category in categories) {
                var key_list = category.split("_")
                var key = ""
                for (var k in key_list) {
                    key = key + k.substring(0,1).toUpperCase() + k.substring(1).toLowerCase()
                }
                category_dict[key] = node.substring(0, node.length-2) + "01"
            }
            category_dict["Shortness of Breath"] = category_dict["Shortbreath"]
            category_dict["Nausea/Vomiting"] = category_dict["Nausea-vomiting"]
            delete category_dict["Shortbreath"]
            delete category_dict["Nausea-vomiting"]
            this.setState({isLoaded: true, graphData: res.data, categories: category_dict})
        }).catch(err => '');
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
 
        this.setState({ windowWidth, windowHeight });
    }

    // Proceed to next step
    nextStep = () => {
        this.context.onContextChange("step", this.context['step'] + 1)
        this.context.onContextChange("activeHPI", this.context['positivediseases'][this.context['step']-1])
    }

    // Go back to previous step
    prevStep = () => {
        this.context.onContextChange("step", this.context['step'] - 1)
        this.context.onContextChange("activeHPI", this.context['positivediseases'][this.context['step']-1])
    }

    continue = e => {
        e.preventDefault();
        this.nextStep();
    }

    back = e => {
        e.preventDefault();
        this.prevStep();
    }

    handleItemClick = (e, {name}) => { 
        this.context.onContextChange("step", this.context['positivediseases'].indexOf(name)+2) 
        this.context.onContextChange("activeHPI", name)
    }
    

    render() {
        const {graphData, isLoaded, categories, windowWidth} = this.state;

        // If you wrap the positiveDiseases in a div you can get them to appear next to the diseaseComponents on the side
        const diseaseComponents = this.state.diseaseArray.map(item =>
            <ButtonItem
                key={item.id}
                disease_id={item.id}
                name={item.name}
                diseases_list={item.diseases}
            />
        );

        const positiveDiseases = this.context["positivediseases"].map(disease =>
            <PositiveDiseases
                key={disease} 
                name={disease}
            />
        );

        const diseaseTabs = this.context['positivediseases'].map((name, index) => 
            <Menu.Item
                key={index}
                name={name}
                active={this.context['activeHPI'] === name}
                onClick={this.handleItemClick}
                className='disease-tab'
            />
        );

        var step = this.context['step'];
        const positive_length = this.context['positivediseases'].length;

        let numColumns = 1;
        if (windowWidth > ROS_LARGE_BP) {
            numColumns = 4;
        } else if (windowWidth > ROS_MED_BP) {
            numColumns = 3;
        } else if (windowWidth > ROS_SMALL_BP) {
            numColumns = 2;
        }

        switch(step) {
            case 1:
                return (
                    <Fragment>
                        {positive_length > 0 ? positiveDiseases : <div className='positive-diseases-placeholder' />}
                        <Masonry
                            className='disease-container'
                            breakpointCols={numColumns}
                            columnClassName='disease-column'
                        >
                            {diseaseComponents}
                        </Masonry>
                        {positive_length > 0 ? 
                        <div className='positive-diseases-placeholder'>
                            <Button
                                circular
                                icon='angle double right'
                                className='next-button'
                                onClick={this.continue}
                            />
                            </div>
                            :
                            <div className='positive-diseases-placeholder' />
                        }
                    </Fragment>
                    )
            default:
                if (isLoaded) { 
                    let category = this.context['positivediseases'][step-2]
                    let parent_code = categories[category]
                    let category_code = graphData['nodes'][parent_code]['category']
                return (
                    <DiseaseForm
                        key={step-2}
                        graphData={graphData}
                        nextStep = {this.nextStep}
                        prevStep = {this.prevStep}
                        category = {category}
                        categories = {this.state.categories}
                        diseaseTabs = {diseaseTabs}
                        parent_code = {parent_code}
                        tab_category = {category_code}
                        last = {true ? step === positive_length+1 : false}
                        windowWidth={windowWidth}
                    />
                    )}
                else {return <h1> Loading... </h1>}
        }
    }
}

export default HPIContent;
