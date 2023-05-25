import React, { useState } from "react";

import { Delete } from '@mui/icons-material';

import Table from "@/components/Table";
import { Column } from "@/dataStructure/columns";
import { CampaignModel, CategoryModel, EJobStatus, ESortOrder, ItemModel, JobCreateInput, JobItemInput, JobItemOptionInput, JobModel, OptionCreateInput, OptionModel } from "@/dataStructure/categories";
import Button from "@/components/Button";
import Link from "next/link";
import { makeid, parseDate } from "@/utils/func";
import Wrapper from "@/components/Wrapper";
import Backdrop from "@/components/Backdrop";
import Form from "@/components/Form";
import { useGetOptions } from "@/GraphQL/option";
import { useCreateItem, useDeleteItem, useGetItems } from "@/GraphQL/item";
import { useGetCategories } from "@/GraphQL/category";
import { useGetCustomers } from "@/GraphQL/customer";
import { useCreateJob, useGetJobs } from "@/GraphQL/job";
import { useGetCampaigns } from "@/GraphQL/compaign";

import _, { set } from "lodash";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const optionColumns = (transFunc: Function, delAction: Function): Column<JobModel>[] => [
  {
    label: "csId",
    minWidth: 170,
    align: "left",
    render: (option: JobModel) => <Link href={`/jobs/${option._id}`}><span style={{ textDecoration: 'underline' }}>{option.csId}</span></Link>,
    alias: "csId",

  },
  {
    label: "customerName",
    minWidth: 170,
    align: "left",
    render: (option: JobModel) => option.customerName,
    alias: "customerName",

  },

  {
    label: "phoneNumber",
    minWidth: 50,
    align: "left",
    render: (option: JobModel) => option.phoneNumber,
    alias: "phoneNumber",
  },
  {
    label: "address",
    minWidth: 170,
    align: "left",
    render: (option: JobModel) => option.address,
    alias: "address",

  },
  {
    label: "totalPrice",
    minWidth: 50,
    align: "left",
    render: (option: JobModel) => option.totalPrice,
    alias: "totalPrice",

  },
  {
    label: "totalDiscountPrice",
    minWidth: 50,
    align: "left",
    render: (option: JobModel) => option.totalDiscountPrice,
    alias: "totalDiscountPrice",

  },
  {
    label: "finalTotalPrice",
    minWidth: 50,
    align: "left",
    render: (option: JobModel) => option.finalTotalPrice,
    alias: "finalTotalPrice",
  },
  {
    label: "startDate",
    minWidth: 50,
    align: "left",
    render: (option: JobModel) => parseDate(option.startDate),
    alias: "startDate",
  },
  {
    label: "endDate",
    minWidth: 50,
    align: "left",
    render: (option: JobModel) => parseDate(option.endDate),
    alias: "endDate",
  },
  {
    label: "status",
    minWidth: 50,
    align: "left",
    render: (option: JobModel) => transFunc(option.status),
    alias: "status",
  },
  {
    label: "actions",
    minWidth: 50,
    align: "left",
    render: (category: JobModel) => <span>
      <Button label="" startIcon={<Delete />} onClick={() => delAction(category)} />
    </span>,
    alias: "updatedAt",

  }
]

const JobForm = () => ([
  {
    label: "customerName",
    alias: "customerName",
    value: "",
    type: "text",
    fullWidth: true,
  },
  {
    label: "phoneNumber",
    alias: "phoneNumber",
    value: "",
    type: "text",
    fullWidth: true,
  },
  {
    label: "address",
    alias: "address",
    value: "",
    type: "text",
    fullWidth: true,
  },
  {
    label: "startDate",
    alias: "startDate",
    value: "",
    type: "datetimepicker",
  },
  {
    label: "endDate",
    alias: "endDate",
    value: "",
    type: "datetimepicker",
  },
  {
    label: "totalPrice",
    alias: "totalPrice",
    value: "",
    type: "number",
    fullWidth: true,
  },
  {
    label: "totalDiscountPrice",
    alias: "totalDiscountPrice",
    value: "",
    type: "number",
    fullWidth: true,
  },
  {
    label: "finalTotalPrice",
    alias: "finalTotalPrice",
    value: "",
    type: "number",
    fullWidth: true,
  },
  {
    label: "note",
    alias: "note",
    value: "",
    type: "text",
    fullWidth: true,
  },
])

