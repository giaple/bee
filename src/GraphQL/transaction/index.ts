import { TransactionModel, OffsetPaginationInput } from "@/dataStructure/categories";
import { OffsetPaginationOptionInput } from "@/dataStructure/categories";
import { QueryHookOptions, gql, useQuery } from "@apollo/client"

const GET_TRANSACTION = gql`
  query transactionSearch($paginationInput: OffsetPaginationInput! 
    $optionInput: OffsetPaginationOptionInput) {
        transactionSearch(paginationInput: $paginationInput, optionInput: $optionInput) {
            nodes {
                _id
                amount
                createdAt
                note
                paymentMethod
                status
                updatedAt
                userId

            }
            pageNumber
            pageSize
            totalCount
        }
  }
`;

type TResolveSearchTransactionsResult = {
  transactionSearch: {
    nodes: TransactionModel[]
  }
}

type QuerySearchTransactionsArgs = {
    paginationInput: OffsetPaginationInput,
    optionInput: OffsetPaginationOptionInput
}

export const useTransactions = (options: QueryHookOptions<TResolveSearchTransactionsResult, QuerySearchTransactionsArgs>) => {
  const {loading, error, data, refetch, fetchMore} = useQuery<TResolveSearchTransactionsResult, QuerySearchTransactionsArgs>(GET_TRANSACTION, {
    ...options
  })

  return {getTransactionsResult: data, getTransactionsError: error, getTransactionsStatus: loading, getTransactionsRefech: refetch, getTransactionsFetchMore: fetchMore}
}