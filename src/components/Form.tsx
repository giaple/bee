import React, { useEffect } from 'react'
import UploadImage from './UploadImage'
import { Divider, TextField, Checkbox, InputLabel, Select, MenuItem, ListItemText, OutlinedInput } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { CategoryModel, FilePresignedUrlModel, ItemModel, OptionModel } from '@/dataStructure/categories';
import Button from './Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

import dayjs from 'dayjs'
import _  from 'lodash'
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export interface TextForm<T> {
    label: string;
    alias: string;
    value: string | string[] | number;
    placeholder?: string;
    type?: string;
    required?: boolean;
    disabled?: boolean;
    helperText?: string;
    error?: boolean;
    multiline?: boolean;
    rows?: number;
    rowsMax?: number;
    fullWidth?: boolean;
    variant?: 'standard' | 'filled' | 'outlined';
    size?: 'small' | 'medium';
    InputProps?: object;
    InputLabelProps?: object;
    FormHelperTextProps?: object;
    className?: string;
    style?: object;
    defaultValue?: string;
    options?: any[],
    totalOptions?: any[],
    multiSelect?: boolean,
    hide?: boolean,
    listRender?: TextForm<T>[][],
    _id?: string,
    parent?: string,
}

interface FormProps<T> {
    isUploadImage?: boolean;
    imgList?: Array<FilePresignedUrlModel>;
    form: Array<TextForm<T>>;
    submitAction?: Function;
    cancelAction?: Function;
    saveBtnLabel?: string;
    cancelBtnLabel?: string;
    isSaveBtnDisabled?: boolean;
    isCancelBtnDisabled?: boolean;
    target?: string;
    handleChange: Function;
}

type TempEvent = {
    target: {
        value: string | string[] | FilePresignedUrlModel[];
    }
}

type Model = CategoryModel | OptionModel | ItemModel

