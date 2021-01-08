import React, {Component} from 'react'
import {Table, Button, Popup} from 'semantic-ui-react'
import HPIcontext from 'contexts/HPIContext.js'


class ExpandMurmurs extends Component{
    static contextType=HPIcontext

    constructor(props, context){
        super(props,context)
        this.state ={ 
            pe_rows0:[["aortic stenosis", "best heard RUSB", "radiation to carotids"], 
            ["pulmonary stenosis", "best heard LUSB ", "radiation to left clavicle"],
            ["atrial septal defect", "best heard LUSB"],
            ["HOCM", "best heard LLSB", "incr w Valsalva"]],
            pe_rows1: [["mitral regurg", "best heard apex", "radiation to precordium"], 
            ["tricuspid regurg", "best heard LLSB ", "radiation to LUSB"],
            ["ventricular septal defect", "best heard LLSB", "palpable thrill"]],
            pe_rows2: [["mitral prolapse", "systolic click", "incr with Valsava"], ["physiologic"]],
            pe_rows3:[["aortic regurg", "early", "best heard LLSB", "best heard RLSB"], 
            ["mitral stenosis", "mid", "best heard apex", "opening snap"],
            ["tricuspid stenosis", "best heard LLSB"],
            ["pulmonary regurg", "best heard LLSB"]]
        }
        this.onButtonClick = this.onButtonClick.bind(this)
        this.addButton = this.addButton.bind(this)
        this.removeButton = this.removeButton.bind(this)

    }


    // figure out a way to push the info to an object associated with the widget being expanded
    addButton(){
        var values = this.context["Physical Exam"]
        values.widgets[this.props.type].push({"cresdecres": [], "pansystolic": [], "other": [], "decres": []})
        this.context.onContextChange("Physical Exam", values)
        console.log(values.widgets[this.props.type])
    }
    // also here need to make sure its only removing the expanded for the specific widget and not all of them
    removeButton(event, data){
        var values =this.context["Physical Exam"]
        values.widgets[this.props.type].splice(data.pe_index,1)
        this.context.onContextChange("Physical Exam", values)
    }
    // figure out a way to associate this information with the selected widget (access that widget in murmurs from context and update or add the information accordingly)
    onButtonClick(event, data){
        var values = this.context['Physical Exam']
        
        if(this.context['Physical Exam'].widgets["Murmurs"][this.props.ind]["systdiast"] === "systolic"){
            if (this.state.pe_rows0[0].some(x => (x==data.condition))){
                values.widgets[this.props.type][data.pe_index]["cresdecres"].push(data.condition)
    
            }
    
            else if (this.state.pe_rows0[1].some(x => (x==data.condition))){
                values.widgets[this.props.type][data.pe_index]["cresdecres"].push(data.condition)
    
            }
            else if (this.state.pe_rows0[2].some(x => (x==data.condition))){
                values.widgets[this.props.type][data.pe_index]["cresdecres"].push(data.condition)
    
            }
            else if (this.state.pe_rows0[3].some(x => (x==data.condition))){
                values.widgets[this.props.type][data.pe_index]["cresdecres"].push(data.condition)
    
            }
    
            else if (this.state.pe_rows1[0].some(x => (x==data.condition))){
                values.widgets[this.props.type][data.pe_index]["pansystolic"].push(data.condition)
    
            }
    
            else if (this.state.pe_rows1[1].some(x => (x==data.condition))){
                values.widgets[this.props.type][data.pe_index]["pansystolic"].push(data.condition)
    
            }
            else if (this.state.pe_rows1[2].some(x => (x==data.condition))){
                values.widgets[this.props.type][data.pe_index]["pansystolic"].push(data.condition)
    
            }
    
            else if (this.state.pe_rows2[0].some(x => (x==data.condition))){
                values.widgets[this.props.type][data.pe_index]["other"].push(data.condition)
    
            }
            else if (this.state.pe_rows2[1].some(x => (x==data.condition))){
                values.widgets[this.props.type][data.pe_index]["other"].push(data.condition)
    
            }

        }
        
        else if(this.context['Physical Exam'].widgets["Murmurs"][this.props.ind]["systdiast"] === "diastolic"){
            if (this.state.pe_rows3[0].some(x => (x==data.condition))){
                values.widgets[this.props.type][data.pe_index]["decres"].push(data.condition)
    
            }
    
            else if (this.state.pe_rows3[1].some(x => (x==data.condition))){
                values.widgets[this.props.type][data.pe_index]["decres"].push(data.condition)
    
            }
            else if (this.state.pe_rows3[2].some(x => (x==data.condition))){
                values.widgets[this.props.type][data.pe_index]["decres"].push(data.condition)
    
            }
            else if (this.state.pe_rows3[3].some(x => (x==data.condition))){
                values.widgets[this.props.type][data.pe_index]["decres"].push(data.condition)
    
            }

        }
        


        
        this.context.onContextChange("Physical Exam", values)

    }

