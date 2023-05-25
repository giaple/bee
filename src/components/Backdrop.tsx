import * as React from 'react';
import BackdropMUI from '@mui/material/Backdrop';
import Button from './Button';
import OutsideClick from './OutsideClickComponent';


interface BackdropProps {
    children?: React.ReactNode;
    btnLabel?: string;
    show: boolean;
    update: string;
}

export default function Backdrop(props: BackdropProps) {
  const [open, setOpen] = React.useState(props.show);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    setOpen(props.show)
  },[props.show, props.update])

  return (
    <div>
      {props.btnLabel ? <Button onClick={handleOpen} label={props.btnLabel}/> : null}
      <BackdropMUI
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, width: '100%', height: '100%' }}
        open={open}
        // onClick={handleClose}
      >
        {/* <OutsideClick action={handleClose}> */}
        {props.children}
            
        {/* </OutsideClick> */}
        
      </BackdropMUI>
    </div>
  );
}
