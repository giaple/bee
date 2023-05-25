import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useQuery, gql, useMutation } from '@apollo/client';
import Wrapper from '@/components/Wrapper';
import Image from 'next/image';
import { Checkbox, FormControl, ImageList, ImageListItem, InputAdornment, InputLabel, List, ListItem, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Button from '@/components/Button';
import { objectKeys, parseDate } from '@/utils/func';
import { CampaignCreateInput, CampaignModel, CategoryModel, ECampaignType, EPromotionTargetCondition, EPromotionTargetType, EPromotionType, ESortOrder, FilePresignedUrlModel, ItemModel, OptionModel, PromotionTargetInput } from '@/dataStructure/categories';
import UploadImage from '@/components/UploadImage';
import { useGetCategories } from '@/GraphQL/category';
import { useGetOptions } from '@/GraphQL/option';
import { useGetItems } from '@/GraphQL/item';
import Form, { TextForm } from '@/components/Form';

import {generateCompaignForm, generatePromotionTargetForm } from './index'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const GET_CAMPAIGN_BY_ID = gql`
  query findCampaignById($id: ObjectId!) {
    findCampaignById(id: $id) {
                
      _id
      name
      type
      code
      startDate
      endDate
      isActive
      status
      redemptionAmountLimit
      usedAmount
      usedCount
      createdAt
      updatedAt
      isActive
      description
      
      targets {
          ids
          type
          condition
          promotionType
          value
      }
    }
  }
`;

const UPDATE_CAMPAIGN_BY_ID = gql`
  mutation updateCampaignById($id: ObjectId!, $input: CampaignUpdateInput!) {
    updateCampaignById(id: $id, input: $input) {
                
              _id
            }
  }
`;

interface FormData<T> {
  label: keyof T;
  value: string | boolean | string[];
  type: string;
  multiline?: boolean;
  disabled?: boolean;
  options?: CategoryModel[] | OptionModel[] | ItemModel[] | {name: string, _id: string}[];
  multiSelect?: boolean;
}

interface ItemProps {
  findCampaignById: CampaignModel
}

// const generateCompaignForm = (campaign: CampaignModel, isEdit?: boolean): TextForm<CampaignModel>[] => {

//   return objectKeys(campaign).map((key) => {
//     if(key === '__typename' || key === '_id' || key === 'createdAt' || key === 'updatedAt') return null

//     if (key === 'targets') {
//       return {
//         label: key,
//         value: '',
//         options: campaign[key].map((target) => {
//           return objectKeys(target).map((targetKey) => {
//             return {
//               label: targetKey,
//               value: target[targetKey],
//               type: 'text',
//               disabled: true,
//               alias: targetKey,
//               fullWidth: true
//             }
//           })
//         }),
//         type: 'subForm',
//         disabled: true,
//         alias: key,
//         fullWidth: true
//       }
//     }

//     return {
//       label: key,
//       value: key === 'startDate' || key === 'endDate' ? parseDate(campaign[key]) :campaign[key],
//       type: 'text',
//       disabled: true,
//       alias: key,
//       fullWidth: true
//     }
  
//   }).filter((item) => item !== null) as TextForm<CampaignModel>[]

// }

const Campaign = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { id } = router.query
  const [isEdit, setEdit] = React.useState<boolean>(false)
  const [form, setForm] = React.useState<TextForm<CampaignModel>[]>([])

  const { loading, error, data, refetch } = useQuery<ItemProps>(GET_CAMPAIGN_BY_ID, { variables: { id: id} });
  const {getCategoryResult, getCategoryStatus} = useGetCategories({ variables: { paginationInput: {
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

  const {getItemsResult, getItemsStatus, getItemsError} = useGetItems({ variables: { paginationInput: {
    limit: 3,
    pageNumber: 1,
  },
  optionInput: {
      isGetAll: true
  } } })

  const [mutate] = useMutation(UPDATE_CAMPAIGN_BY_ID, {
    onCompleted: async () => {
      refetch()
      setEdit(false)
    }
})

const handleChanges = (e: React.ChangeEvent<HTMLInputElement>, index: number, action: string, subIndex: number) => {

  const tempForm = _.cloneDeep(form)

  if(action === 'addSub'){
      const tempTargetForm = generatePromotionTargetForm(undefined, true)
      if(tempForm[1].value === ECampaignType.Bill){
          tempTargetForm[1].hide = true
          tempTargetForm[1].value = ''
      }
      tempForm[index].options?.push(tempTargetForm)
      setForm(tempForm)
      return
  }

  if(action === 'delSub'){
      const targetIndex = tempForm.findIndex(form => form.alias === 'targets')
      tempForm[targetIndex].options?.splice(index, 1)
      setForm(tempForm)
      return
  }

  if(subIndex !== undefined){
      const targetIndex = tempForm.findIndex(form => form.alias === 'targets')
      const updatedItem = tempForm[targetIndex].options?.[subIndex][index]
      if(updatedItem.label === 'type'){
          const idsItem = tempForm[targetIndex].options?.[subIndex]?.find((item) => item.label === 'items')
          const isCategory = tempForm[1].value === ECampaignType.Category
          idsItem.hide = false
          if(e.target.value === EPromotionTargetType.Item){
              idsItem.options = getItemsResult?.itemSearch.nodes.filter(node => {
                  if(isCategory){
                      return node.categoryId?.includes(tempForm[2].value)
                  }
                  return true
              }).map((item) => ({name: item.name, _id: item._id}))
          }else if(e.target.value === EPromotionTargetType.Option){
              idsItem.options = getOptionsResult?.optionSearch.nodes.filter(node => {
                  if(isCategory){
                      return node.categoryId?.includes(tempForm[2].value)
                  }
                  return true
              }).map((item) => ({name: item.name, _id: item._id}))
          }else if(e.target.value === EPromotionTargetType.Total){
              idsItem.hide = true
          }

      }
      updatedItem.value = e.target.value
      setForm(tempForm)
      return
  }

  if(index === 1){
      const targetIndex = tempForm.findIndex(form => form.label === 'targets')
      if(e.target.value === ECampaignType.Bill){
          
          const subForm = tempForm[targetIndex].options
          subForm?.forEach((item) => {
              item[1].hide = true
              item[1].value = ''
          })
          const optionCodeIndex = tempForm.findIndex((item)=> item.label === 'code')
          tempForm[optionCodeIndex].hide = false
      }else{
          if(e.target.value === ECampaignType.Code){
              const optionCodeIndex = tempForm.findIndex((item)=> item.label === 'code')
              tempForm[optionCodeIndex].hide = false
          }else if(e.target.value === ECampaignType.Category){

              const optionCodeIndex = tempForm.findIndex((item)=> item.label === 'code')
              tempForm[optionCodeIndex].hide = false
              tempForm[optionCodeIndex].type = 'dropdown'
              tempForm[optionCodeIndex].options = getCategoryResult?.categorySearch.nodes.map((item) => ({name: item.name, _id: item._id}))
          }
          const subForm = tempForm[targetIndex].options
          subForm?.forEach((item) => {
              item[1].hide = false
          })
      }
  }

  if(index === 2){
      if(tempForm[1].value === ECampaignType.Bill){
          const targetsIndex = tempForm.findIndex((item)=> item.label === 'targets')
          const subForm = tempForm[targetsIndex].options
          subForm?.forEach(item => {
              if(item[1].value === EPromotionTargetType.Item){
                  item[2].options = getItemsResult?.itemSearch.nodes.filter(node => {
                      return node.categoryId?.includes(e.target.value)
                  }).map((item) => ({name: item.name, _id: item._id}))

              }else if(item[1].value === EPromotionTargetType.Option){
                  item[2].options = getOptionsResult?.optionSearch.nodes.filter(node => {
                      return node.categoryId?.includes(e.target.value)
                  }).map((item) => ({name: item.name, _id: item._id}))
              }
              
          })
      }
  }

  tempForm[index].value = e.target.value
  setForm(tempForm);
}

const handleSave = () => {
  if(!isEdit) return setEdit(true)

  const formData: Partial<CampaignCreateInput> = {
  }

  objectKeys(form).forEach((key) => {
      if (form[key].alias === 'targets') {
        formData.targets = form[key].options?.map((item) => {
              const temp: PromotionTargetInput = {
                  condition: item[0].value as EPromotionTargetCondition,
                  type: item[1].value as EPromotionTargetType,
                  ids: item[2].value as string[],
                  promotionType: item[3].value as EPromotionType,
                  value: Number(item[4].value)
              }
              return temp
          }) as PromotionTargetInput[]
      } else {
        if(form[key].alias === 'name' || form[key].alias === 'description') formData[form[key].alias as keyof CampaignCreateInput] = form[key].value
        
      }
  })

  mutate({variables: {
    id: data?.findCampaignById?._id,
    input: {
      ...formData
    }
  }})
}
const handleDelete = () => {  
  setEdit(false)
}

const generateForm = () => {
  const tempForm = generateCompaignForm(data?.findCampaignById, isEdit, 'detail')
  
  const index = tempForm.findIndex((item) => item.label === 'targets')

  if(index !== -1){
    tempForm[index].options = data?.findCampaignById?.targets?.map(target => {
      const subEles = generatePromotionTargetForm(target, isEdit)
      const indexItems = subEles.findIndex((item) => item.label === 'items')

      if(indexItems !== -1){
        const typeIndex = tempForm.findIndex((item) => item.label === 'type')
        const targetTypeIndex = subEles.findIndex((item) => item.label === 'type')
        const codeIndex = tempForm.findIndex((item) => item.label === 'code')

        if(tempForm[typeIndex].value === ECampaignType.Category){
          if(subEles[targetTypeIndex].value === EPromotionTargetType.Item){

            subEles[indexItems].options = getItemsResult?.itemSearch.nodes.filter(item => item.category?._id === tempForm[codeIndex].value)
          }else if(subEles[targetTypeIndex].value === EPromotionTargetType.Option){

            subEles[indexItems].options = getOptionsResult?.optionSearch.nodes.filter(item => item.category?._id === tempForm[codeIndex].value)
          }
        }else{
          if(subEles[targetTypeIndex].value === EPromotionTargetType.Item){
            subEles[indexItems].options = getItemsResult?.itemSearch.nodes
          }else if(subEles[targetTypeIndex].value === EPromotionTargetType.Option){
            subEles[indexItems].options = getOptionsResult?.optionSearch.nodes
          }
        }
        
      }
      return subEles
    })
  }
  return tempForm
}

  useEffect(() => {

    const newFormData = generateForm()
    setForm(newFormData)

  }, [data, isEdit, getCategoryStatus])

  if(loading || !form) return <p>Loading...</p>
  if(error) return <p>Error...</p>
  


  return (
    <Wrapper label={t("campaigns")}>
      <Link href="/campaigns"><span style={{textDecoration: 'underline', color: 'blue', display: 'flex', alignItems: 'center'}}> <KeyboardBackspaceIcon />{t("backToList")}</span></Link>
      <span style={{padding: '5px', display: 'flex', justifyContent: 'end'}}>
                {isEdit ? <Button classes='mr-2' label={t("cancel")} color='error' size='small' variant='contained' onClick={() =>  handleDelete()}/> : null}
                <Button label={t(isEdit ? 'save' : 'edit')} color='success' size='small' variant='contained' onClick={() => handleSave()}/>
            </span>
      <List sx={{width: '500px', backgroundColor: 'white', left: '30%'}}>

      <Form  form={form || []} handleChange={handleChanges} />
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

export default Campaign