    makeChange(word,pe_index){
        var values = this.context['Physical Exam']
        if (this.state.pe_rows0[0].some(x => (x==word))){
            values.widgets[this.props.type][pe_index]["cresdecres"].push(word)
        }
        if (this.state.pe_rows0[1].some(x => (x==word))){
            values.widgets[this.props.type][pe_index]["cresdecres"].push(word)
        }
        if (this.state.pe_rows0[2].some(x => (x==word))){
            values.widgets[this.props.type][pe_index]["cresdecres"].push(word)
        }
        if (this.state.pe_rows1[1].some(x => (x==word))){
            values.widgets[this.props.type][pe_index]["pansystolic"].push(word)
        }
        if (this.state.pe_rows1[2].some(x => (x==word))){
            values.widgets[this.props.type][pe_index]["pansystolic"].push(word)
        }
        if (this.state.pe_rows3[0].some(x => (x==word))){
            values.widgets[this.props.type][pe_index]["decres"].push(word)
        }
        if (this.state.pe_rows3[2].some(x => (x==word))){
            values.widgets[this.props.type][pe_index]["decres"].push(word)
        }
        if (this.state.pe_rows3[3].some(x => (x==word))){
            values.widgets[this.props.type][pe_index]["decres"].push(word)
        }

        this.context.onContextChange("Physical Exam", values)

    }

    
    addMurmurG(pe_index, pe_rows,name){
        var pe_show = []
        var heardbest = this.context['Physical Exam'].widgets["Murmurs"][this.props.ind]["heardbest"]
        var dict = {"RUSB": "best heard RUSB", "LUSB": "best heard LUSB", "LLSB": "best heard LLSB", "RLSB": "best heard RLSB"}
        var newword = dict[heardbest]

        for(var index =0; index<pe_rows.length; index ++){
            pe_show.push(
                <div style={{marginTop: 10, marginBottom: 10, marginLeft: 10, marginRight: 10}}>
                    {pe_rows[index].map((word)=>
                        <Button 
                        color={(this.context['Physical Exam'].widgets[this.props.type][pe_index][name].some(x => (x ==word))? 'red' : '')}
                        key={word}
                        pe_index={pe_index}
                        index={index}
                        condition={word}
                        //other = {word === newword? this.makeChange(word,pe_index): null}
                        onClick={this.onButtonClick}
                        //active={word === newword? true: false}
                    
                        > 
                        {word}</Button>
                    )}
                </div>
            )
        }
        return pe_show
    }



    render = () => {
        

        if(this.context['Physical Exam'].widgets["Murmurs"][this.props.ind]["systdiast"] === "systolic"){
            var values = this.context['Physical Exam'].widgets[this.props.type]
            var arr=[]
            for(var pe_index=0; pe_index<values.length; pe_index++){
                var block0= this.addMurmurG(pe_index, this.state.pe_rows0, "cresdecres")
                var block1=this.addMurmurG(pe_index, this.state.pe_rows1, "pansystolic")
                var block2=this.addMurmurG(pe_index, this.state.pe_rows2, "other")
                if (values.length>0) arr.push(

                    <Table collapsing>
                        <Table.Header>
                            <div sle={{float:"right"}}>
                                <Button basic circular icon='x' size='mini' pe_index={pe_index} onClick={this.removeButton} />
                            </div>
                        </Table.Header>
                        <div >Systolic</div>
                        <div style= {{marginLeft: 30}}>cresc-decresc </div> 
                        <div style= {{marginLeft: 35}}>{block0} </div> 
                        <div style= {{marginLeft: 30}}>pansystolic </div> 
                        <div style= {{marginLeft: 35}}>{block1} </div>
                        <div style= {{marginLeft: 15}}>{block2} </div>
                        
                    </Table>

            )
            }
        }

        else if(this.context['Physical Exam'].widgets["Murmurs"][this.props.ind]["systdiast"] === "diastolic"){
            var values = this.context['Physical Exam'].widgets[this.props.type]
             var arr=[]
            for(var pe_index=0; pe_index<values.length; pe_index++){
                var block3= this.addMurmurG(pe_index, this.state.pe_rows3, "decres")
                if (values.length>0) arr.push(

                    <Table collapsing>
                        <Table.Header>
                            <div sle={{float:"right"}}>
                                <Button basic circular icon='x' size='mini' pe_index={pe_index} onClick={this.removeButton} />
                            </div>
                        </Table.Header>
                        <div >Diastolic</div>
                        <div style= {{marginLeft: 30}}>decrescendo </div> 
                        <div style= {{marginLeft: 35}}>{block3} </div> 
                        
                    </Table>

            )
            }
        }        

        return(

            <div style={{marginTop: 20}} > 
            {arr}
            Expand specific murmurs <Popup content="Please select systolic or diastolic before expanding" trigger={<Button basic circular icon="plus" size='mini' onClick={this.addButton}/>} />
            </div>

        )


    }

}

export default ExpandMurmurs