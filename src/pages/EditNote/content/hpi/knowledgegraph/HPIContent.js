import React, { Component } from 'react';
import { Menu, Button, Segment, Icon } from 'semantic-ui-react'
import Masonry from 'react-masonry-css';
import './src/css/App.css';
import ButtonItem from "./src/components/ButtonItem.js";
import disease_abbrevs from "./src/components/data/disease_abbrevs"
import PositiveDiseases from "./src/components/PositiveDiseases";
import DiseaseForm from "./src/components/DiseaseForm";
import API from "./src/API";
import HPIContext from 'contexts/HPIContext.js';
import './HPI.css';
import {ROS_LARGE_BP, ROS_MED_BP, ROS_SMALL_BP} from 'constants/breakpoints';
import diseaseCodes from '../../../../../constants/diseaseCodes'

class HPIContent extends Component {
    static contextType = HPIContext
    constructor(context) {
        super(context)
        this.state = {
            windowWidth: 0,
            windowHeight: 0,
            bodySystems: [],
            graphData: {},
            isLoaded: false,
            children: [],
            activeTabName: "",
            categoryCodes: {}
        }
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    componentDidMount() {
        // Loads Cydoc knowledge graph to populate HPI, 
        // organizes parent nodes by their category code (medical condition) and body system
        const data = API;
        data.then(res => {
            var categoryCodes = new Set() // List of category codes (medical conditions) from nodes
            var bodySystems = {} // Dict of body system : list of category codes (medical conditions)
            var nodes = res.data['nodes'] 
            for (var node in nodes) {
                var code = node.substring(0, 3)
                // get set of all categories 
                if (!(categoryCodes.has(code))) {
                    categoryCodes.add(code)
                    var body_system = nodes[node]["bodySystem"];
                    // Use disease abbreviations found in disease_abbrevs.js
                    if (!(body_system in bodySystems)) bodySystems[body_system] = {"diseases": [], "name": disease_abbrevs[body_system]}
                    bodySystems[body_system]["diseases"].push(code)
                }}
            delete bodySystems["GENERAL"]; // not using GENERAL 
            this.setState({isLoaded: true, graphData: res.data, categoryCodes: categoryCodes, bodySystems: Object.values(bodySystems)})
        })
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
        // Using timeout to ensure that tab/dropdown menu is rendered before setting 
        // setTimeout((_event) => {
        //     this.setMenuPosition();
        // }, 0);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        let windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        let windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;

        this.setState({ windowWidth, windowHeight });
        // this.setMenuPosition();
    }

    setMenuPosition() {
        const stickyHeaderHeight = document.getElementById("stickyHeader").offsetHeight;
         // Ensuring that the hpi tabs are rendered
         while (this.fixedMenu == null || this.fixedMenu.length == 0) {
             this.fixedMenu = document.getElementsByClassName("disease-menu");
         }
         this.fixedMenu[0].style.top = `${stickyHeaderHeight}px`;
     }

    // Proceed to next step
    nextStep = () => {
        var current_step = this.context["step"]
        this.context.onContextChange("step", current_step + 1)
        this.context.onContextChange("activeHPI", this.context['positivediseases'][current_step-1])
    }

    // Go back to previous step
    prevStep = () => {
        var current_step = this.context["step"]
        this.context.onContextChange("step", current_step-1)
        this.context.onContextChange("activeHPI", this.context['positivediseases'][current_step-3])
    }

    // get to first page (change step = 1)
    firstPage = () => this.context.onContextChange("step", 1)

    // skip to last page (last category) [change step to be last]
    lastPage = () => {
        var current_step = this.context['positivediseases'].length
        this.context.onContextChange("step", current_step+1)
        this.context.onContextChange("activeHPI", this.context['positivediseases'][current_step-1])
    }

    // go to the next page (change step = step + 1)
    continue = e => {
        e.preventDefault();
        this.nextStep();
        window.scrollTo(0,0);
    }

    // go to previous page (change step = step - 1)
    back = e => {
        e.preventDefault();
        this.prevStep();
        window.scrollTo(0,0);
    }

    // responds to tabs - the clicked tab's name will be indexed from the list of positive diseases and 
    // corresponds to its step - 2. The page will then change to the clicked tab's corresponding disease
    // category and the active tab will change to that as well.
    handleItemClick = (e, {name}) => { 
        this.context.onContextChange("step", this.context['positivediseases'].indexOf(diseaseCodes[name])+2) 
        this.context.onContextChange("activeHPI", name)
    }

    nextFormClick = () => this.props.nextFormClick();

    render() {
        const {graphData, isLoaded, windowWidth, bodySystems} = this.state;

        // If you wrap the positiveDiseases in a div you can get them to appear next to the diseaseComponents on the side
        /* Creates list of body system buttons to add in the front page. 
           Loops through state variable, bodySystems, saved from the API */
        const diseaseComponents = bodySystems.map(item =>
            <ButtonItem
                key={item['name']}                  // name of body system
                name={item['name']}                 
                diseases_list={item['diseases']}    // list of categories (diseases) associated with current body system
            />
        );

        // diseases that the user has chosen
        // Creates list of category buttons clicked by the user (categories/diseases for which they are positive) 
        // Loops through the HPI context storing which categories user clicked in the front page 
        // (categories/diseases for which they are positive)
        const positiveDiseases = this.context["positivediseases"].map(disease =>    
            <PositiveDiseases
                key={disease}
                name={Object.keys(diseaseCodes).find(key => diseaseCodes[key] === disease)}
            />
        );

        // tabs with the diseases the user has chosen
        // Loops through HPI context storing which categories user clicked in front page
        const diseaseTabs = this.context['positivediseases'].map((name, index) => 
            <Menu.Item
                key={index}
                name={Object.keys(diseaseCodes).find(key => diseaseCodes[key] === name)}
                /* if the current category in the for loop matches the active category (this.context['activeHPI']), 
                the menu item is marked as active, meaning it will be displayed as clicked (pressed down) */
                active={this.context['activeHPI'] === Object.keys(diseaseCodes).find(key => diseaseCodes[key] === name)}  
                onClick={this.handleItemClick}
                className='disease-tab'  // CSS 
            />
        ); 
        
        // each step correlates to a different tab
        var step = this.context['step'];
        // number of positive diseases, which is also the nnumber of steps   
        const positive_length = this.context['positivediseases'].length;

        // window/screen responsiveness
        let numColumns = 1;
        if (windowWidth > ROS_LARGE_BP) {
            numColumns = 4;
        } else if (windowWidth > ROS_MED_BP) {
            numColumns = 3;
        } else if (windowWidth > ROS_SMALL_BP) {
            numColumns = 2;
        }

        // depending on the current step, we switch to a different view 
        switch(step) {
            case 1:
                return (
                    // if the user has chosen any diseases (positive_length > 0), then the right button can be displayed
                    // to advance to other pages of the HPI form
                    <>
                    <Segment>
                        {positive_length > 0 ? positiveDiseases : <div className='positive-diseases-placeholder' />}
                        <Masonry
                            className='disease-container'
                            breakpointCols={numColumns}
                            columnClassName='disease-column'
                        >
                            {diseaseComponents}
                        </Masonry>      
                    </Segment>

                    {positive_length > 0 ? 
                    <>
                    <Button icon floated='right' onClick={this.continue} className='hpi-small-next-button'>
                    <Icon name='right arrow'/>
                    </Button> 
                    <Button icon labelPosition='right' floated='right' onClick={this.continue} className='hpi-next-button'>
                    Next Form
                    <Icon name='right arrow'/>
                    </Button>
                    </>
                    :
                    <>
                    <Button icon floated='right' onClick={this.nextFormClick} className='hpi-small-next-button'>
                    <Icon name='right arrow'/>
                    </Button>
                    <Button icon labelPosition='right' floated='right' onClick={this.nextFormClick} className='hpi-next-button'>
                    Next Form
                    <Icon name='right arrow'/>
                    </Button>
                    </>
                    }
                </>
                    )
            default:
                // if API data is loaded, render the DiseaseForm
                if (isLoaded) { 
                    let category_code = this.context['positivediseases'][step-2]
                    let parent_node = category_code + "0001"
                    return (
                        <div className='hpi-disease-container'>
                        <DiseaseForm
                            key={parent_node}
                            parent_node = {parent_node}
                            graphData={graphData}
                            nextStep = {this.nextStep}
                            prevStep = {this.prevStep}
                            firstPage = {this.firstPage}
                            lastPage = {this.lastPage}
                            diseaseTabs = {diseaseTabs}
                            last = {true ? step === positive_length+1 : false}
                            windowWidth={windowWidth}
                        />
                        {step === positive_length+1 ?
                            <>
                            <Button icon floated='left' onClick={this.back} className='hpi-small-previous-button'>
                            <Icon name='left arrow'/>
                            </Button>
                            <Button icon labelPosition='left' floated='left' onClick={this.back} className='hpi-previous-button'>
                            Previous Form
                            <Icon name='left arrow'/>
                            </Button>
        
                            <Button icon floated='right' onClick={this.nextFormClick} className='hpi-small-next-button'>
                            <Icon name='right arrow'/>
                            </Button>
                            <Button icon labelPosition='right' floated='right' onClick={this.nextFormClick} className='hpi-next-button'>
                            Next Form
                            <Icon name='right arrow'/>
                            </Button>
                            </>
                            :
                            <>
                            <Button icon floated='left' onClick={this.back} className='hpi-small-previous-button'>
                            <Icon name='left arrow'/>
                            </Button>
                            <Button icon labelPosition='left' floated='left' onClick={this.back} className='hpi-previous-button'>
                            Previous Form
                            <Icon name='left arrow'/>
                            </Button>
        
                            <Button icon floated='right' onClick={this.continue} className='hpi-small-next-button'>
                            <Icon name='right arrow'/>
                            </Button>
                            <Button icon labelPosition='right' floated='right' onClick={this.continue} className='hpi-next-button'>
                            Next Form
                            <Icon name='right arrow'/>
                            </Button>
                            </>
                            }
                            </div>
                            )}
                // if API data is not yet loaded, show loading screen 
                else {return <h1> Loading... </h1>}
        }
    }
}

export default HPIContent;
