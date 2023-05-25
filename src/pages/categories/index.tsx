import React from "react";
import { useQuery, gql, useMutation } from '@apollo/client';

import { Delete } from '@mui/icons-material';
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'


import Table from "@/components/Table";
import { Column } from "@/dataStructure/columns";
import { CategoryCreateInput, CategoryModel, FilePresignedUrlModel } from "@/dataStructure/categories";
import Button from "@/components/Button";
import Link from "next/link";
import { parseDate } from "@/utils/func";
import Wrapper from "@/components/Wrapper";
import Backdrop from "@/components/Backdrop";
import Form, { TextForm } from "@/components/Form";
import { useCreateCategory, useDeleteCategory } from "@/GraphQL/category";
import _ from "lodash";

const categoriesColumns = (delAction: Function): Column<CategoryModel>[] => [
    {
        label: "name",
        minWidth: 170,
        align: "left",
        render: (category: CategoryModel) => <Link href={`/categories/${category._id}`}><span style={{ textDecoration: 'underline' }}>{category.name}</span></Link>,
        alias: "name",

    },
    {
        label: "code",
        minWidth: 170,
        align: "left",
        render: (category: CategoryModel) => category.code,
        alias: "code",

    },
    {
        label: "createdAt",
        minWidth: 170,
        align: "left",
        render: (category: CategoryModel) => parseDate(category.createdAt),
        alias: "createdAt",

    },
    {
        label: "updatedAt",
        minWidth: 170,
        align: "left",
        render: (category: CategoryModel) => parseDate(category.updatedAt),
        alias: "updatedAt",

    },
    {
        label: "actions",
        minWidth: 170,
        align: "left",
        render: (category: CategoryModel) => <span>
            <Button label="" startIcon={<Delete />} onClick={() => delAction(category)} />
        </span>,
        alias: "updatedAt",

    }
]

const GET_CATEGORIES = gql`
  query categorySearch($paginationInput: OffsetPaginationInput! 
        $optionInput: OffsetPaginationOptionInput) {
            categorySearch(paginationInput: $paginationInput, optionInput: $optionInput) {
                nodes {
                    _id,
                    code,
                    createdAt,
                    isActive,
                    name,
                    updatedAt
                }
                pageNumber
                pageSize
                totalCount
            }
  }
`;

const CREATE_CATEGORY = gql`
mutation createCategory($input: CategoryCreateInput!) {
    createCategory(input: $input) {
        _id
        code
        ancestorIds
        name
        description
        parentId
        createdAt
        updatedAt
        isActive
        imageUrls
    }
    }

`

const DELETE_CATEGORY = gql`
    mutation deleteCategoryById($id: ObjectId!) {
        deleteCategoryById(id: $id) {
            success
            message
        }
}
`

const CategoriesForm: TextForm<CategoryModel>[] = [
    {
        label: "name",
        alias: "name",
        value: "",
        type: "text",
        required: true,
        fullWidth: true,
    },
    {
        label: "code",
        alias: "code",
        value: "",
        type: "text",
        required: true,
        fullWidth: true,
    },
    {
        label: "description",
        alias: "description",
        value: "",
        type: "text",
        required: false,
        fullWidth: true,
        multiline: true,
    }
]


const Categories: React.FC = () => {
    const { t } = useTranslation('common')
    const [form, setForm] = React.useState<TextForm<CategoryModel>[]>(CategoriesForm)
    const { loading, error, data, refetch } = useQuery(GET_CATEGORIES, {
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

    const { createCategory } = useCreateCategory({
        onCompleted: async (data: CategoryModel) => {
            refetch()
            handleClose()
        }
    })

    const { deleteCategory } = useDeleteCategory({
        onCompleted: async (data: CategoryModel) => {
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
        createCategory({ variables: { input: data } })
    }

    const delCategory = (category: CategoryModel) => {
        deleteCategory({ variables: { id: category._id } })
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newForm = _.cloneDeep(form)

        newForm[index].value = e.target.value
        setForm(newForm)
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error...</div>

    return <Wrapper label={t("categories")}>
        <Backdrop btnLabel={t('categoryObj.add') as string} show={open} update={updateOpen}>
            <Form isUploadImage
                form={form}
                saveBtnLabel={t("save") as string}
                cancelBtnLabel={t("cancel") as string}
                target="CATEGORY"
                cancelAction={handleClose}
                submitAction={handleSave}
                handleChange={handleFormChange}
            />
        </Backdrop>
        <Table rows={[...data.categorySearch.nodes]} columns={categoriesColumns(delCategory)} />
    </Wrapper>;
};

export const getServerSideProps = async ({ locale }: { locale: string }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? "vi", ["common"])),
        },
    };
};

export default Categories;