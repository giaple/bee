import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useQuery, gql, useMutation } from '@apollo/client';
import Wrapper from '@/components/Wrapper';
import Image from 'next/image';
import { Checkbox, Divider, FormControl, ImageList, ImageListItem, InputAdornment, InputLabel, List, ListItem, ListItemText, MenuItem, OutlinedInput, Select, Stack, TextField } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Button from '@/components/Button';
import { objectKeys, objectValues, parseDate } from '@/utils/func';
import { JobItemInput, JobItemOptionInput, PreBookingJobInput, JobItemOptionModel, JobItemModel, CartItemInput, CategoryModel, EJobStatus, ESortOrder, FilePresignedUrlModel, ItemModel, JobAssignWorkerInput, JobModel, JobUpdateInput, JobUpdateStatusInput, OptionModel, PreBookingJobModel, ECampaignType, AppliedCampaignInput, AppliedCampaignTargetInput } from '@/dataStructure/categories';
import UploadImage from '@/components/UploadImage';

import { useGetWorkers } from '@/GraphQL/worker';
import Form, { TextForm } from '@/components/Form';

import _ from 'lodash'
import { useGetOptions } from '@/GraphQL/option';
import { useGetItems } from '@/GraphQL/item';
import { useGetCampaigns } from '@/GraphQL/compaign';
import Backdrop from '@/components/Backdrop';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';


const GET_JOB_BY_ID = gql`
  query findJobById($id: ObjectId!) {
    findJobById(id: $id) {
                
        _id
        category {
            name
        }
        categoryId
        appliedCampaigns {
          code
        }
        transactionId
        phoneNumber
        customerName
        csId
        note
        adminNote
        address
        imageUrls
        status
        totalPrice
        finalTotalPrice
        totalDiscountPrice
        workImageUrls
        workerId
        metadata {
          utmCampaign
          utmMedium
          utmSource
        }
        items {
            name
            finalPrice
            quantity
            price
            refId
            options {
                name
                price
                finalPrice
                quantity
                refId
            }
        }
        metadata {
          utmSource
          utmMedium
          utmCampaign
        }
        startDate
        endDate
        createdAt
        updatedAt
            }
  }
`;

const UPDATE_JOB_BY_ID = gql`
  mutation updateJobById($id: ObjectId!, $input: JobUpdateInput!) {
    updateJobById(id: $id, input: $input) {
                _id
            }
  }
`;

const UPDATE_STATUS_BY_ID = gql`
  mutation updateJobStatusById($id: ObjectId!, $input: JobUpdateStatusInput!) {
    updateJobStatusById(id: $id, input: $input) {
                _id
            }
  }
`;

const UPDATE_WORKER_BY_ID = gql`
  mutation assignJobWorkerById($id: ObjectId!, $input: JobAssignWorkerInput!) {
    assignJobWorkerById(id: $id, input: $input) {
                _id
            }
  }
`;

const PRE_BOOKING_JOB = gql`
  mutation preBookingJob($input: PreBookingJobInput!) {
    preBookingJob(input: $input) {
      appliedCampaigns {
        code
        refId
        type
        appliedTargets {
            name
            condition
            promotionType
            refId
            targetType
            value
        }
    }
    totalPrice
    finalTotalPrice
    totalDiscountPrice
    totalEstTime
    items {
        refId
        name
        quantity
        price
        finalPrice
        options {
            refId
            name
            quantity
            price
            finalPrice
        }
    }
              }
  }
`;

const UPDATE_ITEMS_BY_ID = gql`
  mutation updateJobItemsById($id: ObjectId!, $input: JobItemsUpdateInput!) {
    updateJobItemsById(id: $id, input: $input) {
                _id
            }
  }
`;

