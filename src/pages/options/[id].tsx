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
import { OptionModel, FilePresignedUrlModel, ESortOrder } from '@/dataStructure/categories';
import UploadImage from '@/components/UploadImage';
import { useGetCategories } from '@/GraphQL/category';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';


const GET_OPTION_BY_ID = gql`
  query findOptionById($id: ObjectId!) {
    findOptionById(id: $id) {
                
      _id
      name
      category {
          _id
          name
          code
          isActive
      }
      price
      estTime
      imageUrls
      minQuantity
      maxQuantity
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_OPTION_BY_ID = gql`
  mutation updateOptionById($id: ObjectId!, $input: OptionUpdateInput!) {
    updateOptionById(id: $id, input: $input) {
                
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
}

interface OptionProps {
  findOptionById: OptionModel
}

const Option = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { id } = router.query

  const { loading, error, data, refetch } = useQuery<OptionProps>(GET_OPTION_BY_ID, { variables: { id: id } });
  const { getCategoryResult } = useGetCategories({
    variables: {
      paginationInput: {
        limit: 3,
        pageNumber: 1,
      },
      optionInput: {
        isGetAll: true
      }
    }

  })
  const [mutate] = useMutation(UPDATE_OPTION_BY_ID, {
    onCompleted: async () => {

      refetch()
      setEdit(false)
    }
  })
  const [isEdit, setEdit] = React.useState(false)
  const [form, setForm] = React.useState<FormData<Partial<OptionModel>>[]>()
  const imgRef = React.useRef<string[]>([])


  useEffect(() => {
    if (!data) return
    const newForm: FormData<Partial<OptionModel>>[] = []
    objectKeys(data.findOptionById).map((key) => {
      if (key === 'imageUrls' || key === '_id' || key === '__typename' || key === 'categoryId') return null

      if (key === 'category') {
        return newForm.push({
          label: t('category'),
          value: data.findOptionById?.category?._id,
          type: 'dropdown',
          options: getCategoryResult?.categorySearch?.nodes?.map((item) => ({ name: item.name, _id: item._id })) || [],
          disabled: false
        })

      }

      return newForm.push({
        label: key,
        value: key === 'createdAt' || key === 'updatedAt' ? parseDate(data.findOptionById[key]) : data.findOptionById[key],
        type: ['price', 'minQuantity', 'maxQuantity', 'estTime'].includes(key) ? 'number' : "text",
        disabled: ['createdAt', 'updatedAt', 'orderCount'].includes(key),
      })
    });

    setForm(newForm)
  }, [data])

  if (loading || !form) return <p>Loading...</p>
  if (error) return <p>Error...</p>

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, item: FormData<Partial<OptionModel>>) => {

    const newForm = [...form]

    const index = newForm.findIndex((i) => i.label === item.label)
    newForm[index].value = e.target.value
    setForm(newForm)

  }

  const handleSave = () => {
    if (!isEdit) return setEdit(true)

    const formData = form.reduce((acc: Partial<OptionModel>, item: FormData<Partial<OptionModel>>) => {
      if (item.label === 'name' || item.label === 'isActive') { acc[item.label] = item.value as string }
      if (item.label === 'estTime' || item.label === 'minQuantity' || item.label === 'maxQuantity' || item.label === 'price') {
        acc[item.label] = parseFloat(item.value)
      }

      if (item.label === 'category') { acc['categoryId'] = item.value as string }
      return acc
    }, {})

    formData.imageUrls = imgRef.current;

    mutate({
      variables: {
        id: data?.findOptionById?._id,
        input: {
          ...formData
        }
      }
    })
  }
  const handleDelete = () => {
    if (!data) return
    const newForm: FormData<Partial<OptionModel>>[] = []
    objectKeys(data.findOptionById).map((key) => {
      if (key === 'imageUrls' || key === '_id' || key === '__typename' || key === 'categoryId') return null

      if (key === 'category') {
        return newForm.push({
          label: t('category'),
          value: data.findOptionById?.category?._id,
          type: 'dropdown',
          options: getCategoryResult?.categorySearch?.nodes?.map((item) => ({ name: item.name, _id: item._id })) || [],
          disabled: false
        })

      }

      return newForm.push({
        label: key,
        value: key === 'createdAt' || key === 'updatedAt' ? parseDate(data.findOptionById[key]) : data.findOptionById[key],
        type: key === 'isActive' ? 'checkbox' : "text",
        disabled: key === 'createdAt' || key === 'updatedAt',
      })
    });

    setForm(newForm)
    setEdit(false)
  }

  const handleUpload = (uploadFiles: FilePresignedUrlModel[]) => {
    const urls = uploadFiles.map((file) => file.cdnUrl)
    imgRef.current = [...imgRef.current, ...urls]
  }

  return (
    <Wrapper label={t("optionObj.name")}>
      <Link href="/options"><span style={{ textDecoration: 'underline', color: 'blue', display: 'flex', alignItems: 'center' }}> <KeyboardBackspaceIcon /> {t("backToList")}</span></Link>
      <span style={{ padding: '5px', display: 'flex', justifyContent: 'end' }}>
        {isEdit ? <Button classes='mr-2' label={t("cancel")} color='error' size='small' variant='contained' onClick={() => handleDelete()} /> : null}
        <Button label={t(isEdit ? 'save' : 'edit')} color='success' size='small' variant='contained' onClick={() => handleSave()} />
      </span>
      <List sx={{ width: '500px', backgroundColor: 'white', left: '30%' }}>
        {form.filter(e => e).map((item, index) => {
          if (item.type === 'dropdown') {
            return <ListItem key={index}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{item?.label}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={item?.value}
                  label={item?.label}
                  disabled={item.disabled ? item.disabled : !isEdit}
                  onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, item)}
                >
                  {item.options.map(option => <MenuItem value={option._id}>{option.name}</MenuItem>)}
                </Select>
              </FormControl>
            </ListItem>
          }

          return <ListItem key={index}>
            {/* <TextField value={item?.value} label={item?.label} disabled={true} multiline={item?.multiline} id="outlined-start-adornment"/> */}
            <TextField
              type={item.type}
              value={item?.value} label={t(item?.label)} disabled={item.disabled ? item.disabled : !isEdit} multiline={item?.multiline}
              fullWidth={true}
              onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>, item)}
              InputProps={{
                startAdornment: <InputAdornment position="start"></InputAdornment>,
              }}
            />
          </ListItem>
        }
        )}
      </List>
      {!isEdit ? <Stack direction="row" alignItems="center" spacing={2} marginTop={3} left={'30%'} position={'absolute'}>
        {
          data?.findOptionById.imageUrls ? <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
            {data?.findOptionById.imageUrls.map((img: string) => (
              <ImageListItem key={img}>
                <Image
                  src={img}
                  width={150}
                  height={150}
                  alt="Picture of the author"
                  key={img}
                />
              </ImageListItem>
            ))}
          </ImageList> : null
        }

      </Stack> : <UploadImage uploadAction={handleUpload} target={'CATEGORY'} uploadedImages={data?.findOptionById.imageUrls.map(url => ({ cdnUrl: url })) || []} />}
    </Wrapper>
  )
}

export const getServerSideProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "vi", ["common"])),
    },
  };
};

export default Option