const MetaDataForm = [
  {
    label: 'utmCampaign',
    alias: 'utmCampaign',
    value: '',
    type: 'text',
    fullWidth: true,
  },
  {
    label: 'utmMedium',
    alias: 'utmMedium',
    value: '',
    type: 'text',
    fullWidth: true,
  },
  {
    label: 'utmSource',
    alias: 'utmSource',
    value: '',
    type: 'text',
    fullWidth: true,
  },
]

const JobMetaDataForm = [{
  label: 'Meta Data',
  alias: 'metaData',
  value: '',
  type: 'subForm',
  options: [MetaDataForm],
  fullWidth: true,
}]



const jobItemOptionForm = (listOptions: OptionModel[]) => [{
  label: "name",
  alias: "refId",
  value: "",
  type: "dropdown",
  fullWidth: true,
  options: listOptions.map((option: OptionModel) => ({_id: option._id, name: option.name})),
}, {
  label: "quantity",
  alias: "quantity",
  value: "",
  type: "number",
  fullWidth: true,
}, {
  label: "finalPrice",
  alias: "finalPrice",
  value: "",
  type: "number",
  fullWidth: true,
}, {
  label: "price",
  alias: "price",
  value: "",
  type: "number",
  fullWidth: true,
}]

const JobItemsForm =(listItems: ItemModel[]) => [{
  label: "name",
  alias: "refId",
  value: "",
  type: "dropdown",
  fullWidth: true,
  options: listItems.map((item: ItemModel) => ({_id: item._id, name: item.name}))
}, {
  label: "quantity",
  alias: "quantity",
  value: "",
  type: "number",
  fullWidth: true,
}, {
  label: "price",
  alias: "price",
  value: "",
  type: "number",
  fullWidth: true,
}, {
  label: "finalPrice",
  alias: "finalPrice",
  value: "",
  type: "number",
  fullWidth: true,
},{
  label: "options",
  alias: "options",
  value: "",
  _id: makeid(10),
  type: "subForm",
  parent: "Job Items",
  options: [],
  listRender: [],
  fullWidth: true,
}]

const ItemForm = [{
  label: "Items",
  type: "subForm",
  alias: "items",
  value: "",
  options: [],
  fullWidth: true,
}]

const listOfNumber = ['price', 'totalPrice', 'finalPrice', 'finalTotalPrice', 'quantity','totalDiscountPrice']

