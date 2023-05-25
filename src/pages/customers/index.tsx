import React from "react";
import { useQuery, gql, useMutation } from '@apollo/client';

import { Delete} from '@mui/icons-material';

import Table from "@/components/Table";
import { Column } from "@/dataStructure/columns";
import { CategoryModel, CustomerModel } from "@/dataStructure/categories";
import Button from "@/components/Button";
import Link from "next/link";
import Wrapper from "@/components/Wrapper";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const categoriesColumns = (transFunc: Function, delAction: Function) : Column<CustomerModel>[] => [
    {
        label: "name",
        minWidth: 170,
        align: "left",
        render: (customer: CustomerModel) => <Link href={`/customers/${customer._id}`}><span style={{textDecoration: 'underline'}}>{`${customer.fullName}`}</span></Link>,
        alias: "fullName",

    },
    {
        label: "phone",
        minWidth: 170,
        align: "left",
        render: (category: CustomerModel) => category.phoneNumber,
        alias: "phoneNumber",

    },
    {
        label: "dob",
        minWidth: 170,
        align: "left",
        render: (category: CustomerModel) => category.dob,
        alias: "dob",

    },
    {
        label: "gender",
        minWidth: 170,
        align: "left",
        render: (category: CustomerModel) => transFunc(category.gender),
        alias: "gender",

    },
    {
        label: "email",
        minWidth: 170,
        align: "left",
        render: (category: CustomerModel) => category.email,
        alias: "email",

    },
    {
        label: "address",
        minWidth: 170,
        align: "left",
        render: (category: CustomerModel) => category.address,
        alias: "address",
    },
    {
        label: "actions",
        minWidth: 170,
        align: "left",
        render: (category: CustomerModel) => <span>
            <Button label="" startIcon={<Delete />} onClick={() => delAction(category)}/>
        </span>,
        alias: "updatedAt",

    }
]

const GET_CUSTOMERS = gql`
  query customerSearch($paginationInput: OffsetPaginationInput! 
        $optionInput: OffsetPaginationOptionInput) {
            customerSearch(paginationInput: $paginationInput, optionInput: $optionInput) {
                nodes {
                    _id,
                    address
                    dob,
                    fullName,
                    gender,
                    phoneNumber,
                    email

                }
                pageNumber
                pageSize
                totalCount
            }
  }
`;

const DELETE_CUSTOMER = gql`
    mutation deleteCustomerById($id: ObjectId!) {
        deleteCustomerById(id: $id) {
            success
            message
        }
}
`

const Customers: React.FC = () => {
    const { t } = useTranslation('common')
    const { loading, error, data } = useQuery(GET_CUSTOMERS, { variables: { paginationInput: {
        limit: 3,
        pageNumber: 1,
        sortOrder: 'ASC'
    },
    optionInput: {
        isGetAll: true
    } } });

    const [mutateDelete] = useMutation(DELETE_CUSTOMER)

    const delCategory = (category: CategoryModel) => {
        mutateDelete({variables: {id: category._id}})
    }

    if(loading) return <div>Loading...</div>
    if(error) return <div>Error...</div>

  return <Wrapper label={t("customers")}>
    <Table rows={[...data.customerSearch.nodes]} columns={categoriesColumns(t, delCategory)}/>
    </Wrapper>;
};

export const getServerSideProps = async ({ locale }: { locale: string }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? "vi", ["common"])),
      },
    };
  }

export default Customers;