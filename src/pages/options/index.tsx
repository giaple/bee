import React, { useEffect } from "react";
import { useQuery, gql, useMutation } from '@apollo/client';

import { Delete } from '@mui/icons-material';

import Table from "@/components/Table";
import { Column } from "@/dataStructure/columns";
import { CategoryCreateInput, CategoryModel, ESortOrder, FilePresignedUrlModel, OptionCreateInput, OptionModel } from "@/dataStructure/categories";
import Button from "@/components/Button";
import Link from "next/link";
import { parseDate } from "@/utils/func";
import Wrapper from "@/components/Wrapper";
import Backdrop from "@/components/Backdrop";
import Form, { TextForm } from "@/components/Form";
import { useGetCategories } from "@/GraphQL/category";

import _ from 'lodash'
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const optionColumns = (delAction: Function): Column<OptionModel>[] => [
    {
        label: "name",
        minWidth: 170,
        align: "left",
        render: (option: OptionModel) => <Link href={`/options/${option._id}`}><span style={{ textDecoration: 'underline' }}>{option.name}</span></Link>,
        alias: "name",

    },
    {
        label: "categoryObj.name",
        minWidth: 170,
        align: "left",
        render: (option: OptionModel) => option.category?.name,
        alias: "category",

    },
    {
        label: "price",
        minWidth: 50,
        align: "left",
        render: (option: OptionModel) => option.price,
        alias: "price",
    },
    {
        label: "createdAt",
        minWidth: 100,
        align: "left",
        render: (option: OptionModel) => parseDate(option.createdAt),
        alias: "createdAt",

    },
    {
        label: "updatedAt",
        minWidth: 100,
        align: "left",
        render: (option: OptionModel) => parseDate(option.updatedAt),
        alias: "updatedAt",

    },
    {
        label: "actions",
        minWidth: 50,
        align: "left",
        render: (category: OptionModel) => <span>
            <Button label="" startIcon={<Delete />} onClick={() => delAction(category)} />
        </span>,
        alias: "updatedAt",

    }
]

const GET_OPTIONS = gql`
  query optionSearch($paginationInput: OffsetPaginationInput! 
        $optionInput: OffsetPaginationOptionInput) {
            optionSearch(paginationInput: $paginationInput, optionInput: $optionInput) {
                nodes {
                   _id
                   name
                   category {
                    _id
                    name
                   }
                   isActive
                    createdAt
                    updatedAt
                    price

                }
                pageNumber
                pageSize
                totalCount
            }
  }
`;

const CREATE_OPTION = gql`
mutation createOption($input: OptionCreateInput!) {
    createOption(input: $input) {
        _id
    }
    }

`

const DELETE_OPTION = gql`
    mutation deleteOptionById($id: ObjectId!) {
        deleteOptionById(id: $id) {
            success
            message
        }
}
`

const OptionForm = (options: CategoryModel[]) => ([
    {
        label: "name",
        alias: "name",
        value: "",
        type: "text",
        required: true,
        fullWidth: true,
    },
    {
        label: "categoryObj.name",
        alias: "categoryId",
        value: "",
        type: "dropdown",
        required: true,
        fullWidth: true,
        options: options
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

])


const Options: React.FC = () => {
    const { t } = useTranslation('common')
    const [form, setForm] = React.useState<TextForm<CategoryModel>[]>([])

    const { loading, error, data, refetch } = useQuery(GET_OPTIONS, {
        variables: {
            paginationInput: {
                limit: 3,
                pageNumber: 1,
                sortOrder: 'ASC'
            },
            optionInput: {
                isGetAll: true
            }
        }
    });

    const { getCategoryStatus, getCategoryError, getCategoryResult } = useGetCategories({
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

    const [mutate] = useMutation(CREATE_OPTION, {
        onCompleted: async (data: OptionModel) => {
            handleClose()
            refetch()
        }
    })

    const [mutateDelete] = useMutation(DELETE_OPTION, {
        onCompleted: () => {
            refetch()
        }
    })

    const [open, setOpen] = React.useState(false);
    const [updateOpen, setUpdateOpen] = React.useState('');

    const handleClose = () => {
        const tempDate = new Date();
        setOpen(false);
        setUpdateOpen(tempDate.toString())
    }

    const handleSave = (uploadedImages: FilePresignedUrlModel[]) => {
        const data: any = {}
        form.forEach(item => {
            data[item.alias] = item.type === 'number' && typeof item.value === 'string' ? parseInt(item.value) : item.value
        })

        const imgUrl = uploadedImages.map(item => {
            return item.cdnUrl
        })

        if (imgUrl.length > 0) {
            data['imageUrls'] = imgUrl
        }
        mutate({ variables: { input: data } })
    }

    const delCategory = (option: OptionModel) => {
        mutateDelete({ variables: { id: option._id } })
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newForm = _.cloneDeep(form)

        newForm[index].value = event.target.value
        setForm(newForm)

    }

    useEffect(() => {
        setForm(OptionForm(getCategoryResult?.categorySearch?.nodes || []))
    }, [getCategoryResult])

    if (loading || getCategoryStatus) return <div>Loading...</div>
    if (error || getCategoryError) return <div>Error...</div>


    return <Wrapper label={t('options')}>
        <Backdrop btnLabel={t("optionObj.add") as string} show={open} update={updateOpen}>
            <Form isUploadImage
                form={form}
                saveBtnLabel={t("save") as string}
                cancelBtnLabel={t("cancel") as string}
                target="OPTION"
                cancelAction={handleClose}
                submitAction={handleSave}
                handleChange={handleChange}
            />
        </Backdrop>
        <Table rows={[...data.optionSearch.nodes]} columns={optionColumns(delCategory)} />
    </Wrapper>;
};

export const getServerSideProps = async ({ locale }: { locale: string }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? "vi", ["common"])),
        },
    };
};

export default Options;