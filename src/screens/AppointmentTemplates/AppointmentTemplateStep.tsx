import style from './AppointmentTemplates.module.scss';

import { Icon } from '@components/Icon';
import { Box, IconButton, Typography } from '@mui/material';
import {
    AppointmentValueType,
    WhoCompletes,
} from '@constants/appointmentTemplatesConstants';
import SelectPlaceholder from '@components/SelectPlaceholder/SelectPlaceholder';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import AutocompletePlaceholder from '@components/SelectPlaceholder/AutocompletePlaceholder';
import { DiseaseForm } from '@cydoc-ai/types/dist/disease';

interface AppointmentTempStepProps {
    idx: number;
    stepCount: number;
    allDiseaseForms: DiseaseForm[];
    stepTaskType: (idx: number) => string;
    selectedApptValue: AppointmentValueType[];
    handleRemoveSteps: (idx: number) => void;
    handleApptValues: (
        idx: number,
        newValue: string,
        type: 'whoCompletes' | 'form'
    ) => void;
}

const AppointmentTempStep = ({
    idx,
    stepCount,
    stepTaskType,
    allDiseaseForms,
    handleApptValues,
    selectedApptValue,
    handleRemoveSteps,
}: AppointmentTempStepProps) => (
    <Box className={style.createNewModalWrapper__body__stepWrapper}>
        <Box
            className={style.createNewModalWrapper__body__stepWrapper__stepBox}
        >
            <IconButton>
                <DragIndicatorRoundedIcon />
            </IconButton>
            <Box>
                <Typography
                    component='label'
                    htmlFor={`demo-simple-select-label-${idx}`}
                >
                    Who completes the task?
                </Typography>
                <SelectPlaceholder
                    idx={idx}
                    type='whoCompletes'
                    placeholder='Select'
                    items={Object.values(WhoCompletes)}
                    handleChange={handleApptValues}
                    value={selectedApptValue[idx]?.whoCompletes || ''}
                />
                {selectedApptValue[idx]?.whoCompletes && (
                    <>
                        <Typography
                            component='label'
                            htmlFor={`task-type-select-label-${idx}`}
                        >
                            <span>Task type:</span>
                            <span
                                style={{
                                    marginLeft: '10px',
                                    fontWeight: '400',
                                }}
                            >
                                {stepTaskType(idx)}
                            </span>
                        </Typography>
                        {selectedApptValue[idx].whoCompletes !==
                            WhoCompletes.Cydoc_ai && (
                            <AutocompletePlaceholder
                                idx={idx}
                                type='form'
                                placeholder='Select specific form'
                                handleChange={handleApptValues}
                                value={selectedApptValue[idx].form || ''}
                                options={allDiseaseForms.map(
                                    (item) => item.diseaseName
                                )}
                            />
                        )}
                    </>
                )}
            </Box>
        </Box>
        {stepCount > 1 && (
            <IconButton onClick={() => handleRemoveSteps(idx)}>
                <Icon type='trashCan' />
            </IconButton>
        )}
    </Box>
);

export default AppointmentTempStep;
