import Modal from '@mui/material/Modal';
import Box from "@mui/material/Box";
import SubscribesTag from "@/components/subscribes/tag";

type SubscribesPopupType = {
    show: boolean
    tags: string[]
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

export default function SubscribesPopup({show, tags, handleClose}: SubscribesPopupType) {
    return (
        <Modal
            open={show}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {tags.map((tag) => {
                    return <SubscribesTag key={tag} tag={tag} />
                })}
            </Box>
        </Modal>
    );
}