const generateItemUpdateForm = (itemList?: ItemModel[], itemData?: JobItemModel, optionList?: OptionModel[]) => {
  return [{
    label: 'name',
    value: itemData ? itemData.refId : '',
    disabled: itemData ? true : false,
    fullWidth: true,
    alias: 'name',
    type: itemList ? 'dropdown' : 'text',
    options: itemList ? itemList.map((item) => ({ name: item.name, _id: item._id })) : [],
  }, {
    label: 'price',
    value: itemData ? itemData.price : 0,
    disabled: true,
    fullWidth: true,
    alias: 'price',
    type: 'number',
    hide: itemData ? false : true
  }, {
    label: 'finalPrice',
    value: itemData ? itemData.finalPrice : 0,
    disabled: true,
    fullWidth: true,
    alias: 'finalPrice',
    type: 'number',
    hide: itemData ? false : true
  }, {
    label: 'quantity',
    value: itemData ? itemData.quantity : 1,
    disabled: itemData ? true : false,
    fullWidth: true,
    alias: 'quantity',
    type: 'number',
  }, {
    label: 'options',
    value: '',
    disabled: itemData ? true : false,
    fullWidth: true,
    alias: 'options',
    type: 'subForm',
    _id: _.uniqueId('Options'),
    options: itemData?.options ? itemData.options.map(option => generateOptionUpdateForm(optionList, option)) : [],
  }]
}

const generateOptionUpdateForm = (optionList: OptionModel[], optionData?: JobItemOptionModel) => {
  return [{
    label: 'name',
    value: optionData?.refId,
    disabled: optionData ? true : false,
    fullWidth: true,
    alias: 'name',
    type: 'dropdown',
    options: optionList.map((option) => ({ name: option.name, _id: option._id })),
  }, {
    label: 'price',
    value: optionData?.price,
    disabled: true,
    fullWidth: true,
    alias: 'price',
    hide: optionData ? false : true,
    type: 'number',
  }, {
    label: 'finalPrice',
    value: optionData?.finalPrice,
    disabled: true,
    fullWidth: true,
    alias: 'finalPrice',
    hide: optionData ? false : true,
    type: 'number',
  }, {
    label: 'quantity',
    value: optionData?.quantity,
    disabled: optionData ? true : false,
    fullWidth: true,
    alias: 'quantity',
    type: 'number',
  }]
}

interface JobProps {
  findJobById: JobModel
}

interface FormProps {
  label: string;
  form: TextForm<Partial<JobModel>>[];
}