const Jobs: React.FC = () => {

  const [form, setForm] = useState(JobForm())
  const [metaDataForm, setJobMetaDataForm] = useState(MetaDataForm)
  const [itemForm, setItemForm] = useState(ItemForm)

  const { t } = useTranslation('common')
  const { getJobsResult, getJobsError, getJobsStatus, getJobsRefetch } = useGetJobs({
    variables: {
      paginationInput: {
        limit: 3,
        pageNumber: 1,
      },
      optionInput: {
        isGetAll: true
      }
    }
  });

  const {getItemsResult, getItemsError, getItemsStatus, getItemsRefetch} = useGetItems({
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

  const {getOptionsResult} = useGetOptions({
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


  const { createJob } = useCreateJob({
    onCompleted: async (data: OptionModel) => {
      handleClose()
      setForm(JobForm())
      setJobMetaDataForm(MetaDataForm)
      setItemForm(ItemForm)
      getJobsRefetch()
    }
  })

  const { deleteItem } = useDeleteItem({
    onCompleted: () => {
      getJobsRefetch()
    }
  })

  const [open, setOpen] = React.useState(false);
  const [updateOpen, setUpdateOpen] = React.useState('');

  const handleClose = () => {
    const tempDate = new Date();
    setOpen(false);
    setUpdateOpen(tempDate.toString())
  }

  const handleSave = () => {
    const data : Partial<JobCreateInput> = {
      metadata: {},
      items: []
    }

    form.map(item => {
      if(item.alias === '__typename') return
      if(item.alias === 'startDate' || item.alias === 'endDate'){
        data[item.alias] = item.value.toDate()
        return
      }
      if(listOfNumber.includes(item.alias)) {
        data[item.alias] = Number(item.value)
        return
      }

      data[item.alias] = item.value

    })

    metaDataForm.map(item => {
      data.metadata[item.alias] = item.value
    })

    data.items = itemForm[0].options.map(item => {
      const tempItem : Partial<JobItemInput> = {}
      item.map(itemData => {
        if(itemData.alias === '__typename') return
        if(itemData.alias === 'options') {
          let jobOptionDataList : Partial<JobItemOptionInput>[] = []
          jobOptionDataList = itemData.options.map(option => {
            let jobOptionData : Partial<JobItemOptionInput> = {}
            option.map(temp => {
              if(temp.alias === '__typename') return
              if(listOfNumber.includes(temp.alias)) {
                jobOptionData[temp.alias] = Number(temp.value)
                return
              }
              if(temp.alias === 'refId') {
                jobOptionData[temp.alias] = temp.value
                const selectedOption = getOptionsResult?.optionSearch.nodes.find(option => option._id === temp.value)
                jobOptionData.name = selectedOption?.name
                return
              }
              jobOptionData[temp.alias] = temp.value
              return
            })
            return jobOptionData
          })
          tempItem.options = jobOptionDataList
          return
        }
        if(listOfNumber.includes(itemData.alias)) {
          tempItem[itemData.alias] = Number(itemData.value)
          return
        }
        if(itemData.alias === 'refId') {
          tempItem[itemData.alias] = itemData.value
          const selectedItem = getItemsResult?.itemSearch.nodes.find(item => item._id === itemData.value)
          tempItem.name = selectedItem?.name
          return
        }
        tempItem[itemData.alias] = itemData.value
      })
      return tempItem
    })

    data.categoryId = getItemsResult?.itemSearch.nodes[0].categoryId

    createJob({ variables: { input: data } })
  }

  const delCategory = (item: OptionModel) => {
    deleteItem({ variables: { id: item._id } })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, action: string, subIndex: number, id: string, key: string) => {
    
    if(key === 'items'){
      const tempForm = _.cloneDeep(itemForm)
      if(action === 'addSub' && !id){
        const tempSubForm = _.cloneDeep(JobItemsForm(getItemsResult?.itemSearch?.nodes || []))
        tempForm[0].options.push(tempSubForm)
        setItemForm(tempForm)
        return
      }
      if(action === 'addSub' && id){
        const tempSubForm = _.cloneDeep(jobItemOptionForm(getOptionsResult?.optionSearch?.nodes || []))
        tempForm[0].options[subIndex][index].options.push(tempSubForm)
        setItemForm(tempForm)
        return
      }

      if(action === 'delSub' && !id){
        tempForm[0].options.splice(index, 1)
        setItemForm(tempForm)
        return
      }

      if(action === 'delSub' && id){
        
        const updatedItem = tempForm[0].options.find(item => item.find(subItem => subItem._id === id))
        if(!updatedItem) return
        updatedItem[subIndex].options.splice(index, 1)
        setItemForm(tempForm)
        return
      }

      if(!id) {
        tempForm[0].options[subIndex][index].value = e.target.value
        setItemForm(tempForm)
      }else{
        const updatedItem = tempForm[0].options.find(item => item.find(subItem => subItem._id === id))
        console.log('updatedItem', updatedItem, index, subIndex)
        updatedItem[4].options[subIndex][index].value = e.target.value
        setItemForm(tempForm)
        return
      }

    }else if(key === 'metadata'){
      const tempForm = _.cloneDeep(metaDataForm)
      tempForm[index].value = e.target.value
      setJobMetaDataForm(tempForm)
      return
    }else{
      const tempForm = _.cloneDeep(form)
      tempForm[index].value = e.target.value
      setForm(tempForm)
    }

  }


  if (getJobsStatus ) return <div>Loading...</div>
  if (getJobsError) return <div>Error...</div>


  return <Wrapper label="Jobs">
    <Backdrop btnLabel="Create New Job" show={open} update={updateOpen}>
      <div style={{maxHeight: '100%', overflow: 'scroll'}}>
        <Form 
              target="Job"
              form={form} 
              handleChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, action: string, subIndex: number, id: string) => handleChange(e,index,action,subIndex,id,'general')}
          />
          <Form 
              form={metaDataForm} 
              handleChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, action: string, subIndex: number, id: string) => handleChange(e,index,action,subIndex,id,'metadata')}
          />
          <Form 
              form={itemForm} 
              handleChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, action: string, subIndex: number, id: string) => handleChange(e,index,action,subIndex,id,'items')}
              saveBtnLabel={t("save") as string} 
              cancelBtnLabel={t("cancel") as string} 
              cancelAction={handleClose}
              submitAction={handleSave}
          />

      </div>
        
    </Backdrop>
    <Table rows={getJobsResult?.jobSearch?.nodes || []} columns={optionColumns(t, delCategory)} />
  </Wrapper>;
};

export const getServerSideProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "vi", ["common"])),
    },
  };
}

export default Jobs;