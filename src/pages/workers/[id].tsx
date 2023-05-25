import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useQuery, gql, useMutation } from '@apollo/client';
import Wrapper from '@/components/Wrapper';
import Image from 'next/image';
import { FormControl, ImageList, ImageListItem, InputAdornment, InputLabel, List, ListItem, ListItemText, MenuItem, Select, Stack, TextField } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Button from '@/components/Button';
import { objectKeys, parseDate } from '@/utils/func';
import { CustomerModel, EGender, EWorkerRoleType, FilePresignedUrlModel, Maybe, WorkerModel } from '@/dataStructure/categories';
import UploadImage from '@/components/UploadImage';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';


const GET_WORKER_BY_ID = gql`
  query findWorkerById($id: ObjectId!) {
    findWorkerById(id: $id) {
                
        _id
        firstName
        lastName
        phoneNumber
        email
        dob
        gender
        role
        imageUrl
        createdAt
        updatedAt
    }
  }
`;

const UPDATE_WORKER_BY_ID = gql`
  mutation updateWorkerById($id: ObjectId!, $input: WorkerUpdateInput!) {
    updateWorkerById(id: $id, input: $input) {
                _id
                    
            }
  }
`;

interface FormData<T> {
  label: keyof T;
  value: string | boolean;
  type: string;
  multiline?: boolean;
  disabled?: boolean;
  options?: any[];
}

interface CustomerProps {
  findWorkerById: WorkerModel
}

const Customer = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { id } = router.query

  const { loading, error, data, refetch } = useQuery<CustomerProps>(GET_WORKER_BY_ID, { variables: { id: id} });
  const [mutate] = useMutation(UPDATE_WORKER_BY_ID, {
    onCompleted: async (data: CustomerProps) => {
        
      refetch()
      setEdit(false)
    }
})
  const [isEdit, setEdit] = React.useState(false)
  const [form, setForm] = React.useState<FormData<Partial<WorkerModel>>[]>()
  const imgRef = React.useRef<string>('')


  useEffect(() => {
    if(!data) return
    const newForm : FormData< Partial <WorkerModel>>[] = []
    objectKeys(data.findWorkerById).map((key) => {
      if(key === 'imageUrl' || key === '_id' || key === '__typename') return null
      if(key === 'gender') return newForm.push({
        label: key,
        value: data.findWorkerById[key] || '',
        type: 'dropdown',
        options: Object.values(EGender).map((item) => ({name: item, _id: item})),
      })
      if(key === 'role') return newForm.push({
        label: key,
        value: data.findWorkerById[key] || '',
        type: 'dropdown',
        options: Object.values(EWorkerRoleType).map((item) => ({name: item, _id: item})),
      })
      return newForm.push({
        label: key,
        value: key === 'createdAt' || key === 'updatedAt' ? parseDate(data.findWorkerById[key]) : data.findWorkerById[key],
        type: key === 'dob' ? 'date' : "text",
        disabled: key === 'createdAt' || key === 'updatedAt' || key === 'phoneNumber' || key === 'phoneCountryCode',
      })
    });

    setForm(newForm)
  }, [data])

  if(loading || !form) return <p>Loading...</p>
  if(error) return <p>Error...</p>
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, item: FormData<Partial<CustomerModel>>) => {

    const newForm = [...form]

    const index = newForm.findIndex((i) => i.label === item.label)
    newForm[index].value = e.target.value
    setForm(newForm)

  }

  const handleSave = () => {
    if(!isEdit) return setEdit(true)

    const formData = form.reduce((acc: Partial<WorkerModel>, item: FormData<Partial<WorkerModel>>) => {
      if(item.label !== 'phoneCountryCode' && item.label !== 'phoneNumber' && item.label !== 'createdAt' && item.label !== 'updatedAt' ) acc[item.label] = item.value as string 
      return acc
    }, {})

    formData.imageUrl = imgRef.current;

    mutate({variables: {
      id: data?.findWorkerById?._id,
      input: {
        ...formData
      }
    }})
  }
  const handleDelete = () => {
    if(!data) return
    const newForm : FormData<Partial<WorkerModel>>[] = []
    objectKeys(data.findWorkerById).map((key) => {
      if(key === 'imageUrl' || key === '_id' || key === '__typename') return null
      return newForm.push({
        label: key,
        value: key === 'createdAt' || key === 'updatedAt' ? parseDate(data.findWorkerById[key]) : data.findWorkerById[key],
        type: key === 'dob' ? 'date' : "text",
        disabled: key === 'createdAt' || key === 'updatedAt' || key === 'role',
      })
    });

    setForm(newForm)
    setEdit(false)
  }

  const handleUpload = (uploadFiles: FilePresignedUrlModel[]) => {
    const urls = uploadFiles.map((file) => file.cdnUrl)
    imgRef.current = urls[1]
  }


  return (
    <Wrapper label={t("workers")}>
      <Link href="/workers"><span style={{textDecoration: 'underline', color: 'blue', display: 'flex', alignItems: 'center'}}> <KeyboardBackspaceIcon />{t("backToList")}</span></Link>
      <span style={{padding: '5px', display: 'flex', justifyContent: 'end'}}>
                {isEdit ? <Button classes='mr-2' label={t("cancel")} color='error' size='small' variant='contained' onClick={() =>  handleDelete()}/> : null}
                <Button label={t(isEdit ? 'save' : 'edit')} color='success' size='small' variant='contained' onClick={() => handleSave()}/>
            </span>

      <List sx={{width: '500px', backgroundColor: 'white', left: '30%'}}>
      {form.filter(e => e).map((item, index) => {


        if(item.type === 'dropdown') return <ListItem key={index}>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{t(item.label)}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={item.value}
                label={t(item.label)}
                disabled={!isEdit}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, item)}
            >
                {item.options?.map(i => <MenuItem value={i._id} key={i._id}>{t(i.name)}</MenuItem>)}
            </Select>
            </FormControl>
        </ListItem>

        return <ListItem key={index}>
            {/* <TextField value={item?.value} label={item?.label} disabled={true} multiline={item?.multiline} id="outlined-start-adornment"/> */}
            <TextField
          value={item?.value} label={t(item?.label)} disabled={item.disabled? item.disabled : !isEdit} multiline={item?.multiline}
          fullWidth={true}
          onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, item)}
          InputProps={{
            startAdornment: <InputAdornment position="start"></InputAdornment>,
          }}
        />
        </ListItem>
})}
      </List>
      {!isEdit ? <Stack direction="row" alignItems="center" spacing={2} marginTop={3} left={'30%'} position={'absolute'}>
        {
          data?.findWorkerById.imageUrl ? <Image
          src={data?.findWorkerById.imageUrl}
          width={150}
          height={150}
          alt="Picture of the author"
          key={data?.findWorkerById.imageUrl}
      /> : null   
        }
                  
      </Stack> : <UploadImage isSingle={true} uploadAction={handleUpload} target={'CATEGORY'} uploadedImages={data?.findWorkerById.imageUrl ? [{cdnUrl: data?.findWorkerById.imageUrl} ] : []}/>}
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

export default Customer