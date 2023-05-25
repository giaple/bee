import React, { useEffect } from "react";
import { useQuery, gql, useMutation } from '@apollo/client';

import { Delete} from '@mui/icons-material';

import Table from "@/components/Table";
import { Column } from "@/dataStructure/columns";
import { CategoryModel, ESortOrder, FilePresignedUrlModel, ItemCreateInput, ItemModel, OptionCreateInput, OptionModel } from "@/dataStructure/categories";
import Button from "@/components/Button";
import Link from "next/link";
import { parseDate } from "@/utils/func";
import Wrapper from "@/components/Wrapper";
import Backdrop from "@/components/Backdrop";
import Form, { TextForm } from "@/components/Form";
import { useGetOptions } from "@/GraphQL/option";
import { useCreateItem, useDeleteItem, useGetItems } from "@/GraphQL/item";
import { useGetCategories } from "@/GraphQL/category";

import _ from 'lodash'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const optionColumns = (delAction: Function) : Column<ItemModel>[] => [
    {
        label: "name",
        minWidth: 170,
        align: "left",
        render: (option: ItemModel) => <Link href={`/items/${option._id}`}><span style={{textDecoration: 'underline'}}>{option.name}</span></Link>,
        alias: "name",

    },
    {
        label: "category",
        minWidth: 170,
        align: "left",
        render: (option: ItemModel) => option.category?.name,
        alias: "category",

    },
    {
        label: "options",
        minWidth: 170,
        align: "left",
        render: (option: ItemModel) => option.options?.map((option) => option.name).join(", "),
        alias: "options",

    },
    {
        label: "price",
        minWidth: 50,
        align: "left",
        render: (option: ItemModel) => option.price,
        alias: "price",
    },
    {
        label: "actions",
        minWidth: 50,
        align: "left",
        render: (category: ItemModel) => <span>
            <Button label="" startIcon={<Delete />} onClick={() => delAction(category)}/>
        </span>,
        alias: "updatedAt",

    }
]

const generateItemForm =  (categories: CategoryModel[], options: OptionModel[]) => ([
    {
        label: "name",
        alias: "name",
        value: "",
        type: "text",
        required: true,
        fullWidth: true,
    },
    {
        label: "subName",
        alias: "subName",
        value: "",
        type: "text",
        required: true,
        fullWidth: true,
    },
    {
        label: "tag",
        alias: "tags",
        value: "",
        type: "text",
        required: true,
        fullWidth: true,
    },
    {
        label: "category",
        alias: "categoryId",
        value: "",
        type: "dropdown",
        required: true,
        fullWidth: true,
        options: categories
    },
    {
        label: "options",
        alias: "optionIds",
        value: [],
        type: "dropdown",
        required: true,
        disabled: true,
        fullWidth: true,
        options: options,
        multiSelect: true
    },
    {
        label: "price",
        alias: "price",
        value: "",
        type: "number",
        required: true,
        fullWidth: true,
    },
    {
        label: "minQuantity",
        alias: "minQuantity",
        value: "",
        type: "number",
        required: true,
        fullWidth: true,
    },
    {
        label: "maxQuantity",
        alias: "maxQuantity",
        value: "",
        type: "number",
        required: true,
        fullWidth: true,
    },
    {
        label: "estTime",
        alias: "estTime",
        value: "",
        type: "number",
        required: true,
        fullWidth: true,
    },
    {
        label: "uploadContentImage",
        alias: "content",
        value: "",
        type: "image",
        required: true,
        fullWidth: true,
    },
    {
        label: "uploadImage",
        alias: "imageUrls",
        value: [],
        type: "image",
        required: true,
        fullWidth: true,
    }

]) as TextForm<ItemModel>[]


const Items: React.FC = () => {
    const { t } = useTranslation('common')
    const [form, setForm] = React.useState<TextForm<ItemModel>[]>(generateItemForm([], []))
    const { getItemsStatus, getItemsRefetch, getItemsError, getItemsResult } = useGetItems({ variables: { paginationInput: {
        limit: 3,
        pageNumber: 1,
    },
    optionInput: {
        isGetAll: true
    } } });

    const { getCategoryStatus, getCategoryError, getCategoryResult } = useGetCategories({ variables: { paginationInput: {
        limit: 3,
        pageNumber: 1,
    },
    optionInput: {
        isGetAll: true
    } } });

    const { getOptionsResult, getOptionsError, getOptionsStatus } = useGetOptions({ variables: { paginationInput: {
        limit: 3,
        pageNumber: 1,
    },
    optionInput: {
        isGetAll: true
    } } });

    const {createItem} = useCreateItem( {
        onCompleted: async (data: OptionModel) => {
            handleClose()
            getItemsRefetch()
        }
    })

    const {deleteItem} = useDeleteItem( {
        onCompleted: () => {
            getItemsRefetch()
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

        const data: any = {}
        form.forEach(item => {
            data[item.alias] = item.type === 'number' && typeof item.value === 'string' ? parseInt(item.value) : item.value
        })

        if(data.imageUrls.length > 0) {
            const urlList = data.imageUrls.map((item: any) => {
                return item.cdnUrl
            })

            data.imageUrls = urlList
        }


        createItem({variables: {input: data}})
    }

    const delCategory = (item: OptionModel) => {
        deleteItem({variables: {id: item._id}})
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newForm = _.cloneDeep(form)
        
        newForm[index].value = e.target.value

        if(newForm[index].label === 'category') {
            const optionIndex = newForm.findIndex((item: TextForm<ItemModel> )=> item.label === 'options')
            if(optionIndex !== -1) {
                newForm[optionIndex].options = getOptionsResult?.optionSearch?.nodes.filter((option: OptionModel) => option.categoryId === e.target.value)
                newForm[optionIndex].disabled = false
            }
        }

        setForm(newForm)
    }

    useEffect(() => {
        setForm(generateItemForm(getCategoryResult?.categorySearch?.nodes || [], getOptionsResult?.optionSearch?.nodes || []))
    }, [getOptionsResult, getCategoryResult])

    if(getItemsStatus || getOptionsStatus) return <div>Loading...</div>
    if(getItemsError || getOptionsError) return <div>Error...</div>


  return <Wrapper label={t("items")}>
    <Backdrop btnLabel={t("itemObj.add") as string} show={open} update={updateOpen}>
        <Form 
            form={form} 
            saveBtnLabel={t("save") as string}
            cancelBtnLabel={t("cancel") as string}
            target="ITEM"
            cancelAction={handleClose}
            submitAction={handleSave}
            handleChange={handleChange}
        />
    </Backdrop>
    <Table rows={getItemsResult?.itemSearch?.nodes || []} columns={optionColumns(delCategory)}/>
    </Wrapper>;
};

export const getServerSideProps = async ({ locale }: { locale: string }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? "vi", ["common"])),
      },
    };
  }

export default Items;