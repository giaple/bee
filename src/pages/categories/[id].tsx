import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useQuery, gql, useMutation } from '@apollo/client';
import Wrapper from '@/components/Wrapper';
import Image from 'next/image';
import { ImageList, ImageListItem, InputAdornment, List, ListItem, ListItemText, Stack, TextField } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Button from '@/components/Button';
import { objectKeys, parseDate } from '@/utils/func';
import { CategoryModel, FilePresignedUrlModel } from '@/dataStructure/categories';
import UploadImage from '@/components/UploadImage';
import _ from 'lodash';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';


const GET_CATEGORY_BY_ID = gql`
  query findCategoryById($id: ObjectId!) {
    findCategoryById(id: $id) {
                
                    _id
                    name
                    code
                    description
                    createdAt
                    updatedAt
                    imageUrls
            }
  }
`;

const UPDATE_CATEGORY_BY_ID = gql`
  mutation updateCategoryById($id: ObjectId!, $input: CategoryUpdateInput!) {
    updateCategoryById(id: $id, input: $input) {
                
                    _id
                    name
                    code
                    description
                    createdAt
                    updatedAt
                    isActive
                    imageUrls
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

interface CategoryProps {
  findCategoryById: CategoryModel
}

const Category = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { id } = router.query

  const { loading, error, data, refetch } = useQuery<CategoryProps>(GET_CATEGORY_BY_ID, { variables: { id: id } });
  const [mutate] = useMutation(UPDATE_CATEGORY_BY_ID, {
    onCompleted: async (data: CategoryModel) => {

      refetch()
      setEdit(false)
    }
  })
  const [isEdit, setEdit] = React.useState(false)
  const [form, setForm] = React.useState<FormData<Partial<CategoryModel>>[]>()
  const imgRef = React.useRef<string[]>([])


  useEffect(() => {
    if (!data) return
    imgRef.current = data.findCategoryById.imageUrls
    const newForm: FormData<Partial<CategoryModel>>[] = []
    objectKeys(data.findCategoryById).map((key) => {
      if (key === 'imageUrls' || key === '_id' || key === '__typename') return null
      if (key === 'description') return newForm.push({
        label: key,
        value: data.findCategoryById[key],
        type: "text",
        multiline: true,
      })
      return newForm.push({
        label: key,
        value: key === 'createdAt' || key === 'updatedAt' ? parseDate(data.findCategoryById[key]) : data.findCategoryById[key],
        type: key === 'isActive' ? 'checkbox' : "text",
        disabled: key === 'createdAt' || key === 'updatedAt',
      })
    });

    setForm(newForm)
  }, [data])

  if (loading || !form) return <p>Loading...</p>
  if (error) return <p>Error...</p>

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, item: FormData<Partial<CategoryModel>>) => {

    const newForm = [...form]

    const index = newForm.findIndex((i) => i.label === item.label)
    newForm[index].value = e.target.value
    setForm(newForm)

  }

  const handleSave = () => {
    if (!isEdit) return setEdit(true)

    const formData = form.reduce((acc: Partial<CategoryModel>, item: FormData<Partial<CategoryModel>>) => {
      if (item.label === 'code' || item.label === 'description' || item.label === 'name') { acc[item.label] = item.value as string }
      return acc
    }, {})

    formData.imageUrls = _.uniq(imgRef.current);

    mutate({
      variables: {
        id: data?.findCategoryById?._id,
        input: {
          ...formData
        }
      }
    })
  }
  const handleDelete = () => {
    if (!data) return
    const newForm: FormData<Partial<CategoryModel>>[] = []
    objectKeys(data.findCategoryById).map((key) => {
      if (key === 'imageUrls' || key === '_id' || key === '__typename') return null
      if (key === 'description') return newForm.push({
        label: key,
        value: data.findCategoryById[key],
        type: "text",
        multiline: true,
      })
      return newForm.push({
        label: key,
        value: key === 'createdAt' || key === 'updatedAt' ? parseDate(data.findCategoryById[key]) : data.findCategoryById[key],
        type: key === 'isActive' ? 'checkbox' : "text",
        disabled: key === 'createdAt' || key === 'updatedAt',
      })
    });

    setForm(newForm)
    setEdit(false)
  }

  const handleUpload = (uploadFiles: FilePresignedUrlModel[]) => {
    const urls = uploadFiles.map((file) => file.cdnUrl)
    imgRef.current = imgRef.current.concat(urls)
  }


  return (
    <Wrapper label={t("categories")}>
      <Link href="/categories"><span style={{ textDecoration: 'underline', color: 'blue', display: 'flex', alignItems: 'center' }}> <KeyboardBackspaceIcon />{t('backToList')}</span></Link>
      <span style={{ padding: '5px', display: 'flex', justifyContent: 'end' }}>
        {isEdit ? <Button classes='mr-2' label={t("cancel")} color='error' size='small' variant='contained' onClick={() => handleDelete()} /> : null}
        <Button label={t(isEdit ? 'save' : 'edit')} color='success' size='small' variant='contained' onClick={() => handleSave()} />
      </span>
      <List sx={{ width: '500px', backgroundColor: 'white', left: '30%' }}>
        {form.filter(e => e).map((item, index) => (
          <ListItem key={index}>
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
        ))}
      </List>
      {!isEdit ? <Stack direction="row" alignItems="center" spacing={2} marginTop={3} left={'30%'} position={'absolute'}>
        {
          data?.findCategoryById.imageUrls ? <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
            {data?.findCategoryById.imageUrls.map((img: string) => (
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

      </Stack> : <UploadImage uploadAction={handleUpload} target={'CATEGORY'} uploadedImages={data?.findCategoryById.imageUrls.map(url => ({ cdnUrl: url })) || []} />}
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

export default Category