const Form = (props: FormProps<Model>) => {
    const { t } = useTranslation('common')

    const [uploadedImages, setUploadedImages] = React.useState<Array<FilePresignedUrlModel>>([])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent | SelectChangeEvent<string | string[]> | TextForm<Model> | TempEvent, index: number, action?: string, subindex?: number, id?: string) => {

        props.handleChange(e, index, action, subindex, id)
        return
    }

    const handleSave = () => {
        props.submitAction && props.submitAction(uploadedImages)
    }

    const generateFormElement = (item: TextForm<Model>, index: number, subIndex?: number, id?: string) => {

        if (item.hide || item.type === 'image') return null

        if (item.type === 'subForm') {

            return <div style={{ marginTop: '10px' }}>
                <span style={{ color: 'rgb(0,0,0)' }}>{t(item.label)}</span>
                {item.options?.map((j, optionIndex) => <div style={{ border: '1px solid black', padding: '10px' }} key={optionIndex}>
                    {item.disabled ? null : <Button fullWidth={true} label='' onClick={(e) => { handleChange(item, optionIndex, 'delSub', index, item._id || id) }}><DeleteIcon /></Button>}
                    {j?.map((e, i) => generateFormElement(e, i, optionIndex, item._id || id))}
                </div>)}
                {item.disabled ? null : <Button fullWidth={true} label='' onClick={(e) => { handleChange(item, index, 'addSub', subIndex, item._id || id) }}><AddIcon /></Button>}
            </div>
        }

        if (item.type === 'checkbox') {
            return <span style={{ color: 'black', marginTop: '15px' }}><Checkbox onChange={e => handleChange(e as React.ChangeEvent<HTMLInputElement>, index)} /> {t(item.label)}</span>
        }

        if(item.type === 'link'){
            return <Link href={`/${item.defaultValue}/${item.value}`}>
                <TextField
                    required={item.required}
                    id={`${item.label} - ${index}`}
                    label={t(item.label)}
                    defaultValue={item.defaultValue}
                    value={item.value}
                    onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, index, '', subIndex, item._id || id)}
                    placeholder={item.placeholder}
                    type={item.type}
                    disabled={item.disabled}
                    helperText={item.helperText}
                    error={item.error}
                    multiline={item.multiline}
                    rows={item.rows}
                    fullWidth={item.fullWidth}
                    variant={item.variant}
                    size={item.size}
                    InputProps={item.InputProps}
                    InputLabelProps={item.InputLabelProps}
                    FormHelperTextProps={item.FormHelperTextProps}
                    className={item.className}
                    style={{...item.style, marginTop: '15px'}}
      />
            </Link>
        }

        if(item.type === 'dropdown'){

            return <FormControl fullWidth style={{ marginTop: '15px' }}>
                <InputLabel id="demo-simple-select-label">{t(item.label)}</InputLabel>
                <Select
                    multiple={item.multiSelect}
                    disabled={item.disabled}
                    labelId={!item.multiSelect ? "demo-simple-select-label" : 'demo-multiple-checkbox-label'}
                    id={!item.multiSelect ? "demo-simple-select" : "demo-multiple-checkbox"}
                    value={item.value}
                    input={<OutlinedInput label={t(item.label)} />}
                    renderValue={(selected) => { return item.multiSelect ? item.options?.filter(option => selected.includes(option._id)).map(option => t(option.name)).join(', ') : t(item.options?.find(option => option._id === selected)?.name) }}
                    onChange={(e) => handleChange(e, index, '', subIndex, item._id || id)}
                >
                    {!item.multiSelect ?
                        item.options?.map(option => <MenuItem value={option._id} key={option._id}>{t(option.name)}</MenuItem>)
                        : item.options?.map(option => <MenuItem value={option._id} key={option._id}>
                            <Checkbox checked={item.value.includes(option._id)} />
                            <ListItemText primary={t(option.name)} />
                        </MenuItem>)}
                </Select>
            </FormControl>
        }

        if(item.type === 'datetimepicker'){
            return <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div style={{marginTop: '15px', width: '100%'}}>
                    <DateTimePicker
                        label={t(item.label)}
                        value={dayjs(item.value)}
                        onChange={(newValue) => handleChange({target: {value: newValue}}, index)}
                        ampm={false}
                        disabled={item.disabled}
                     />
                </div>
              
            </LocalizationProvider>
        }

        return <TextField
            required={item.required}
            id={`${item.label} - ${index}`}
            label={t(item.label)}
            defaultValue={item.defaultValue}
            value={item.value}
            onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, index, '', subIndex, item._id || id)}
            placeholder={item.placeholder}
            type={item.type}
            disabled={item.disabled}
            helperText={item.helperText}
            error={item.error}
            multiline={item.multiline}
            rows={item.rows}
            fullWidth={item.fullWidth}
            variant={item.variant}
            size={item.size}
            InputProps={item.InputProps}
            InputLabelProps={item.InputLabelProps}
            FormHelperTextProps={item.FormHelperTextProps}
            className={item.className}
            style={{ ...item.style, marginTop: '15px' }}
        />

    }

    const generateImageFormElement = (img: TextForm<Model>, index: number) => {
        if (typeof img.value === 'string') {
            return <>
                <Divider />
                <span style={{ padding: '10px', color: 'rgb(0,0,0)' }}>{t(img.label)}</span>
                <Divider />
                <UploadImage isSingle uploadAction={(data: FilePresignedUrlModel[]) => handleChange({ target: { value: data[0].cdnUrl } }, index)} target={props.target || 'CATEGORY'} uploadedImages={img.value ? [{ cdnUrl: img.value }] : []} />
            </>
        }

        if (typeof img.value === 'number') return null

        return <>
            <Divider />
            <span style={{ padding: '10px', color: 'rgb(0,0,0)' }}>{t(img.label)}</span>
            <Divider />
            <UploadImage uploadAction={(data: FilePresignedUrlModel[]) => handleChange({ target: { value: data } }, index)} target={props.target || 'CATEGORY'} uploadedImages={img.value} />
        </>
    }

    const handleCancel = () => {
        props.cancelAction && props.cancelAction()
    }

    return (
        <div style={{ backgroundColor: 'white', minWidth: '40vw', maxWidth: '50vw', padding: '15px' }}>
            <div style={{ color: 'rgb(0,0,0)' }}>{t(props.target as string)}</div>
            <Divider />
            <div style={{ maxHeight: '70vh', overflowY: 'scroll' }}>
                {props.form.map((item: TextForm<Model>, index: number) => {
                    if (item.type === 'image') return generateImageFormElement(item, index)
                    return generateFormElement(item, index)
                })}
                {props.isUploadImage ? <>
                    <Divider />
                    <span style={{ padding: '10px', color: 'rgb(0,0,0)' }}>{t("uploadImage")}</span>
                    <Divider />
                    <UploadImage uploadAction={setUploadedImages} target={props.target || 'CATEGORY'} uploadedImages={uploadedImages} />
                </> : null}
            </div>
            <Divider />
            <span style={{ padding: '5px', display: 'flex', justifyContent: 'end' }}>
                {props.cancelBtnLabel ? <Button classes='mr-2' label={props.cancelBtnLabel} color='error' size='small' variant='contained' onClick={() => handleCancel()} /> : null}
                {props.saveBtnLabel ? <Button label={props.saveBtnLabel} color='success' size='small' variant='contained' onClick={() => handleSave()} /> : null}
            </span>
        </div>
    )
}

export default Form