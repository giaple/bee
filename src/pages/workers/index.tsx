import React, { use, useEffect } from "react";
import { useQuery, gql, useMutation } from '@apollo/client';

import { Delete} from '@mui/icons-material';

import Table from "@/components/Table";
import { Column } from "@/dataStructure/columns";
import {CategoryModel, EGender, ESortOrder, EWorkerRoleType, OptionModel, WorkerModel } from "@/dataStructure/categories";
import Button from "@/components/Button";
import Link from "next/link";
import Wrapper from "@/components/Wrapper";
import Backdrop from "@/components/Backdrop";
import Form, { TextForm } from "@/components/Form";

import _ from 'lodash'
import { useGetCategories } from "@/GraphQL/category";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { objectValues } from "@/utils/func";

const categoriesColumns = (transFunc: Function, delAction: Function) : Column<WorkerModel>[] => [
    {
        label: "name",
        minWidth: 170,
        align: "left",
        render: (worker: WorkerModel) => <Link href={`/workers/${worker._id}`}><span style={{textDecoration: 'underline'}}>{`${worker.fullName}`}</span></Link>,
        alias: "fullName",

    },
    {
        label: "phone",
        minWidth: 170,
        align: "left",
        render: (worker: WorkerModel) => worker.phoneNumber,
        alias: "phoneNumber",

    },
    {
        label: "dob",
        minWidth: 170,
        align: "left",
        render: (worker: WorkerModel) => worker.dob,
        alias: "dob",

    },
    {
        label: "gender",
        minWidth: 170,
        align: "left",
        render: (worker: WorkerModel) => transFunc(worker.gender),
        alias: "gender",

    },
    {
        label: "email",
        minWidth: 170,
        align: "left",
        render: (worker: WorkerModel) => worker.email,
        alias: "email",

    },
    {
        label: "role",
        minWidth: 170,
        align: "left",
        render: (worker: WorkerModel) => transFunc(worker.role),
        alias: "role",
    },
    {
        label: "actions",
        minWidth: 170,
        align: "left",
        render: (worker: WorkerModel) => <span>
            <Button label="" startIcon={<Delete />} onClick={() => delAction(worker)}/>
        </span>,
        alias: "updatedAt",

    }
]

const GET_WORKERS = gql`
  query workerSearch($paginationInput: OffsetPaginationInput! 
        $optionInput: OffsetPaginationOptionInput) {
            workerSearch(paginationInput: $paginationInput, optionInput: $optionInput) {
                nodes {
                    _id
                    phoneNumber
                    fullName
                    role
                    isAvailable
                    isActive
                    createdAt
                    updatedAt
                    dob
                    email
                    gender

                }
                pageNumber
                pageSize
                totalCount
            }
  }
`;

const CREATE_WORKER = gql`
mutation createWorker($input: WorkerCreateInput!) {
    createWorker(input: $input) {
        _id
    }
    }

`

const DELETE_WORKER = gql`
    mutation deleteWorkerById($id: ObjectId!) {
        deleteWorkerById(id: $id) {
            success
            message
        }
}
`

const WorkerForm =  (categories: CategoryModel[]) => ([
    {
        label: "firstName",
        alias: "firstName",
        value: "",
        type: "text",
        required: true,
        fullWidth: true,
    },
    {
        label: "lastName",
        alias: "lastName",
        value: "",
        type: "text",
        required: true,
        fullWidth: true
    },
    {
        label: "gender",
        alias: "gender",
        value: "",
        type: "dropdown",
        required: true,
        fullWidth: true,
        options: objectValues(EGender).map(item => ({name: item, _id: item}))
    },
    {
        label: "phoneNumber",
        alias: "phoneNumber",
        value: "",
        type: "text",
        required: true,
        fullWidth: true,
    },
    {
        label: "role",
        alias: "role",
        value: "",
        type: "dropdown",
        required: true,
        fullWidth: true,
        options: objectValues(EWorkerRoleType).map(item => ({name: item, _id: item}))
    },
    {
        label: "category",
        alias: "categoryId",
        value: "",
        type: "dropdown",
        required: true,
        fullWidth: true,
        options: categories.map(item => ({name: item.name, _id: item._id}))
    },
    {
        label: "uploadImage",
        alias: "imageUrl",
        value: "",
        type: "image",
        required: true,
        fullWidth: true,
    },

])


const Workers: React.FC = () => {
    const { t } = useTranslation('common')
    const { loading, error, data, refetch } = useQuery(GET_WORKERS, { variables: { paginationInput: {
        limit: 3,
        pageNumber: 1,
        sortOrder: 'ASC'
    },
    optionInput: {
        isGetAll: true
    } } });

    const [open, setOpen] = React.useState(false);
    const [updateOpen, setUpdateOpen] = React.useState('');
    const [form, setForm] = React.useState<TextForm<WorkerModel>[]>([])

    const [mutateDelete] = useMutation(DELETE_WORKER)
    const [mutate] = useMutation(CREATE_WORKER, {
        onCompleted: async (data: OptionModel) => {
            handleClose()
            refetch()
        }
    })
    const { getCategoryStatus, getCategoryError, getCategoryResult } = useGetCategories({ variables: { paginationInput: {
        limit: 3,
        pageNumber: 1,
    },
    optionInput: {
        isGetAll: true
    } } });

    const delworker = (worker: WorkerModel) => {
        mutateDelete({variables: {id: worker._id}})
    }

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

        mutate({variables: {input: data}})
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newForm = _.cloneDeep(form)

        newForm[index].value = event.target.value
        setForm(newForm)
        
    }

    useEffect(() => {
        setForm(WorkerForm(getCategoryResult?.categorySearch?.nodes || []))
    },[getCategoryResult])

    if(loading) return <div>Loading...</div>
    if(error) return <div>Error...</div>

  return <Wrapper label={t("workers")}>
    <Backdrop btnLabel={t("workerObj.add") as string} show={open} update={updateOpen}>
        <Form
            form={form} 
            saveBtnLabel={t("save") as string} 
            cancelBtnLabel={t("cancel") as string} 
            target="WORKER"
            cancelAction={handleClose}
            submitAction={handleSave}
            handleChange={handleChange}
        />
    </Backdrop>
    <Table rows={[...data.workerSearch.nodes]} columns={categoriesColumns(t, delworker)}/>
    </Wrapper>;
};

export const getServerSideProps = async ({ locale }: { locale: string }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? "vi", ["common"])),
      },
    };
  }

export default Workers;