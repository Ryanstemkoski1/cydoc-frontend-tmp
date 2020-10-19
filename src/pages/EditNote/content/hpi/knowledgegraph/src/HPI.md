# HPIContent
Function: Load Cydoc knowledge graph and create the entire HPI form with questions and buttons based on the graph and other components listed in the outline.
1. componentDidMount()
    * Load up the [knowledge graph](https://cydocgraph.herokuapp.com/graph)
    * Loop through the knowledge graph nodes to get each unique body system and category.
    * Set state with graphData (knowledge graph), categories and body systems
2. handleItemClick() - responds to the disease tabs shown after page 1 (landing page)
    * The clicked tab’s disease category name will be indexed from context and will correspond to its step, which will change the user’s page to that of the current disease.
    * In addition, the active tab will change to be the current disease category, and will be pressed down.
3. render() - each time something changes in the page (i.e. user clicks button), the following items are re-rendered.
    * const diseaseComponents: creates list of body system buttons (<ButtonItem/>)
        * Loops through the state variable body_systems saved after the API was loaded after componentDidMount
        * item[‘name’] - name of the body system
        * item[‘diseases’] - list of categories/diseases associated with the current body system
    * const positiveDiseases: creates list of category buttons that were clicked by user (different color, posted at the top) [<PositiveDiseases/>]
        * Loops through the HPI context storing which categories user clicked in the front page 
    * const diseaseTabs: creates the tabs with the user’s clicked or chosen categories, which is displayed on the top of the questionnaire for easy access to different diseases 
        * Loops through the HPI context storing which categories user clicked in the front page 
        * this.context[‘activeHPI’] - current category page (that user is on) → if the current category in the for loop matches the active category, the menu item is marked as active, meaning that it will be displayed as clicked (pressed down) 
        * this.handleItemClick - see handleItemClick
        * className: CSS
    * switch(step) - depending on the current step, we switch to a different view/page of the form
        * Case 1 is the first page, which is the landing view of HPI with the body systems and disease category buttons
        * Default is any other page of the form, which is personalized with questions and answer inputs based on the current step number (corresponding to specific disease category) - based on <DiseaseForm/>

## ButtonItem 
Function: Creates the buttons of body systems and disease categories found in the first landing page of HPI. Parent of <DiseaseTag/>

### DiseaseTag
Function: Creates the buttons (shaped like tags) for each disease category found in the first landing page of HPI. Called by <ButtonItem/>

## PositiveDiseases
Function: Display just the buttons of positive diseases (same format as those in DiseaseTag) but at the top so that they are easily seen by the user.

## DiseaseForm 
Function: Render the page of the HPI form for each disease.

1. function() 
    * Constants: 
        * const category is the current disease category in human readable format 
        * const parent_code is the category code as seen in the knowledge graph (with the end digits 0001)
        * const graphData is the knowledge graph 
        * const tab_category is the current disease category as found in the knowledge graph 
        * parent_values holds the edges, associated to the parent_code, that lead to specific child questions 
    * var questionMap = {} - holds the question components for each question as a value in questionMap, stored under the question’s unique ID as the key 
    * First for loop - loop through all child nodes of parent node, and the children of the child nodes
        * Store each question as a <DiseaseFormQuestions/> component in questionMap, under the question’s unique ID 
        * Store each question’s info in the HPI Context 
        * Check if the current node in the graph has children that we need to look for and output the child questions 

### DiseaseFormQuestions
Function: Identifies the response types to render the interactive elements for the questions of the HPI form using the <QuestionAnswer/> child component. 

#### QuestionAnswer 
Function: Creates custom interactive input feature based on the response type.

Includes: 
* YesNo 
* HandleInput 
* TimeInput 
* ListText 
* ButtonTag 
* HandleNumericInput 
* FamilyHistoryContent 
* MedicalHistoryContent 
* MedicationsContent 
* SurgicalHistoryContent

### accordian 

# Knowledge Graph 
The [knowledge graph](https://cydocgraph.herokuapp.com/graph) is a JSON that guides the HPI form. It is divided into the graph, nodes and edges.

## Graph
* Displays all nodes (as keys) and the values are lists
* Some of the nodes’ values are empty lists, while other nodes (including all those ending in 0001) have items in their list, which are specified edges leading to children questions. 

## Nodes 
* Each node is a unique question 
* Nodes are coded based on their disease category (i.e. BPR = Blood PRessure) and a number that isn’t correlated to the actual order. This is their Med ID 
* Each node also has a unique ID, category, text, response type, question order, and body system

## Edges 
* Each edge is a number in string format, while the values are 
    * “from”: child node 
    * “to”: parent node 

# Definitions 
* Body system: the first buttons you see on the HPI page, i.e. 
* Category: diseases/medical conditions that fit into the body system categories