const Job = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { id } = router.query

  const [isStatusEdit, setStatusEdit] = React.useState(false)
  const [isItemsEdit, setItemsEdit] = React.useState(false)
  const [isAssigningEdit, setAssigningEdit] = React.useState(false)
  const [isGeneralEdit, setGeneralEdit] = React.useState(false)

  const { loading, error, data, refetch } = useQuery<JobProps>(GET_JOB_BY_ID, { variables: { id: id } });
  const { getWorkersResult } = useGetWorkers({
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

  const { getOptionsResult } = useGetOptions({
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

  const { getItemsResult } = useGetItems({
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

  const [mutate] = useMutation(UPDATE_JOB_BY_ID, {
    onCompleted: async (data: CategoryModel) => {

      refetch()
    }
  })

  const [mutateStatus] = useMutation(UPDATE_STATUS_BY_ID, {
    onCompleted: async (data: CategoryModel) => {

      refetch()

    }
  })

  const [mutateWorker] = useMutation(UPDATE_WORKER_BY_ID, {
    onCompleted: async (data: CategoryModel) => {

      refetch()
    }
  })

  const [mutateItems] = useMutation(UPDATE_ITEMS_BY_ID, {
    onCompleted: () => {

      refetch()
      setPricingData(undefined)
      setPricingModel(undefined)
      setItemsEdit(false)
    }
  })

  const [mutatePrice] = useMutation(PRE_BOOKING_JOB, {
    onCompleted: async (data: PreBookingJobModel) => {
      setPricingData(data)
    }
  })

  const [form, setForm] = React.useState<FormProps[]>()
  const [pricingData, setPricingData] = React.useState<{ preBookingJob: PreBookingJobModel }>()
  const [pricingModel, setPricingModel] = React.useState<TextForm<PreBookingJobModel>[]>()
  const imgRef = React.useRef<string[]>([])
  const imgWorkerRef = React.useRef<string[]>([])
  const [update, setUpdate] = React.useState('')

  const parseDataToForm = () => {
    if (!data) return
    imgRef.current = data.findJobById.imageUrls
    imgWorkerRef.current = data.findJobById.workImageUrls || []
    const newForm: FormProps[] = []

    const itemObject = data.findJobById['items']
    const categoryId = data.findJobById['categoryId']

    const generalForm: TextForm<Partial<JobModel>>[] = []

    const itemsForm: TextForm<Partial<JobModel>>[] = [{
      label: 'appliedCampaigns',
      value: data.findJobById['appliedCampaigns']?.map((campaign) => campaign.code).join(', ') || '',
      disabled: true,
      fullWidth: true,
      alias: 'appliedCampaigns',
      type: 'text',
    }, {
      label: 'finalTotalPrice',
      value: Number(data.findJobById['finalTotalPrice'] || '0'),
      disabled: true,
      fullWidth: true,
      alias: 'finalTotalPrice',
      hide: isItemsEdit,
    }, {
      label: 'totalDiscountPrice',
      value: data.findJobById['totalDiscountPrice'] | 0,
      disabled: true,
      fullWidth: true,
      alias: 'totalDiscountPrice',
      hide: isItemsEdit,
    }, {
      label: 'totalPrice',
      value: data.findJobById['totalPrice'] | 0,
      disabled: true,
      fullWidth: true,
      alias: 'totalPrice',
      hide: isItemsEdit,
    }, {
      label: 'items',
      alias: 'items',
      type: 'subForm',
      value: '',
      disabled: !isItemsEdit,
      options: itemObject.map((item) => {
        return objectKeys(item).reduce((acc, key) => {
          if (['__typename', 'refId'].includes(key)) return acc
          if (key === 'options') {
            return acc.concat([{
              label: key,
              value: '',
              disabled: !isItemsEdit,
              fullWidth: true,
              alias: key,
              type: 'subForm',
              _id: _.uniqueId('Options'),
              options: item[key]?.map((option) => objectKeys(option).reduce((optionAcc, optionKey) => {
                if (['__typename', 'refId'].includes(optionKey)) return optionAcc
                if (optionKey === 'name') return optionAcc.concat([{
                  label: optionKey,
                  value: option.refId,
                  disabled: !isItemsEdit,
                  hide: false,
                  fullWidth: true,
                  alias: optionKey,
                  type: 'dropdown',
                  options: getOptionsResult?.optionSearch.nodes.map((option) => ({ _id: option._id, name: option.name })) || []
                }])
                return optionAcc.concat([{
                  label: optionKey,
                  value: optionKey === 'quantity' ? Number(option[optionKey]) : option[optionKey],
                  disabled: !isItemsEdit,
                  hide: optionKey === 'quantity' ? false : isItemsEdit,
                  fullWidth: true,
                  alias: optionKey,
                  type: optionKey === 'quantity' ? 'number' : 'text',
                }])
              }, [] as Partial<TextForm<JobItemOptionModel>>[])) || []
            }])
          }
          if (key === 'name') {
            return acc.concat([{
              label: key,
              value: item.refId,
              disabled: !isItemsEdit,
              fullWidth: true,
              alias: key,
              type: 'dropdown',
              options: getItemsResult?.itemSearch.nodes.filter(item => item.categoryId === categoryId).map((item: ItemModel) => ({ _id: item._id, name: item.name })) || []
            }])
          }

          return acc.concat([{
            label: key,
            value: key === 'quantity' ? Number(item[key]) : item[key],
            disabled: key === 'quantity' ? !isItemsEdit : true,
            fullWidth: true,
            alias: key,
            type: key === 'quantity' ? 'number' : 'text',
            hide: key === 'quantity' ? false : isItemsEdit,
          }])
        }, [] as TextForm<Partial<JobItemModel>>[])
      })
    }]
    const statusForm: TextForm<Partial<JobModel>>[] = [{
      label: 'status',
      value: data.findJobById['status'],
      type: "dropdown",
      disabled: !isStatusEdit,
      fullWidth: true,
      alias: 'status',
      options: objectValues(EJobStatus).map((value) => ({ _id: value, name: value })),
    }, {
      label: 'startDate',
      value: data.findJobById['startDate'],
      type: "datetimepicker",
      disabled: !isStatusEdit,
      fullWidth: true,
      hide: true,
      alias: 'startDate',
    }]
    const assigningForm: TextForm<Partial<JobModel>>[] = [{
      label: 'workerObj.name',
      value: data.findJobById['workerId'],
      disabled: !isAssigningEdit,
      type: "dropdown",
      fullWidth: true,
      alias: 'workerId',
      options: getWorkersResult?.workerSearch.nodes.map((worker) => ({ _id: worker._id, name: worker.firstName + ' ' + worker.lastName }))
    }]

    objectKeys(data.findJobById).map((key) => {
      if (key === 'imageUrls' || key === '_id' || key === '__typename' || key === 'workImageUrls' || key === 'items' || key === 'category' || key === 'appliedCampaigns' || key === 'categoryId') return null
      if (key === 'workerId') return null
      if (key === 'status') return null

      if (key === 'transactionId') return generalForm.push({
        label: 'transactionId',
        value: data.findJobById[key],
        type: "link",
        disabled: true,
        fullWidth: true,
        defaultValue: 'transactions',
        hide: isGeneralEdit,
        alias: key
      })

      if (key === 'metadata') return generalForm.push({
        label: 'metadata',
        value: '',
        alias: key,
        type: 'subForm',
        disabled: true,
        fullWidth: true,
        hide: _.isEmpty(data.findJobById[key]) || isGeneralEdit,
        options: [objectKeys(data.findJobById[key] || undefined).map((subkey) => {
          return {
            label: subkey,
            value: data.findJobById[key] ? data.findJobById[key][subkey] : '',
            type: "text",
            disabled: true,
            fullWidth: true,
            hide: subkey === '__typename' ? true : isGeneralEdit,
            alias: subkey

          }
        })]
      })

      return generalForm.push({
        label: key,
        value: ['createdAt', 'updatedAt', 'startDate', 'endDate'].includes(key) ? parseDate(data.findJobById[key]) : data.findJobById[key],
        type: "text",
        disabled: key === 'address' || key === 'adminNote' ? !isGeneralEdit : true,
        fullWidth: true,
        hide: key !== 'address' && key !== 'adminNote' ? isGeneralEdit : false,
        alias: key
      })
    });

    newForm.push({ label: 'General', form: generalForm })
    newForm.push({ label: 'status', form: statusForm })
    newForm.push({ label: 'worker', form: assigningForm })
    newForm.push({ label: 'items', form: itemsForm })
    setForm(newForm)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, action: string, subIndex: number, id: string, key: string) => {

    const newForm = _.cloneDeep(form) as FormProps[]

    if (key === 'General' && newForm) {
      const generalFormIndex = newForm?.findIndex((form) => form.label === 'General')
      if (generalFormIndex === undefined) return
      const generalForm = newForm[generalFormIndex].form
      if (generalForm === undefined) return

      generalForm[index].value = e.target.value
      setForm(newForm)
      return
    }

    if (key === 'status' && newForm) {
      const statusFormIndex = newForm?.findIndex((form) => form.label === 'status')
      if (statusFormIndex === undefined) return
      const statusForm = newForm[statusFormIndex].form
      if (statusForm === undefined) return
      if (e.target.value === EJobStatus.Rescheduled) {
        statusForm[1].hide = false
      }
      statusForm[index].value = e.target.value
      setForm(newForm)
      return
    }

    if (key === 'worker' && newForm) {
      const workerFormIndex = newForm?.findIndex((form) => form.label === 'worker')
      if (workerFormIndex === undefined) return
      const workerForm = newForm[workerFormIndex].form
      if (workerForm === undefined) return

      workerForm[index].value = e.target.value
      setForm(newForm)
      return
    }

    if (key === 'items' && newForm) {
      const itemsFormIndex = newForm?.findIndex((form) => form.label === 'items')
      const itemsIndex = newForm[itemsFormIndex].form.findIndex((form) => form.alias === 'items')
      const categoryId = data?.findJobById.categoryId

      if (action === 'addSub') {
        if (id) {
          const ItemsOptions = newForm[itemsFormIndex].form[itemsIndex].options
          const updatedItems = ItemsOptions?.find((option) => option.find((item) => item._id === id))
          const updatedOptions = updatedItems?.find((item) => item._id === id)
          updatedOptions?.options?.push(generateOptionUpdateForm(getOptionsResult?.optionSearch.nodes.filter(item => item.categoryId === categoryId) || []))
          setForm(newForm)
          return
        }
        if (itemsFormIndex === undefined) return
        const itemsForm = newForm[itemsFormIndex].form
        if (itemsForm === undefined) return

        itemsForm[index].options?.push(generateItemUpdateForm(getItemsResult?.itemSearch.nodes.filter(item => item.categoryId === categoryId) || []))
        setForm(newForm)
        return
      }

      if (action === 'delSub') {
        if (id) {
          const ItemsOptions = newForm[itemsFormIndex].form[itemsIndex].options
          const updatedItems = ItemsOptions?.find((option) => option.find((item) => item._id === id))
          const updatedOptions = updatedItems?.find((item) => item._id === id)
          updatedOptions?.options?.splice(index, 1)
          setForm(newForm)
          return
        }
        if (itemsFormIndex === undefined) return
        newForm[itemsFormIndex].form[itemsIndex].options?.splice(index, 1)
        setForm(newForm)
        return
      }

      if (id) {
        const ItemsOptions = newForm[itemsFormIndex].form[itemsIndex].options
        const updatedItems = ItemsOptions?.find((option) => option.find((item) => item._id === id))
        const updatedOptions = updatedItems?.find((item) => item._id === id)

        if (!updatedOptions?.options) return

        updatedOptions.options[subIndex][index].value = e.target.value
        setForm(newForm)
        return
      }

      const itemsForm = newForm[itemsFormIndex].form
      const items = itemsForm[itemsIndex].options?.[subIndex]
      items[index].value = e.target.value
      setForm(newForm)

    }

  }

  const saveGeneral = () => {

    const newForm = _.cloneDeep(form)
    const updateData: Partial<JobUpdateInput> = {}
    if (newForm === undefined) return
    const generalForm = newForm?.find((form) => form.label === 'General')

    updateData.address = generalForm?.form.find(item => item.alias === 'address')?.value as string || ''
    updateData.adminNote = generalForm?.form.find(item => item.alias === 'adminNote')?.value as string || ''

    updateData.imageUrls = imgRef.current
    updateData.workImageUrls = imgWorkerRef.current

    mutate({
      variables: {
        id: id,
        input: {
          ...updateData
        }
      }
    })

    setGeneralEdit(false)


  }

  const saveStatus = () => {
    const newForm = _.cloneDeep(form)
    const updateData: Partial<JobUpdateStatusInput> = {}
    if (newForm === undefined) return
    const statusForm = newForm?.find((form) => form.label === 'status')

    updateData.status = statusForm?.form.find(item => item.alias === 'status')?.value as EJobStatus
    if (updateData.status === EJobStatus.Rescheduled) updateData.startDate = statusForm?.form.find(item => item.alias === 'startDate')?.value.toDate()

    mutateStatus({
      variables: {
        id: id,
        input: {
          ...updateData
        }
      }
    })

    setStatusEdit(false)
  }
  const saveWorker = () => {

    const newForm = _.cloneDeep(form)
    const updateData: Partial<JobAssignWorkerInput> = {}
    if (newForm === undefined) return
    const workerForm = newForm?.find((form) => form.label === 'worker')

    updateData.workerId = workerForm?.form.find(item => item.alias === 'workerId')?.value as string

    mutateWorker({
      variables: {
        id: id,
        input: {
          ...updateData
        }
      }
    })

    setAssigningEdit(false)
  }
  const saveItems = () => {

    const updateItemsData = objectKeys(pricingData?.preBookingJob).reduce((acc, key) => {
      if (key === '__typename') return acc
      if (key === 'appliedCampaigns') {
        const appliedCampaigns = pricingData?.preBookingJob[key]?.map(item => {
          return objectKeys(item).reduce((accItem, keyItem) => {
            if (keyItem === '__typename') return accItem
            if (keyItem === 'appliedTargets') {
              accItem[keyItem] = item[keyItem]?.map((target) => {
                return objectKeys(target).reduce((accTarget, keyTarget) => {
                  if (keyTarget === '__typename') return accTarget
                  accTarget[keyTarget] = target[keyTarget]
                  return accTarget
                }, {} as AppliedCampaignTargetInput)
              })
              return accItem
            }

            accItem[keyItem] = item[keyItem]
            return accItem
          }, {} as AppliedCampaignInput)
        })
        acc[key] = appliedCampaigns
        return acc
      }
      if (key === 'items') {
        const items = pricingData?.preBookingJob[key].map((item) => {
          return objectKeys(item).reduce((accItem, keyItem) => {
            if (keyItem === '__typename') return accItem
            if (keyItem === 'options') {
              accItem[keyItem] = item[keyItem]?.map((option) => {
                return objectKeys(option).reduce((accOption, keyOption) => {
                  if (keyOption === '__typename') return accOption
                  if (keyOption === 'quantity') {
                    accOption[keyOption] = Number(option[keyOption])
                    return accOption
                  }

                  accOption[keyOption] = option[keyOption]

                  return accOption
                }, {} as JobItemOptionInput)
              })
              return accItem
            }
            if (keyItem === 'quantity') {
              accItem[keyItem] = Number(item[keyItem])
              return accItem
            }
            accItem[keyItem] = item[keyItem]
            return accItem
          }, {} as JobItemInput)
        })

        acc[key] = items

      } else {
        acc[key] = pricingData?.preBookingJob[key]
      }
      return acc
    }, {})
    mutateItems({
      variables: {
        id: id,
        input: {
          ...updateItemsData
        }
      }
    })
  }

  const handleSave = (key: string) => {
    if (key === 'General') return saveGeneral()
    if (key === 'status') return saveStatus()
    if (key === 'worker') return saveWorker()

    const inputData: Partial<PreBookingJobInput> = {}
    const itemsData: Partial<CartItemInput>[] = []

    if (!form) return

    const itemsFormIndex = form?.findIndex((form) => form.label === 'items')
    if (itemsFormIndex === undefined) return
    const items = form[itemsFormIndex].form.find((form) => form.alias === 'items')
    items?.options?.forEach((item) => {
      const itemData: Partial<CartItemInput> = {}
      itemData.id = item.find((item) => item.alias === 'name').value

      itemData.options = item.find(item => item.alias === 'options').options?.map((option) => {
        const optionData = {
          id: '',
          quantity: 0
        }

        const idOption = option.find((item) => item.alias === 'name').value
        const quantityOption = option.find((item) => item.alias === 'quantity').value

        optionData.id = idOption
        optionData.quantity = Number(quantityOption)
        return optionData
      }) || []
      itemData.quantity = Number(item.find((item) => item.alias === 'quantity').value)
      itemsData.push(itemData)

    })
    inputData.items = itemsData
    inputData.campaignCode = data?.findJobById.appliedCampaigns?.map((campaign) => { if (campaign.type !== ECampaignType.Category) return campaign.code }).filter(item => item).join(', ') || ''
    inputData.categoryId = data?.findJobById.categoryId || ''

    mutatePrice({
      variables: {
        input: { ...inputData }
      }
    })
  }

  const handleUpload = (uploadFiles: FilePresignedUrlModel[]) => {
    const urls = uploadFiles.map((file) => file.cdnUrl)
    imgRef.current = [...imgRef.current, ...urls]
  }

  const handleUploadWork = (uploadFiles: FilePresignedUrlModel[]) => {
    const urls = uploadFiles.map((file) => file.cdnUrl)
    imgWorkerRef.current = [...imgWorkerRef.current, ...urls]
  }

  const checkEdit = (key: string) => {
    if (key === 'status') return isStatusEdit
    if (key === 'items') return isItemsEdit
    if (key === 'worker') return isAssigningEdit
    return isGeneralEdit
  }

  const changeToEdit = (key: string) => {
    if (key === 'status') return setStatusEdit(!isStatusEdit)
    if (key === 'items') return setItemsEdit(!isItemsEdit)
    if (key === 'worker') return setAssigningEdit(!isAssigningEdit)
    return setGeneralEdit(!isGeneralEdit)
  }

  const isEditAble = (key: string) => {
    if (key === 'status' && (isItemsEdit || isAssigningEdit || isGeneralEdit)) return false
    if (key === 'items' && (isAssigningEdit || isGeneralEdit || isStatusEdit)) return false
    if (key === 'worker' && (isGeneralEdit || isItemsEdit || isStatusEdit)) return false
    if (key === 'General' && (isAssigningEdit || isItemsEdit || isStatusEdit)) return false
    return true
  }

  const cancelUpdateItem = () => {
    setPricingData(undefined)
    setPricingModel(undefined)
  }
  useEffect(() => {
    if (!data) return

    imgRef.current = data.findJobById.imageUrls
    imgWorkerRef.current = data.findJobById.workImageUrls || []

  }, [data])

  useEffect(() => {
    parseDataToForm()
  }, [data, getWorkersResult, getItemsResult, isGeneralEdit, isStatusEdit, isItemsEdit, isAssigningEdit])

  useEffect(() => {

    if (!pricingData) return


    const newForm: TextForm<PreBookingJobModel>[] = [{
      label: 'appliedCampaigns',
      alias: 'appliedCampaigns',
      fullWidth: true,
      value: pricingData?.preBookingJob?.appliedCampaigns?.map((campaign) => { if (campaign.type !== ECampaignType.Category) return campaign.code }).filter(item => item).join(', ') || '',
      type: 'text',
      disabled: true
    },
    {
      label: 'totalPrice',
      alias: 'totalPrice',
      fullWidth: true,
      value: pricingData?.preBookingJob?.totalPrice || 0,
      type: 'text',
      disabled: true
    },
    {
      label: 'finalTotalPrice',
      alias: 'finalTotalPrice',
      fullWidth: true,
      value: pricingData?.preBookingJob?.finalTotalPrice || 0,
      type: 'text',
      disabled: true
    },
    {
      label: 'totalDiscountPrice',
      alias: 'totalDiscountPrice',
      fullWidth: true,
      value: pricingData?.preBookingJob?.totalDiscountPrice || 0,
      type: 'text',
      disabled: true
    },
    {
      label: 'items',
      alias: 'items',
      value: '',
      type: 'subForm',
      disabled: true,
      options: pricingData?.preBookingJob?.items?.map((item) => {
        return generateItemUpdateForm(getItemsResult?.itemSearch.nodes, item, getOptionsResult?.optionSearch.nodes)
      }) || []
    }]

    setPricingModel(newForm)
    setUpdate(_.uniqueId('update'))
  }, [pricingData])

  if (loading || !form) return <p>Loading...</p>
  if (error) return <p>Error...</p>

  return (
    <Wrapper label={t("jobs")}>
      <Link href="/jobs"><span style={{ textDecoration: 'underline', color: 'blue', display: 'flex', alignItems: 'center' }}> <KeyboardBackspaceIcon />{t("backToList")}</span></Link>
      <Divider />
      <List sx={{ width: '500px', backgroundColor: 'white', left: '30%' }}>
        {form.map((item, index) => {
          return <div key={index}>
            <div style={{ display: 'flex' }}>
              {checkEdit(item.label) ? <Button fullWidth={true} variant="contained" color="error" label={t("cancel")} onClick={() => { changeToEdit(item.label) }} /> : null}
              <Button fullWidth={true} variant="contained" color="primary" label={t(checkEdit(item.label) ? 'save' : 'edit')}
                disabled={!isEditAble(item.label)}
                onClick={() => {
                  if (checkEdit(item.label)) {
                    handleSave(item.label)
                    return
                  }
                  changeToEdit(item.label)
                }
                } />
            </div>

            <Form form={item.form} handleChange={(e, index, action, subindex, id) => { handleChange(e, index, action, subindex, id, item.label) }} />
          </div>
        })
        }
      </List>
      <Backdrop show={pricingModel ? true : false} update={update}>
        <Form form={pricingModel || []} handleChange={() => { }} saveBtnLabel='Save' cancelBtnLabel='Cancel' cancelAction={cancelUpdateItem} submitAction={saveItems} />
      </Backdrop>
      <Divider />
      {!isGeneralEdit ? <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <div>
          <div style={{ color: '#000000' }}>Images</div>
          {
            data?.findJobById.imageUrls ? <ImageList sx={{ width: 500, height: 250 }} cols={3} rowHeight={164}>
              {data?.findJobById.imageUrls.map((img: string) => (
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
        </div>

        <div >
          <div style={{ color: '#000000' }}>Work Images</div>
          {
            data?.findJobById.workImageUrls ? <ImageList sx={{ width: 500, height: 250 }} cols={3} rowHeight={164}>
              {data?.findJobById.workImageUrls.map((img: string) => (
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

        </div>
      </div> : <>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <>
            <span style={{ color: '#000000' }}>Image</span>
            <UploadImage uploadAction={handleUpload} target={'JOB'} uploadedImages={imgRef.current.map(url => ({ cdnUrl: url })) || []} />
          </>
          <>
            <span style={{ color: '#000000' }}>Work Image</span>
            <UploadImage uploadAction={handleUploadWork} target={'JOB'} uploadedImages={imgWorkerRef.current?.map(url => ({ cdnUrl: url })) || []} />
          </>

        </div>
      </>}
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

export default Job