import React, { useState, useEffect, useContext } from 'react';
import TemplateTitlePage from './TemplateTitlePage';
import HPITemplateContext from '../../contexts/HPITemplateContext';
import { getAnswerInfo, parseQuestionText, parsePlaceholder } from './util';
import { Dropdown } from 'semantic-ui-react';
import { graphClient } from 'constants/api';
import { Link } from 'react-router-dom';

// Component for first step of editing existing HPI template
const EditGraph = () => {
    let [errorMessage, setErrorMessage] = useState('');
    let [isFetching, setIsFetching] = useState(false);
    let [isDisabled, setIsDisabled] = useState(false);
    const { doctorID, createdTemplates, updateTemplate, setCreatedTemplates } =
        useContext(HPITemplateContext);

    useEffect(() => {
        const fetchTemplates = async () => {
            setIsFetching(true);
            let templates = {};
            try {
                const res = await graphClient.get(`/doctor/${doctorID}`);
                templates = res.data;
            } catch (err) {
                let message = '* Unable to load existing templates';
                if (err.response?.status === 404) {
                    message = '* Only doctors have access to this feature';
                }
                setErrorMessage(message);
                setIsDisabled(true);
            } finally {
                setCreatedTemplates(templates);
                setIsFetching(false);
            }
        };
        fetchTemplates();
    }, [doctorID, setCreatedTemplates]);

    const inputComponent = (props) => {
        const options = Object.keys(createdTemplates).map((graphID) => ({
            key: graphID,
            value: graphID,
            text: createdTemplates[graphID].graphName,
        }));
        return (
            <Dropdown
                {...props}
                search
                selection
                clearable
                loading={isFetching}
                options={options}
                disabled={isDisabled}
                className='input-title'
                aria-label='template-title'
                noResultsMessage='No templates found.'
            />
        );
    };

    // Load selected template's data into context
    const onSubmit = (graphID) => {
        const graphData = createdTemplates[graphID];
        const {
            root,
            graph,
            edges,
            nodes: originalNodes,
            graphName: title,
        } = graphData;

        const bodySystem = originalNodes[root].bodySystem;
        const disease = originalNodes[root].category;

        // Format nodes according to template form recursively
        const nodes = {};
        const processNodes = (rootID, parent = null) => {
            let node = { ...originalNodes[rootID] };
            let text = node.text;
            const { responseType, category } = node;
            const answerInfo = getAnswerInfo(responseType);

            text = parseQuestionText(responseType, text, answerInfo, category);
            text = parsePlaceholder(text, category);

            node = {
                ...node,
                parent,
                text,
                answerInfo,
                id: rootID,
                hasChanged: true,
            };
            nodes[rootID] = node;
            delete node.medID;

            graph[rootID].forEach((edge) =>
                processNodes(edges[edge].to, rootID)
            );
        };
        processNodes(root);
        updateTemplate({
            root,
            graph,
            nodes,
            edges,
            title,
            bodySystem,
            disease,
            graphID,
            numQuestions: Object.keys(originalNodes).length,
            nextEdgeID: Object.keys(edges).length + 1,
        });
    };

    const redirectElement = (
        <span className='template-redirect'>
            Can’t find a template?{' '}
            <Link to='/templates/new'>Create a new one here.</Link>
        </span>
    );

    return (
        <TemplateTitlePage
            header='Existing History of Present Illness Template'
            label='Select the name of a template to edit.'
            inputComponent={inputComponent}
            onSubmit={onSubmit}
            errorMessage={errorMessage}
            redirectElement={redirectElement}
        />
    );
};

export default EditGraph;
