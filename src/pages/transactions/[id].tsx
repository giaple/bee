import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useQuery, gql, useMutation } from '@apollo/client';
import Wrapper from '@/components/Wrapper';
import Image from 'next/image';
import { FormControl, ImageList, ImageListItem, InputAdornment, InputLabel, List, ListItem, ListItemText, MenuItem, Select, Stack, TextField } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Button from '@/components/Button';
import { objectKeys, objectValues, parseDate } from '@/utils/func';
import { CustomerModel, EGender, EPaymentMethod, ETransactionStatus, FilePresignedUrlModel, Maybe, TransactionModel } from '@/dataStructure/categories';
import UploadImage from '@/components/UploadImage';
import { TextForm } from '@/components/Form';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';


const GET_TRANSACTION_BY_ID = gql`
  query findTransactionById($id: ObjectId!) {
    findTransactionById(id: $id) {
        _id
        amount
        paymentMethod
        status
        note
        createdAt
        updatedAt
    }
  }
`;

const UPDATE_TRANSACTION_BY_ID = gql`
  mutation updateTransactionById($id: ObjectId!, $input: TransactionUpdateInput!) {
    updateTransactionById(id: $id, input: $input) {
                _id
                    
            }
  }
`;

type ValueOf<T> = T[keyof T];

interface TransactionProps {
  findTransactionById: TransactionModel
}

const Transaction = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { id } = router.query

  const { loading, error, data, refetch } = useQuery<TransactionProps>(GET_TRANSACTION_BY_ID, { variables: { id: id } });
  const [mutate] = useMutation(UPDATE_TRANSACTION_BY_ID, {
    onCompleted: async (data: TransactionProps) => {

      refetch()
      setEdit(false)
    }
  })
  const [isEdit, setEdit] = React.useState(false)
  const [form, setForm] = React.useState<TextForm<Partial<TransactionModel>>[]>()
  const imgRef = React.useRef<string>('')


  useEffect(() => {
    if (!data) return
    const newForm: TextForm<Partial<TransactionModel>>[] = []
    objectKeys(data.findTransactionById).map((key) => {
      if (key === '_id' || key === '__typename') return null
      if (key === 'paymentMethod') return newForm.push({
        label: key,
        alias: 'paymentMethod',
        value: data.findTransactionById[key] || '',
        type: 'dropdown',
        disabled: !isEdit,
        options: objectValues(EPaymentMethod).map((value) => ({
          _id: value,
          name: value
        })) || [],
      })
      if (key === 'status') return newForm.push({
        label: key,
        alias: 'status',
        value: data.findTransactionById[key] || '',
        type: 'dropdown',
        disabled: !isEdit,
        options: objectValues(ETransactionStatus).map((value) => ({
          _id: value,
          name: value
        })) || [],
      })
      return newForm.push({
        label: key,
        alias: key,
        value: key === 'createdAt' || key === 'updatedAt' ? parseDate(data.findTransactionById[key]) : data.findTransactionById[key],
        type: "text",
        disabled: key !== 'note',
      })
    });

    setForm(newForm)
  }, [data, isEdit])

  if (loading || !form) return <p>Loading...</p>
  if (error) return <p>Error...</p>

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, item: TextForm<Partial<CustomerModel>>) => {

    const newForm = [...form]

    const index = newForm.findIndex((i) => i.label === item.label)
    newForm[index].value = e.target.value
    setForm(newForm)

  }

  const handleSave = () => {
    if (!isEdit) return setEdit(true)

    const formData = form.reduce((acc: Partial<TransactionModel>, item: TextForm<Partial<TransactionModel>>) => {
      if (['note', 'status', 'paymentMethod'].includes(item.alias)) acc[item.alias] = item.value
      return acc
    }, {})

    mutate({
      variables: {
        id: data?.findTransactionById?._id,
        input: {
          ...formData
        }
      }
    })
  }
  const handleDelete = () => {
    if (!data) return
    const newForm: TextForm<Partial<TransactionModel>>[] = []
    objectKeys(data.findTransactionById).map((key) => {
      if (key === '_id' || key === '__typename') return null
      if (key === 'paymentMethod') return newForm.push({
        label: key,
        alias: 'paymentMethod',
        value: data.findTransactionById[key] || '',
        type: 'dropdown',
        disabled: !isEdit,
        options: objectKeys(EPaymentMethod).map((key) => ({
          _id: EPaymentMethod[key],
          name: key
        })) || [],
      })
      if (key === 'status') return newForm.push({
        label: key,
        alias: 'status',
        value: data.findTransactionById[key] || '',
        type: 'dropdown',
        disabled: !isEdit,
        options: objectKeys(ETransactionStatus).map((key) => ({
          _id: ETransactionStatus[key],
          name: key
        })) || [],
      })
      return newForm.push({
        label: key,
        alias: key,
        value: key === 'createdAt' || key === 'updatedAt' ? parseDate(data.findTransactionById[key]) : data.findTransactionById[key],
        type: "text",
        disabled: key !== 'note',
      })
    });

    setForm(newForm)
    setEdit(false)
  }

  return (
    <Wrapper label={t("transactions")}>
      <Link href="/transactions"><span style={{ textDecoration: 'underline', color: 'blue', display: 'flex', alignItems: 'center' }}> <KeyboardBackspaceIcon />{t("backToList")}</span></Link>
      <span style={{ padding: '5px', display: 'flex', justifyContent: 'end' }}>
        {isEdit ? <Button classes='mr-2' label={t("cancel")} color='error' size='small' variant='contained' onClick={() => handleDelete()} /> : null}
        <Button label={t(isEdit ? 'save' : 'edit')} color='success' size='small' variant='contained' onClick={() => handleSave()} />
      </span>

      <List sx={{ width: '500px', backgroundColor: 'white', left: '30%' }}>
        {form.filter(e => e).map((item, index) => {


          if (item.type === 'dropdown') return <ListItem key={index}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">{t(item.label)}</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={item.value}
                label={t(item.label)}
                disabled={item.disabled}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, item)}
              >
                {item.options?.map(option => <MenuItem value={option._id} key={option._id}>{t(option.name)}</MenuItem>)}
              </Select>
            </FormControl>
          </ListItem>

          return <ListItem key={index}>
            {/* <TextField value={item?.value} label={item?.label} disabled={true} multiline={item?.multiline} id="outlined-start-adornment"/> */}
            <TextField
              value={item?.value} label={t(item?.label)} disabled={item.disabled ? item.disabled : !isEdit} multiline={item?.multiline}
              fullWidth={true}
              onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, item)}
              InputProps={{
                startAdornment: <InputAdornment position="start"></InputAdornment>,
              }}
            />
          </ListItem>
        })}
      </List>
    </Wrapper>
  )
}

export const getServerSideProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "vi", ["common"])),
    },
  };
}

export default Transaction