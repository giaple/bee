import React from 'react'
import { Button as MuiButton } from '@mui/material';

export interface ButtonProps {
label: string;
color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
size?: 'small' | 'medium' | 'large';
disabled?: boolean;
disableFocusRipple?: boolean;
disableRipple?: boolean;
startIcon?: React.ReactNode;
endIcon?: React.ReactNode;
variant?: 'text' | 'outlined' | 'contained';
onClick?: React.MouseEventHandler<HTMLButtonElement>;
classes?: string;
children?:  React.ReactNode,
fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = (props) => {
  return <div className={props.classes}>
    <MuiButton 
    fullWidth={props.fullWidth}
    color={props.color} 
    disabled={props.disabled} 
    disableRipple={props.disableRipple} 
    disableFocusRipple={props.disableFocusRipple}
    size={props.size}
    variant={props.variant}
    onClick={props.onClick}
    startIcon={props.startIcon}
    endIcon={props.endIcon}
    > {props.label} {props.children}</MuiButton>
  </div>
};

export default Button;