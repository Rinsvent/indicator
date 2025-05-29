import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Box from "@mui/material/Box";
import {Indicator} from "@/db/models";
import IndicatorTag from "@/components/indicator/tag";
import useSubscribeTags from "@/modules/indicator/useSubscribes";

type IndicatorPopupType = {
    indicator: Indicator
    show: boolean
    handleClose: () => void
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function IndicatorPopup({show, handleClose, indicator}: IndicatorPopupType) {
    const {data} = useSubscribeTags()

    console.log(indicator.revisionAt, typeof indicator.revisionAt)
    return (
        <Modal
            open={show}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                Code: {indicator.code}
                <Divider style={{margin: '5px 0'}}/>
                Level: {indicator.level}
                <Divider style={{margin: '5px 0'}}/>
                Text: {indicator.text}
                <Divider style={{margin: '5px 0'}}/>
                {indicator.tags.map((tag) => {
                    return <IndicatorTag key={tag} tag={tag} isSubscribed={data !== undefined && typeof data[tag] !== 'undefined'}/>
                })}
                <Divider style={{margin: '5px 0'}}/>
                Revision date: {indicator.revisionAt ? indicator.revisionAt : 'No'}
            </Box>
        </Modal>
    );
}
