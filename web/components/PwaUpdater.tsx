// import {useEffect, useState} from "react";
// import {Button, Modal} from "@mui/material";
// import Box from "@mui/material/Box";
//
// declare global {
//     interface Window {
//         wb: {
//             messageSkipWaiting(): void;
//             register(): void;
//             addEventListener(name: string, callback: () => unknown);
//         }
//     }
// }
//
// const PwaUpdater = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const onConfirmActivate = () => wb.messageSkipWaiting();
//
//     useEffect(() => {
//         wb.addEventListener('controlling', () => {
//             window.location.reload();
//         });
//
//         wb.addEventListener('waiting', () => setIsOpen(true));
//         wb.register();
//     }, []);
//
//     return (
//         <Modal
//             open={isOpen}
//         >
//             <Box>
//                 <div>
//                     Hey, a new version is available! Please click below to update.
//                 </div>
//
//                 <Button onClick={onConfirmActivate}>Reload and update</Button>
//                 <Button onClick={() => setIsOpen(false)}>Cancel</Button>
//             </Box>
//         </Modal>
//     );
// }
//
// export default PwaUpdater;