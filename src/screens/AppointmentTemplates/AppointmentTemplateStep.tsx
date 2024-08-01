import style from './AppointmentTemplates.module.scss';

import { Icon } from '@components/Icon';
import { Box, IconButton, SelectChangeEvent, Typography } from '@mui/material';
import {
    AppointmentValueType,
    FormType,
    WhoCompletes,
} from '@constants/appointmentTemplatesConstants';
import SelectPlaceholder from '@components/SelectPlaceholder/SelectPlaceholder';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';

interface AppointmentTempStepProps {
    idx: number;
    stepCount: number;
    stepTaskType: (idx: number) => string;
    selectedApptValue: AppointmentValueType[];
    handleRemoveSteps: (idx: number) => void;
    handleApptValues: (
        event: SelectChangeEvent<string>,
        idx: number,
        type: 'whoCompletes' | 'form'
    ) => void;
}

const AppointmentTempStep = ({
    idx,
    stepCount,
    stepTaskType,
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
                            <SelectPlaceholder
                                idx={idx}
                                type='form'
                                placeholder='Select specific form'
                                items={Object.values(FormType)}
                                handleChange={handleApptValues}
                                value={selectedApptValue[idx].form || ''}
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
