import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useQuery, gql, useMutation } from '@apollo/client';
import Wrapper from '@/components/Wrapper';
import Image from 'next/image';
import { Checkbox, Divider, FormControl, ImageList, ImageListItem, InputAdornment, InputLabel, List, ListItem, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Button from '@/components/Button';
import { objectKeys, parseDate } from '@/utils/func';
import { CategoryModel, ESortOrder, FilePresignedUrlModel, ItemModel, ItemUpdateInput, OptionModel } from '@/dataStructure/categories';
import UploadImage from '@/components/UploadImage';
import Form, { TextForm } from '@/components/Form';
import { useGetCategories } from '@/GraphQL/category';
import { useGetOptions } from '@/GraphQL/option';

import _ from 'lodash'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';


const GET_ITEM_BY_ID = gql`
  query findItemById($id: ObjectId!) {
    findItemById(id: $id) {
                
      _id
      name
      subName
      tags
      categoryId
      category {
          _id
          name
          code
          isActive
      }
      options{
        _id
        name
        categoryId
        price
      }
      estTime
      isActive
      createdAt
      updatedAt
      imageUrls
      price
      minQuantity
      maxQuantity
      content
    }
  }
`;

const UPDATE_ITEM_BY_ID = gql`
  mutation updateItemById($id: ObjectId!, $input: ItemUpdateInput!) {
    updateItemById(id: $id, input: $input) {
                
                    _id
                    name
                    price
                    content
                    createdAt
                    updatedAt
                    isActive
                    imageUrls
            }
  }
`;

interface ItemProps {
  findItemById: ItemModel
}

const ableUpdateKeys = ['name', 'subName', 'categoryId', 'optionIds', 'content', 'tags']
const ableUpdateKeysNumber  = [ 'estTime', 'price', 'minQuantity', 'maxQuantity']

const Item = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { id } = router.query

  const { loading, error, data, refetch } = useQuery<ItemProps>(GET_ITEM_BY_ID, { variables: { id: id} });
  const {getCategoryResult} = useGetCategories({ variables: { paginationInput: {
    limit: 3,
    pageNumber: 1,
    },
    optionInput: {
        isGetAll: true
    } } })
  const {getOptionsResult} = useGetOptions({ variables: { paginationInput: {
    limit: 3,
    pageNumber: 1,
    },
    optionInput: {
        isGetAll: true
    } }
  })
  const [mutate] = useMutation(UPDATE_ITEM_BY_ID, {
    onCompleted: async () => {
      refetch()
      setEdit(false)
    }
})
  const [isEdit, setEdit] = React.useState(false)
  const [form, setForm] = React.useState<TextForm<Partial<ItemModel>>[]>()
  const imgRef = React.useRef<string[]>([])
  const imgContentRef = React.useRef<string>('')


  useEffect(() => {
    if(!data) return
    
    imgContentRef.current = data.findItemById.content || ''
    imgRef.current = data.findItemById.imageUrls || []
    const newForm : TextForm<Partial<ItemModel>>[] = []
    objectKeys(data.findItemById).map((key) => {
        if(['imageUrls', '_id', '__typename', 'categoryId', 'content'].includes(key)) return null
        if(key === 'category') return newForm.push({
          label: key,
          value: data.findItemById[key]?._id || '',
          type: 'dropdown',
          options: getCategoryResult?.categorySearch.nodes,
          alias: 'categoryId',
          fullWidth: true,
          disabled: !isEdit,
        })
        if(key === 'options') return newForm.push({
          label: key,
          value: data.findItemById[key]?.map(item => item._id) || [],
          type: 'dropdown',
          options: getOptionsResult?.optionSearch.nodes.filter(option => option.categoryId === data.findItemById.categoryId),
          multiSelect: true,
          alias: 'optionIds',
          fullWidth: true,
          disabled: !isEdit,
        })
        return newForm.push({
          label: key,
          value: key === 'createdAt' || key === 'updatedAt' ? parseDate(data.findItemById[key]) : data.findItemById[key],
          type: ['price','minQuantity', 'maxQuantity', 'estTime'].includes(key) ? 'number' : "text",
          disabled: key === 'createdAt' || key === 'updatedAt' || key === 'orderCount' || key === 'isActive' ? true : !isEdit,
          alias: key,
          hide: key === 'createdAt' || key === 'updatedAt' || key === 'isActive',
          fullWidth: true,
        })
      });

    setForm(newForm)
  }, [data, getCategoryResult, getOptionsResult, isEdit])

  if(loading || !form) return <p>Loading...</p>
  if(error) return <p>Error...</p>
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string[]>, index: number) => {

    const newForm = _.cloneDeep(form)
    newForm[index].value = e.target.value
    
    if(newForm[index].label === 'category') {
        newForm[index].options = getCategoryResult?.categorySearch.nodes
        const optionIndex = newForm.findIndex((i) => i.label === 'options')
        newForm[optionIndex].options = getOptionsResult?.optionSearch.nodes.filter(option => option.categoryId === e.target.value)
        newForm[optionIndex].value = []
    }
    setForm(newForm)

  }

  const handleSave = () => {
    if(!isEdit) return setEdit(true)

    const formData = form.reduce((acc, item: TextForm<Partial<ItemModel>>) => {
      if(ableUpdateKeys.includes(item.alias)) { acc[item.alias] = item.value }
      if(ableUpdateKeysNumber.includes(item.alias)) { acc[item.alias] = Number(item.value) }
      return acc
    }, {} as Record<string, any>)

    formData.imageUrls = _.uniq(imgRef.current);
    formData.content = imgContentRef.current;

    mutate({variables: {
      id: data?.findItemById?._id,
      input: {
        ...formData
      }
    }})
  }
  const handleDelete = () => {
    if(!data) return
    setEdit(false)
  }

  const handleUpload = (uploadFiles: FilePresignedUrlModel[]) => {
    const urls = uploadFiles.map((file) => file.cdnUrl)
    imgRef.current = [...imgRef.current, ...urls]
  }

  const handleUploadContent = (uploadFiles: FilePresignedUrlModel[]) => {
    const url = uploadFiles.map((file) => file.cdnUrl)
    imgContentRef.current = url[0]
  }

  return (
    <Wrapper label={t("items")}>
      <Link href="/items"><span style={{textDecoration: 'underline', color: 'blue', display: 'flex', alignItems: 'center'}}> <KeyboardBackspaceIcon />{t("backToList")}</span></Link>
      <span style={{padding: '5px', display: 'flex', justifyContent: 'end'}}>
                {isEdit ? <Button classes='mr-2' label={t("cancel")} color='error' size='small' variant='contained' onClick={() =>  handleDelete()}/> : null}
                <Button label={t(isEdit ? 'save' : 'edit')} color='success' size='small' variant='contained' onClick={() => handleSave()}/>
            </span>
      <List sx={{width: '500px', backgroundColor: 'white', left: '30%'}}>
        <Form form={form} handleChange={handleChange} />
        <Divider/>
      <span>{t("contentImage")}</span>
      {!isEdit ?<div>
        {
          data?.findItemById.content ? <div>
          
          <ImageList sx={{ width: 500, height: 200 }} cols={1} rowHeight={164}>
              <ImageListItem key={data?.findItemById.content}>
                <Image
                        src={data?.findItemById.content}
                        alt="Picture of the author"
                        key={data?.findItemById.content}
                        fill
                        quality={100}
                    />
              </ImageListItem>
          
          </ImageList>
          </div>  : null   
        }
                  
      </div> : <UploadImage isSingle uploadAction={handleUploadContent} target={'ITEM'} uploadedImages={data?.findItemById.content ? [{cdnUrl: data?.findItemById.content}]: []}/>}
      <Divider/>
      <span>{t("image")}</span>
      {!isEdit ? <div>
        {
          data?.findItemById.imageUrls ? <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
            {data?.findItemById.imageUrls.map((img: string) => (
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
          </ImageList>  : null   
        }
                  
      </div> : <UploadImage uploadAction={handleUpload} target={'ITEM'} uploadedImages={data?.findItemById.imageUrls.map(url => ({cdnUrl: url})) || []}/>}
      
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

export default Item