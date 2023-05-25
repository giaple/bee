import React from "react";

import Table from "@/components/Table";
import { Column } from "@/dataStructure/columns";
import { CategoryModel, CustomerModel, ESortOrder, TransactionModel } from "@/dataStructure/categories";
import Link from "next/link";
import Wrapper from "@/components/Wrapper";
import { useTransactions } from "@/GraphQL/transaction";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const transactionsColumns = (transFunc: Function) : Column<TransactionModel>[] => [
    {
        label: "id",
        minWidth: 170,
        align: "left",
        render: (transaction: TransactionModel) => <Link href={`/transactions/${transaction._id}`}><span style={{textDecoration: 'underline'}}>{`${transaction._id}`}</span></Link>,
        alias: "_id",

    },
    {
        label: "amount",
        minWidth: 170,
        align: "left",
        render: (transaction: TransactionModel) => transaction.amount,
        alias: "amount",

    },
    {
        label: "paymentMethod",
        minWidth: 170,
        align: "left",
        render: (transaction: TransactionModel) => transaction.paymentMethod,
        alias: "paymentMethod",

    },
    {
        label: "status",
        minWidth: 170,
        align: "left",
        render: (transaction: TransactionModel) => transFunc(transaction.status),
        alias: "status",

    },
    {
        label: "user",
        minWidth: 170,
        align: "left",
        render: (transaction: TransactionModel) => transaction.userId,
        alias: "userId",

    },
    {
        label: "note",
        minWidth: 170,
        align: "left",
        render: (transaction: TransactionModel) => transaction.note,
        alias: "note",
    }
]



const Customers: React.FC = () => {
    const { t } = useTranslation('common')
    const { getTransactionsResult, getTransactionsError, getTransactionsStatus, getTransactionsRefech } = useTransactions({ variables: { paginationInput: {
        limit: 3,
        pageNumber: 1,
    },
    optionInput: {
        isGetAll: true
    } } });

    if(getTransactionsStatus) return <div>Loading...</div>
    if(getTransactionsError) return <div>Error...</div>

  return <Wrapper label={t("transactions")}>
    <Table rows={getTransactionsResult?.transactionSearch.nodes || []} columns={transactionsColumns(t)}/>
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